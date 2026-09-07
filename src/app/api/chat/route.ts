import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

// ─────────────────────────────────────────────────────────
// SYSTEM PROMPT
// ─────────────────────────────────────────────────────────

function buildSystemPrompt() {
    const now = new Date();
    const nyTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const day = nyTime.getDay(); // 0 = Sunday, 1 = Monday ... 6 = Saturday
    const hour = nyTime.getHours();

    // Gerçek çalışma saatleri: Pazar-Perşembe 09:00 - 21:00 (9 AM - 9 PM)
    let openHour = 9, closeHour = 21;

    // Cuma (5) ve Cumartesi (6) 09:00 - 22:00 (9 AM - 10 PM)
    if (day === 5 || day === 6) {
        closeHour = 22;
    }

    const isOpenNow = hour >= openHour && hour < closeHour;

    // Botun Amerikan AM/PM formatında konuşması için hazırlık
    const openAmPm = "9:00 AM";
    const closeAmPm = closeHour === 21 ? "9:00 PM" : "10:00 PM";

    const hoursStatusLine = isOpenNow
        ? `We are CURRENTLY OPEN (today's hours: ${openAmPm}–${closeAmPm}).`
        : `We are CURRENTLY CLOSED right now (today's hours: ${openAmPm}–${closeAmPm}).`;

    return `You are Raggio AI, the official assistant for Raggio Gourmet & Pizza in Newark, DE.
Address: 681 E Chestnut Hill Rd, Newark, DE.

TONE: Be warm, enthusiastic, and brief. You represent a family gourmet pizza & Latin food restaurant. Always finish your sentences completely. ALWAYS use Markdown bolding (**like this**) to highlight key menu items and recommendations so they stand out

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

// Claude API İstemcisi
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

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

        if (!process.env.ANTHROPIC_API_KEY) {
            return NextResponse.json({ reply: 'API Key missing' }, { status: 500 });
        }

        // Mesaj geçmişini Claude'un beklediği formata ('user' / 'assistant') çeviriyoruz
        const history: Anthropic.MessageParam[] = (messages as IncomingMessage[])
            .filter((m) => (m.content || m.text || '').trim().length > 0)
            .map((m) => ({
                role: (m.role === 'assistant' || m.role === 'model' || m.sender === 'bot') ? 'assistant' : 'user',
                content: (m.content || m.text || '').trim(),
            }));

        const trimmedHistory = history.slice(-20);

        // Claude 3.5 Sonnet Çağrısı
        const response = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            temperature: 0.7,
            system: buildSystemPrompt(), // Sistem komutunu özel parametre ile gönderiyoruz
            messages: trimmedHistory,
        });

        // Yanıtı çıkar
        const textContent = response.content.find((c) => c.type === 'text');
        const botReply = textContent ? textContent.text : "I'm sorry, I couldn't process that. Could you try rephrasing your question?";

        return NextResponse.json({ reply: botReply });
    } catch (error: any) {
        console.error('Claude API Error:', error);
        return NextResponse.json({ reply: `System Error: ${error.message}` }, { status: 500 });
    }
}