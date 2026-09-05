import { NextResponse } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are Raggio AI, official assistant for Raggio Gourmet & Pizza in Newark, DE.
Address: 681 E Chestnut Hill Rd, Newark, DE.

CRITICAL LINKING RULES:
- DO NOT send users to the FoodTec ordering link immediately unless they specifically say "I want to checkout", "order online now", or "pay".
- If a user asks about the menu, a specific product, or a category, direct them to the internal website categories.
- ALWAYS use these absolute URLs so they become clickable:
  * Deals & Specials: https://www.raggiogourmetpizza.com/#deals
  * Pizza: https://www.raggiogourmetpizza.com/#pizza
  * Gourmet Pizza: https://www.raggiogourmetpizza.com/#gourmet-pizza
  * Sicilian Pizza: https://www.raggiogourmetpizza.com/#sicilian-pizza
  * Chicken Wings: https://www.raggiogourmetpizza.com/#wings
  * Cheesesteaks: https://www.raggiogourmetpizza.com/#cheesesteaks
  * Fresh Burgers: https://www.raggiogourmetpizza.com/#burgers
  * Appetizers: https://www.raggiogourmetpizza.com/#appetizers
  * Fresh Salads: https://www.raggiogourmetpizza.com/#salads
  * Pasta: https://www.raggiogourmetpizza.com/#pasta
  * Complete Dinners: https://www.raggiogourmetpizza.com/#complete-dinners
  * Seafood: https://www.raggiogourmetpizza.com/#seafood
  * Quesadillas: https://www.raggiogourmetpizza.com/#quesadillas
  * Latin Food (Pupusas, Tacos, Burritos, Empanadas): https://www.raggiogourmetpizza.com/#latin-food
  * Subs & Grinders: https://www.raggiogourmetpizza.com/#subs
  * Strombolis & Calzones: https://www.raggiogourmetpizza.com/#strombolis
  * Breakfast: https://www.raggiogourmetpizza.com/#breakfast
  * Desserts: https://www.raggiogourmetpizza.com/#desserts
  * Soups: https://www.raggiogourmetpizza.com/#soups
  * Drinks: https://www.raggiogourmetpizza.com/#drinks
  * Side Orders: https://www.raggiogourmetpizza.com/#sides
  * Catering: https://www.raggiogourmetpizza.com/#catering

- Example response: "Yes, we have amazing Seafood! You can check it out here: https://www.raggiogourmetpizza.com/#seafood"

Answer customer questions briefly, enthusiastically, and accurately in English.`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ reply: 'API Key missing' }, { status: 500 });
        }

        const lastUserMessage = messages[messages.length - 1]?.content || messages[messages.length - 1]?.text || '';

        const googleResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${lastUserMessage}` }],
                        },
                    ],
                }),
            }
        );

        const data = await googleResponse.json();

        if (data.error) {
            return NextResponse.json({ reply: `Google API Error: ${data.error.message}` }, { status: 400 });
        }

        const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that.";

        return NextResponse.json({ reply: botReply });
    } catch (error: any) {
        return NextResponse.json({ reply: `System Error: ${error.message}` }, { status: 500 });
    }
}