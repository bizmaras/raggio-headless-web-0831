import { NextResponse } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are Raggio AI, official assistant for Raggio Gourmet & Pizza in Newark, DE.
Address: 681 E Chestnut Hill Rd, Newark, DE.
Order Link: https://phillystyleexpress.foodtecsolutions.com/
Answer customer questions about menu, specials, and catering briefly and accurately in English.`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ reply: 'API Key missing' }, { status: 500 });
        }

        const lastUserMessage = messages[messages.length - 1]?.content || messages[messages.length - 1]?.text || '';

        // Model ismini gemini-1.5-flash-latest olarak güncelledik (404 hatasını çözer)
        const googleResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${lastUserMessage}` }],
                        },
                    ],
                }),
            }
        );

        const data = await googleResponse.json();

        if (data.error) {
            return NextResponse.json({ reply: `Google API Error: ${data.error.message}` }, { status: 400 });
        }

        const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that.";

        return NextResponse.json({ reply: botReply });
    } catch (error: any) {
        return NextResponse.json({ reply: `System Error: ${error.message}` }, { status: 500 });
    }
}