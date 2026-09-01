import { NextResponse } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `
You are Raggio AI for Raggio Gourmet & Pizza in Newark, DE.

RULES:
1. Max 2 short sentences. Never cut off mid-sentence.
2. Recommend real items and end with the exact Markdown link.

LINKS:
- Steaks: [Steaks & Sandwiches](https://www.raggiogourmetpizza.com/#menu)
- Pizza: [Pizza Menu](https://www.raggiogourmetpizza.com/#menu)
- Deals: [Current Deals](https://www.raggiogourmetpizza.com/#specials)
- Catering: [Catering Options](https://www.raggiogourmetpizza.com/#catering)

Example:
User: do you have steak?
Model: We serve delicious Philly Cheesesteaks and Chicken Cheesesteaks! View them here: [Steaks & Sandwiches](https://www.raggiogourmetpizza.com/#menu).
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
                    generationConfig: { temperature: 0.4, maxOutputTokens: 400 },
                }),
            }
        );

        const data = await response.json();
        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text;

        return NextResponse.json({ reply: botReply || 'I am sorry, I could not generate a response.' });
    } catch (error) {
        return NextResponse.json({ reply: 'Server error.' }, { status: 500 });
    }
}