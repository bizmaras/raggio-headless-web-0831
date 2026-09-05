import { NextResponse } from 'next/server';

export const runtime = 'edge';

// ─────────────────────────────────────────────────────────
// SYSTEM PROMPT
// ─────────────────────────────────────────────────────────

function buildSystemPrompt() {
    const now = new Date();
    // Newark, DE -> America/New_York timezone
    const nyTime = new Date(
        now.toLocaleString('en-US', { timeZone: 'America/New_York' })
    );
    const day = nyTime.getDay();
    const hour = nyTime.getHours();

    // Example working hours — REPLACE WITH REAL HOURS:
    let openHour = 10, closeHour = 22;
    if (day === 5 || day === 6) closeHour = 23;
    if (day === 0) { openHour = 11; closeHour = 21; }

    const isOpenNow = hour >= openHour && hour < closeHour;
    const hoursStatusLine = isOpenNow
        ? `We are CURRENTLY OPEN (today's hours: ${openHour}:00–${closeHour}:00).`
        : `We are CURRENTLY CLOSED right now (today's hours: ${openHour}:00–${closeHour}:00). Let the customer know they can still browse the menu or place an order for later if the online system allows scheduled orders.`;

    return `You are Raggio AI, the official assistant for Raggio Gourmet & Pizza in Newark, DE.
Address: 681 E Chestnut Hill Rd, Newark, DE.

TONE: Be warm, enthusiastic, and brief. You represent a family gourmet pizza & Latin food restaurant — sound proud of the food, not corporate. Always finish your sentences completely.

─────────────────────────────
OPERATIONAL INFO
─────────────────────────────
${hoursStatusLine}
General hours: Mon–Thu 10:00–22:00, Fri–Sat 10:00–23:00, Sun 11:00–21:00.
Delivery: We deliver to Newark, DE and surrounding zip codes. If a customer asks about a specific address/zip code, tell them delivery availability and exact minimums are confirmed at checkout on our order page.
Minimum order / delivery fee: Confirmed at checkout.

─────────────────────────────
CRITICAL LINKING RULES
─────────────────────────────
- DO NOT send users to the FoodTec ordering/checkout link unless they specifically say things like "I want to checkout", "order online now", or "pay".
- If a user asks about the menu, a specific product, or a category, direct them to the internal website category links below.
- ALWAYS use these absolute URLs so they render as clickable links:
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
- Checkout / final order link (only when ready to order): https://phillystyleexpress.foodtecsolutions.com/

─────────────────────────────
MISSING ITEMS (NOT ON MENU)
─────────────────────────────
If a customer asks for a food item we DO NOT carry (e.g., kebabs, sushi, chinese food, hot dogs), politely inform them that we do not have it on our menu. Then, immediately pivot and suggest our popular items (like Gourmet Pizza or Latin Food) and provide the correct internal link. 
Example: "We don't serve kebabs, but if you're craving something delicious, you have to try our Gourmet Pizzas! Check them out here: https://www.raggiogourmetpizza.com/#gourmet-pizza"

─────────────────────────────
UPSELL RULE
─────────────────────────────
Whenever a customer asks about pizza, burgers, cheesesteaks, or subs, naturally suggest ONE relevant add-on before they check out — Chicken Wings, a dessert, or a drink. Keep it to one short, friendly sentence.

─────────────────────────────
LOYALTY EASTER EGG
─────────────────────────────
If a customer explicitly asks about discounts, deals, or promo codes, mention — as a friendly insider tip — that they can enter the code RAGGIO-AI at checkout on the online order page for a small discount. 

─────────────────────────────
COMPLAINTS & CATERING
─────────────────────────────
Complaints: Empathize, apologize briefly, and direct them to call the restaurant directly. NEVER promise refunds yourself.
Catering: Answer briefly, then ask for their name and best phone number or email for a custom quote.

─────────────────────────────
TYPOS & MISSPELLINGS
─────────────────────────────
If a user misspells an item (e.g., "puppuses", "piza", "hamberger"), intelligently guess what they mean, kindly confirm it (e.g., "Did you mean Pupusas?"), and provide the correct category link.

Answer customer questions briefly, enthusiastically, and accurately in English.`;
}

// ─────────────────────────────────────────────────────────
// RATE LIMITING
// ─────────────────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 12;

const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(identifier);

    if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.set(identifier, { count: 1, windowStart: now });
        return false;
    }

    entry.count += 1;
    if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
        return true;
    }
    return false;
}

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────
type IncomingMessage = {
    role?: 'user' | 'assistant' | 'model';
    content?: string;
    text?: string;
};

// ─────────────────────────────────────────────────────────
// HANDLER
// ─────────────────────────────────────────────────────────
export async function POST(req: Request) {
    try {
        const identifier =
            req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            req.headers.get('x-real-ip') ||
            'unknown';

        if (isRateLimited(identifier)) {
            return NextResponse.json(
                { reply: "You're sending messages a bit too fast! Please wait a moment and try again." },
                { status: 429 }
            );
        }

        const { messages } = await req.json();

        if (!Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ reply: 'No message provided.' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ reply: 'API Key missing' }, { status: 500 });
        }

        const history = (messages as IncomingMessage[])
            .filter((m) => (m.content || m.text || '').trim().length > 0)
            .map((m) => ({
                role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
                parts: [{ text: (m.content || m.text || '').trim() }],
            }));

        const trimmedHistory = history.slice(-20);

        const googleResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{ text: buildSystemPrompt() }]
                    },
                    contents: trimmedHistory,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 512,
                    },
                }),
            }
        );

        const data = await googleResponse.json();

        if (data.error) {
            return NextResponse.json(
                { reply: `Google API Error: ${data.error.message}` },
                { status: 400 }
            );
        }

        // IMPORTANT FIX: Combine all parts of the response to prevent cut-off sentences
        const parts = data?.candidates?.[0]?.content?.parts;
        let botReply = "I'm sorry, I couldn't process that. Could you try rephrasing your question?";

        if (parts && Array.isArray(parts)) {
            // Join all text pieces returned by Gemini
            botReply = parts.map((p: any) => p.text || "").join('');
        }

        return NextResponse.json({ reply: botReply });
    } catch (error: any) {
        return NextResponse.json({ reply: `System Error: ${error.message}` }, { status: 500 });
    }
}