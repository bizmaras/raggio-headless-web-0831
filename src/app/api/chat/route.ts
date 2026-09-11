import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { isValidOrigin } from '@/lib/security';

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

TONE: Be warm, enthusiastic, and brief. You represent a family gourmet pizza & Latin food restaurant. Always finish your sentences completely. ALWAYS use Markdown bolding (**like this**) to highlight key menu items and recommendations so they stand out. Use Markdown bullet lines (starting with "- ") whenever you list more than two things — especially ingredients (see INGREDIENTS & PRODUCT DETAILS below). Being brief means short lines, NOT skipping the list.

─────────────────────────────
OPERATIONAL INFO
─────────────────────────────
${hoursStatusLine}
General hours: Sun–Thu 9:00 AM–9:00 PM, Fri–Sat 9:00 AM–10:00 PM.
Delivery: We deliver to Newark, DE and surrounding zip codes. Exact minimums confirmed at checkout.
Minimum order / delivery fee: Confirmed at checkout.

─────────────────────────────
INGREDIENTS & PRODUCT DETAILS (STRICT FORMAT)
─────────────────────────────
When a customer asks what is IN a product — ingredients, toppings, "what's in the white pizza?", "what comes on it?", allergens, or how something is made — NEVER bury the ingredients inside a long paragraph. ALWAYS answer with a short bulleted list:
- Open with ONE short, warm sentence naming the item in bold (e.g. "Our **White Pizza** is a customer favorite!").
- Then list EVERY ingredient on its own bullet line starting with "- ".
- Bold the ingredient name itself, then add a few words of appetizing detail after it.
- Close with ONE short line: an upsell, or the menu link for that category.
Keep bullets tight (one line each) and never merge two ingredients into one bullet.

Example of the REQUIRED shape:
Our **White Pizza** is a house favorite! 🤍
- **Fresh Garlic** — roasted for a sweet, mellow bite
- **Ricotta Cheese** — creamy and lightly whipped
- **Mozzarella** — melted golden on top
- **Italian Herbs** — oregano, basil & cracked pepper
- **Olive Oil** — extra virgin, brushed on the crust
See it here: https://www.raggiogourmetpizza.com/#pizza

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
    // Clean up expired entries periodically to prevent memory leaks
    if (rateLimitMap.size > 500) {
        for (const [key, val] of rateLimitMap.entries()) {
            if (now - val.windowStart > RATE_LIMIT_WINDOW_MS) {
                rateLimitMap.delete(key);
            }
        }
    }

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

const MAX_MESSAGES_COUNT = 30;
const MAX_MESSAGE_LENGTH = 1500;

export async function POST(req: Request) {
    try {
        if (!isValidOrigin(req)) {
            return NextResponse.json({ reply: 'Forbidden origin.' }, { status: 403 });
        }

        const identifier = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
        if (isRateLimited(identifier)) {
            return NextResponse.json({ reply: "You're sending messages too fast! Please wait a moment." }, { status: 429 });
        }

        const body = await req.json();
        const { messages } = body || {};
        if (!Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ reply: 'No message provided.' }, { status: 400 });
        }

        if (messages.length > MAX_MESSAGES_COUNT) {
            return NextResponse.json({ reply: 'Conversation history too long. Please refresh the chat.' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('Missing GEMINI_API_KEY environment variable');
            return NextResponse.json({ reply: 'Chat service is temporarily unavailable.' }, { status: 503 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-flash-latest',
            systemInstruction: buildSystemPrompt(),
        });

        // 1. Mesaj geçmişini Gemini formatına dönüştür ve boyut sınırlarını doğrula
        const rawHistory = (messages as IncomingMessage[])
            .filter((m) => {
                const str = (m.content || m.text || '').trim();
                return str.length > 0;
            })
            .map((m) => {
                const str = (m.content || m.text || '').trim();
                const sanitizedText = str.length > MAX_MESSAGE_LENGTH ? str.slice(0, MAX_MESSAGE_LENGTH) : str;
                return {
                    role: (m.role === 'assistant' || m.role === 'model' || m.sender === 'bot') ? ('model' as const) : ('user' as const),
                    parts: [{ text: sanitizedText }],
                };
            });

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
    } catch (error: unknown) {
        console.error('Gemini API Error:', error);
        return NextResponse.json(
            { reply: "I'm having trouble connecting right now. Please call us at (302) 369-0553 or try again shortly!" },
            { status: 500 }
        );
    }
}