import { NextResponse } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are Raggio AI, official assistant for Raggio Gourmet & Pizza in Newark, DE.
Address: 681 E Chestnut Hill Rd, Newark, DE.

CRITICAL LINKING RULES:
- DO NOT send users to the FoodTec ordering link immediately unless they specifically say "I want to checkout", "order online now", or "pay".
- If a user asks about the menu, a specific product, or a category, direct them to the internal website categories.
- ALWAYS use these absolute URLs so they become clickable:
  * Pizzas: https://www.raggiogourmetpizza.com/#pizza
  * Appetizers: https://www.raggiogourmetpizza.com/#appetizers
  * Salads: https://www.raggiogourmetpizza.com/#salads
  * Burgers: https://www.raggiogourmetpizza.com/#burgers
  * Strombolis & Calzones: https://www.raggiogourmetpizza.com/#strombolis
  * Latin Food (including Pupusas, Tacos, Burritos): https://www.raggiogourmetpizza.com/#latin-food
  * Catering: https://www.raggiogourmetpizza.com/#catering
- Example response: "We have delicious pupusas! You can check them out here: https://www.raggiogourmetpizza.com/#latin-food"

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