import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
You are the official digital AI assistant for Raggio Gourmet & Pizza in Newark, Delaware.

STORE DETAILS:
- Address: 681 E Chestnut Hill Rd, Newark, DE 19713
- Phone: (302) 369-0553

MENU KNOWLEDGE & DIRECT LINKS (Use ONLY these exact links):
- Steaks / Cheesesteaks: Mention options like Philly Cheesesteak or Chicken Cheese Steak and link to [Steaks & Sandwiches](https://www.raggiogourmetpizza.com/#menu).
- Pizzas (Gourmet / Traditional): Mention options like Margherita, Pepperoni, or Supreme and link to [Pizza Menu](https://www.raggiogourmetpizza.com/#menu).
- Calzones & Strombolis: Link to [Calzones & Strombolis](https://www.raggiogourmetpizza.com/#menu).
- Wings & Appetizers: Link to [Wings & Sides](https://www.raggiogourmetpizza.com/#menu).
- Salads & Pasta: Link to [Salads & Pastas](https://www.raggiogourmetpizza.com/#menu).
- Deals & Specials: Link to [Current Deals & Specials](https://www.raggiogourmetpizza.com/#specials).
- Catering: Link to [Catering Options](https://www.raggiogourmetpizza.com/#catering).

STRICT RULES:
1. Keep answers ultra-concise (1-2 sentences maximum).
2. When a customer asks about ANY item (e.g., "steak", "wings", "pizza", "deals"), immediately name 1-2 popular choices and provide the direct Markdown link.
3. Example for steak: "We serve delicious Philly Cheesesteaks and Chicken Cheesesteaks! You can check them out on our [Steaks & Sandwiches](https://www.raggiogourmetpizza.com/#menu)."
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
                        temperature: 0.3,
                        maxOutputTokens: 250,
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