import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// ─────────────────────────────────────────────────────────
// SYSTEM PROMPT
// ─────────────────────────────────────────────────────────

function buildSystemPrompt() {
    const now = new Date();
    const nyTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const day = nyTime.getDay(); // 0 = Sunday, 1 = Monday ... 6 = Saturday
    const hour = nyTime.getHours();

    let openHour = 9, closeHour = 21;

    if (day === 5 || day === 6) {
        closeHour = 22;
    }

    const isOpenNow = hour >= openHour && hour < closeHour;
    const openAmPm = "9:00 AM";
    const closeAmPm = closeHour === 21 ? "9:00 PM" : "10:00 PM";

    const hoursStatusLine = isOpenNow
        ? `We are CURRENTLY OPEN (today's hours: ${openAmPm}–${closeAmPm}).`
        : `We are CURRENTLY CLOSED right now (today's hours: ${openAmPm}–${closeAmPm}).`;

    return `You are Raggio AI, the official assistant for Raggio Gourmet & Pizza in Newark, DE.
Address: 681 E Chestnut Hill Rd, Newark, DE.

TONE: Be warm, enthusiastic, and brief. You represent a family gourmet pizza & Latin food restaurant. Always finish your sentences completely. ALWAYS use Markdown bolding (**like this**) to highlight key menu items and recommendations so they stand out.

─────────────────────────────
OPERATIONAL INFO
─────────────────────────────
${hoursStatusLine}
General hours: Sun–Thu 9:00 AM–9:00 PM, Fri–Sat 9:00 AM–10:00 PM.
Delivery: We deliver to Newark, DE and surrounding zip codes. Exact minimums confirmed at checkout.
Minimum order / delivery fee: Confirmed at checkout.

─────────────────────────────
CRITICAL LINKING RULES
─────────────────────────────
- DO NOT send users to the FoodTec ordering/checkout link unless they specifically say "I want to checkout", "order online now", or "pay".
- If a user asks about the menu or a product, ALWAYS direct them to these absolute URLs:
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
  * Seafood: https://www.raggiogourmetpizza.com/#seafood
  * Quesadillas: https://www.raggiogourmetpizza.com/#quesadillas
  * Latin Food (Pupusas, Tacos, Burritos): https://www.raggiogourmetpizza.com/#latin-food
  * Subs & Grinders: https://www.raggiogourmetpizza.com/#subs
  * Strombolis & Calzones: https://www.raggiogourmetpizza.com/#strombolis
  * Breakfast: https://www.raggiogourmetpizza.com/#breakfast
  * Desserts: https://www.raggiogourmetpizza.com/#desserts
  * Soups: https://www.raggiogourmetpizza.com/#soups
  * Drinks: https://www.raggiogourmetpizza.com/#drinks
  * Catering: https://www.raggiogourmetpizza.com/#catering
- Checkout link (only when ready to order): https://phillystyleexpress.foodtecsolutions.com/

─────────────────────────────
MISSING ITEMS (NOT ON MENU)
─────────────────────────────
If asked for an item we do not have (like kebabs, sushi), say we don't carry it, then suggest Gourmet Pizzas or Latin Food with a link.

─────────────────────────────
UPSELL & LOYALTY
─────────────────────────────
Upsell: Briefly suggest wings, a drink, or dessert with pizza/burger orders.
Promo: If asked about deals/discounts, share code RAGGIO-AI for checkout.

─────────────────────────────
TYPOS & MISSPELLINGS
─────────────────────────────
If a user misspells an item (e.g., "puppuses"), guess what they mean, confirm it, and provide the link.

Answer briefly, enthusiastically, and accurately in English.`;
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
    return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

type IncomingMessage = {
    role?: 'user' | 'assistant' | 'model';
    sender?: 'user' | 'bot';
    content?: string;
    text?: string;
};

export async function POST(req: Request) {
    try {
        const identifier = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
        if (isRateLimited(identifier)) {
            return NextResponse.json({ reply: "You're sending messages too fast!" }, { status: 429 });
        }

        const { messages } = await req.json();
        if (!Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ reply: 'No message provided.' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ reply: 'API Key missing' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-flash-latest',
            systemInstruction: buildSystemPrompt(),
        });

        // 1. Mesaj geçmişini Gemini formatına dönüştür
        const rawHistory = (messages as IncomingMessage[])
            .filter((m) => (m.content || m.text || '').trim().length > 0)
            .map((m) => ({
                role: (m.role === 'assistant' || m.role === 'model' || m.sender === 'bot') ? ('model' as const) : ('user' as const),
                parts: [{ text: (m.content || m.text || '').trim() }],
            }));

        // 2. İlk kullanıcı mesajını bul (baştaki bot karşılama mesajlarını atla)
        const firstUserIndex = rawHistory.findIndex((m) => m.role === 'user');
        if (firstUserIndex === -1) {
            return NextResponse.json({ reply: 'How can I assist you with your order today?' });
        }

        const validHistory = rawHistory.slice(firstUserIndex);

        // 3. Son 20 mesajı alırken de ilk elemanın 'user' olmasını garantiye al
        let trimmed = validHistory.slice(-20);
        const firstUserInTrimmed = trimmed.findIndex((m) => m.role === 'user');
        if (firstUserInTrimmed > 0) {
            trimmed = trimmed.slice(firstUserInTrimmed);
        }

        const historyForChat = trimmed.slice(0, -1);
        const lastMessage = trimmed[trimmed.length - 1].parts[0].text;

        const chat = model.startChat({
            history: historyForChat,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
            },
        });

        const result = await chat.sendMessage(lastMessage);
        const responseText = result.response.text();

        return NextResponse.json({ reply: responseText });
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return NextResponse.json({ reply: `System Error: ${error.message}` }, { status: 500 });
    }
}