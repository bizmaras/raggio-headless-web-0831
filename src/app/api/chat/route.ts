import { NextResponse } from 'next/server';

const FOODTEC_URL = 'https://phillystyleexpress.foodtecsolutions.com/';

const SYSTEM_PROMPT = `
You are the official digital AI assistant for Raggio Gourmet & Pizza located in Newark, Delaware.
Your purpose is to help customers with menu inquiries, ingredient details, group portion sizes, and catering recommendations, while encouraging them to place their orders via FoodTec.

STORE DETAILS:
- Address: 681 E Chestnut Hill Rd, Newark, DE 19713
- Phone: (302) 369-0553
- Online Order Link: ${FOODTEC_URL}

GUIDELINES:
1. Provide concise, friendly, and professional responses in English.
2. For group size inquiries (e.g., "party of 20"), suggest appropriate options using Half Trays (serves 8-10) or Full Trays (serves 15-20).
3. Conclude helpful responses by inviting the user to place an online order using the link: ${FOODTEC_URL}.
4. Politely decline topics unrelated to Raggio Gourmet & Pizza.
`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'API key missing.' }, { status: 500 });
        }

        const contents = messages.map((m: { role: string; content: string }) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
        }));

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                    contents,
                    generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
                }),
            }
        );

        const data = await response.json();
        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I am sorry, please try again or visit our online ordering system.';

        return NextResponse.json({ reply: botReply });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}