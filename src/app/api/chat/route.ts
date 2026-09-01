import { NextResponse } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `
You are Raggio AI, the official digital assistant for Raggio Gourmet & Pizza in Newark, DE (681 E Chestnut Hill Rd).

COMPLETE MENU CATEGORIES & EXACT LINKS:
- Steaks & Cheesesteaks (Philly Cheesesteak, Chicken Steak): [Steaks & Sandwiches](https://www.raggiogourmetpizza.com/#menu)
- Pizzas (Gourmet, Traditional, Supreme, Meat Lovers): [Pizza Menu](https://www.raggiogourmetpizza.com/#menu)
- Calzones & Strombolis: [Calzones & Strombolis](https://www.raggiogourmetpizza.com/#menu)
- Wings, Appetizers & Sides: [Wings & Appetizers](https://www.raggiogourmetpizza.com/#menu)
- Salads & Fresh Greens: [Salads Menu](https://www.raggiogourmetpizza.com/#menu)
- Pasta & Italian Mains: [Pasta Menu](https://www.raggiogourmetpizza.com/#menu)
- Specials, Combos & Deals: [Current Deals & Specials](https://www.raggiogourmetpizza.com/#specials)
- Catering Services & Group Orders: [Catering Options](https://www.raggiogourmetpizza.com/#catering)

STRICT RULES:
1. Maximum 1-2 short sentences per response. Never leave text cut off.
2. If asked about ANY food item or menu section, mention popular options and attach the exact Markdown link.
3. Always respond in English.
`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ reply: 'GEMINI_API_KEY missing.' }, { status: 500 });
        }

        const contents = messages.map((m: { role: string; content: string }) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
        }));

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents,
                    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
                    generationConfig: { temperature: 0.3, maxOutputTokens: 400 },
                }),
            }
        );

        const data = await response.json();
        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text;

        return NextResponse.json({ reply: botReply || 'I am sorry, I could not process that request.' });
    } catch (error) {
        return NextResponse.json({ reply: 'Server error.' }, { status: 500 });
    }
}