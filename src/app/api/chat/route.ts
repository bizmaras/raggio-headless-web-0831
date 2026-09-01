import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
You are the official digital AI assistant for Raggio Gourmet & Pizza located in Newark, Delaware.
Your purpose is to help customers with menu inquiries, ingredient details, group portion sizes, and catering recommendations.

STORE DETAILS:
- Address: 681 E Chestnut Hill Rd, Newark, DE 19713
- Phone: (302) 369-0553

GUIDELINES:
1. Provide concise, friendly, and professional responses in English.
2. For group size inquiries (e.g., "party of 20"), suggest appropriate options using Half Trays (serves 8-10) or Full Trays (serves 15-20).
3. Politely decline topics unrelated to Raggio Gourmet & Pizza.
`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ reply: 'GEMINI_API_KEY is missing on Vercel Environment Variables.' }, { status: 500 });
        }

        const contents = messages.map((m: { role: string; content: string }) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
        }));

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents,
                    systemInstruction: {
                        parts: [{ text: SYSTEM_PROMPT }],
                    },
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 300,
                    },
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ reply: `Google API Error: ${data.error?.message || 'Invalid API Key or Request'}` });
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