'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const SYSTEM_PROMPT = `You are Raggio AI, the official digital assistant for Raggio Gourmet & Pizza.
Address: 681 E Chestnut Hill Rd, Newark, DE.
Order Link: https://phillystyleexpress.foodtecsolutions.com/

Your job is to answer customer questions about the menu, catering, and current promotions accurately.
Always be polite, concise, and helpful. Always respond in English.

### CURRENT PROMOTIONS & COUPON SPECIALS
1. 2 XL Pizzas 1 Topping Each: $32.99
2. Large 1 Topping Pizza & 20 Wings: $37.99
3. 2 Lrg 1 Topping Pizza, 20 Wings & Soda: $52.99
4. Large 1 Topping Pizza & 10 Wings: $29.99
5. Large Cheese Pizza with 3 Toppings: $19.99
6. 2 XL Cheese Pizzas & 20 Wings: $64.99
7. $5 OFF with Purchase of $40 or more

### REGULAR MENU (HIGHLIGHTS)
- Appetizers: French Fries ($4.99), Cheese Fries ($5.99), Cheesesteak Fries ($12.99), Mozzarella Sticks ($8.99), Jalapeno Poppers ($8.99).
- Breakfast: House 2 eggs & home fries ($10.99), Steak & Eggs ($22.99), Pancakes ($7.99).
- Cheesesteaks: Philly Cheesesteak ($10.99), The Philly Special ($12.99), Pizza Steak ($12.99).
- Burgers: Fresh Burger ($7.99), Cheeseburger ($8.99), Texas Cheeseburger ($12.99).
- Wings (BBQ, Garlic Parm, Spicy, Mango Habanero): Plain Jumbo ($8.99).
- Gourmet Pizza: Thin Crust The Works ($21.99), Buffalo Chicken Pizza ($21.99), Philly Cheesesteak Pizza ($23.99).
- Standard Pizza: Plain Cheese ($18.99), Pizza by the slice ($2.50).
- Sicilian Pizza: White Cheese ($18.99), Meat Lover ($23.99).
- Strombolis & Calzones: Cheese Calzone ($14.99), Philly Special Stromboli ($18.99).
- Subs & Grinders: Italian Sub ($12.99), Turkey Club ($12.99).
- Latin Food: Tacos ($11.99), Burritos ($11.99), Carne Asada ($17.99).
- Pasta: Spaghetti Meat Sauce ($16.99), Chicken Parmigiana ($17.99).
- Salads: Garden ($8.99), Caesar ($8.99), Grilled Chicken ($12.99).

### CATERING MENU
- Subs & Wraps Tray: Half $50.00 | Full $90.00 (Serves 8-10 / 15-20)
- Catering Appetizers: Cinnamon Bites (Half $45/Full $90), Mozzarella Sticks (Half $110/Full $220), Jumbo Shrimp (Half $80/Full $200).
- Catering Wings: Half Tray $59.99 | Full Tray $134.99
- Catering Fries: French/Curly (Half $45/Full $84.99).
- Catering Salads: Garden/Caesar (Half $40/Full $80), Chicken/Chef/Greek (Half $49.99/Full $99.99).
- Catering Pasta: Baked Ziti/Lasagna (Half $49.95/Full $89.99), Shrimp Parmigiana (Half $80/Full $160).
- Catering Latin: Tacos/Fajitas (Half $60/Full $140), Empanadas/Carne Asada (Half $100/Full $200).`;

export default function AIChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: 'Hello! Welcome to Raggio Gourmet & Pizza. How can I help you today?' },
    ]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
        setLoading(true);

        try {
            const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: 'user',
                                parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${userMessage}` }],
                            },
                        ],
                    }),
                }
            );

            const data = await response.json();
            const botReply =
                data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                "I'm sorry, I couldn't process that right now. Please try again.";

            setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { sender: 'bot', text: 'Connection error. Please check your network and try again.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-5 z-50">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-[#14181d] border-2 border-[#c9a15c] text-[#c9a15c] shadow-[0_4px_16px_rgba(201,161,92,0.22)] transition-transform hover:scale-105 active:scale-95"
                    aria-label="Open Chat"
                >
                    <MessageSquare className="h-6 w-6" />
                </button>
            )}

            {isOpen && (
                <div className="flex h-[520px] w-[360px] flex-col rounded-xl border border-[#252b34] bg-[#1c2127] shadow-2xl sm:w-[400px]">
                    <div className="flex items-center justify-between border-b border-[#252b34] bg-[#14181d] p-4 text-[#f8f6f0]">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#c9a15c] bg-[#232932]">
                                <Bot className="h-5 w-5 text-[#c9a15c]" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#f8f6f0]">Raggio AI</h3>
                                <p className="text-xs text-[#9e9b93]">Gourmet Assistant</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-[#9e9b93] hover:text-[#f8f6f0]"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 text-sm leading-relaxed ${msg.sender === 'user'
                                            ? 'bg-[#c9a15c] text-[#14181d] font-medium'
                                            : 'bg-[#232932] text-[#f8f6f0] border border-[#38414e]'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="rounded-lg bg-[#232932] p-3 text-sm text-[#9e9b93] border border-[#38414e]">
                                    Raggio AI is typing...
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="border-t border-[#252b34] bg-[#14181d] p-3">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about menu, specials..."
                                className="flex-1 rounded-lg border border-[#38414e] bg-[#232932] px-3 py-2 text-sm text-[#f8f6f0] placeholder-[#9e9b93] focus:border-[#c9a15c] focus:outline-none"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c9a15c] text-[#14181d] transition-opacity hover:opacity-90 disabled:opacity-50"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}