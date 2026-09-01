import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
You are the official digital AI assistant for Raggio Gourmet & Pizza in Newark, Delaware.

STORE DETAILS:
- Address: 681 E Chestnut Hill Rd, Newark, DE 19713
- Phone: (302) 369-0553

VALID WEBSITE LINKS (Use ONLY these exact URLs):
- Menu & Pizza: https://www.raggiogourmetpizza.com/#menu
- Deals & Specials: https://www.raggiogourmetpizza.com/#specials
- Catering: https://www.raggiogourmetpizza.com/#catering
- Home: https://www.raggiogourmetpizza.com/

STRICT RULES:
1. Keep answers extremely short (max 1-2 sentences).
2. For "deals", "specials", or "promotions", ALWAYS link directly to [Our Current Deals](https://www.raggiogourmetpizza.com/#specials).
3. Do not list long text. Give a quick summary and provide the exact Markdown link.
4. Always respond in English.
`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ reply: 'GEMINI_API_KEY is missing on Vercel.' }, { status: 500 });
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
                    systemInstruction: {
                        parts: [{ text: SYSTEM_PROMPT }],
                    },
                    generationConfig: {
                        temperature: 0.4,
                        maxOutputTokens: 200, // Üretim hızını maksimuma çıkarmak için düşürüldü
                    },
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ reply: `Google API Error: ${data.error?.message || 'Error'}` });
        }

        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!botReply) {
            return NextResponse.json({ reply: 'I am sorry, I could not generate a response right now.' });
        }

        return NextResponse.json({ reply: botReply });
    } catch (error) {
        return NextResponse.json({ reply: 'Server error processing chat.' }, { status: 500 });
    }
}