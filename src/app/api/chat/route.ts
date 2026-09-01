import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
You are the official digital AI assistant for Raggio Gourmet & Pizza located in Newark, Delaware.
Your goal is to be highly proactive, helpful, and direct.

STORE DETAILS:
- Address: 681 E Chestnut Hill Rd, Newark, DE 19713
- Phone: (302) 369-0553
- Website Menu Links:
  * Traditional & Gourmet Pizzas: https://www.raggiogourmetpizza.com/menu?category=pizza
  * Calzones & Strombolis: https://www.raggiogourmetpizza.com/menu?category=calzones
  * Wings & Appetizers: https://www.raggiogourmetpizza.com/menu?category=wings
  * Catering Trays: https://www.raggiogourmetpizza.com/menu?category=catering

GUIDELINES:
1. Always respond concisely in English.
2. DO NOT list the entire menu in plain text to avoid long cutoffs. Instead, mention 2-3 top recommendations and IMMEDIATELY direct the customer to the exact category link on our website using Markdown links (e.g., "You can check our full selection on our [Pizza Menu](https://www.raggiogourmetpizza.com/menu?category=pizza)").
3. For catering inquiries, recommend Half Trays (8-10 people) or Full Trays (15-20 people) and share the catering link.
4. Politely decline topics unrelated to Raggio Gourmet & Pizza.
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
                        temperature: 0.7,
                        maxOutputTokens: 600, // Kesilmeleri önlemek için yükseltildi
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