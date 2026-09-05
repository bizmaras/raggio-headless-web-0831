'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

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

        const newMessages = [...messages, { sender: 'user', text: userMessage }];
        setMessages(newMessages as Message[]);
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });

            const data = await response.json();
            const botReply = data.reply || "I'm sorry, I couldn't process that right now.";

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

    // Mesaj içindeki linkleri tıklanabilir <a> etiketine dönüştüren fonksiyon
    const formatMessage = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.split(urlRegex).map((part, index) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold underline text-[#c9a15c] hover:text-white transition-colors break-all"
                    >
                        {part}
                    </a>
                );
            }
            return <span key={index}>{part}</span>;
        });
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
                // Boyutlandırma buradaki class'lar ile tamamen dinamik hale getirildi
                <div className="flex flex-col rounded-xl border border-[#252b34] bg-[#1c2127] shadow-2xl h-[75vh] max-h-[800px] min-h-[450px] w-[90vw] sm:w-[400px] md:w-[450px] lg:w-[500px]">
                    <div className="flex items-center justify-between border-b border-[#252b34] bg-[#14181d] p-4 text-[#f8f6f0] rounded-t-xl">
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
                            className="text-[#9e9b93] hover:text-[#f8f6f0] transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-lg p-3 text-[15px] leading-relaxed ${msg.sender === 'user'
                                            ? 'bg-[#c9a15c] text-[#14181d] font-medium'
                                            : 'bg-[#232932] text-[#f8f6f0] border border-[#38414e]'
                                        }`}
                                >
                                    {/* formatMessage fonksiyonunu burada çağırıyoruz */}
                                    {formatMessage(msg.text)}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="rounded-lg bg-[#232932] p-3 text-[15px] text-[#9e9b93] border border-[#38414e]">
                                    Raggio AI is typing...
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="border-t border-[#252b34] bg-[#14181d] p-4 rounded-b-xl">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="flex items-center gap-3"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about menu, specials..."
                                className="flex-1 rounded-lg border border-[#38414e] bg-[#232932] px-4 py-3 text-[15px] text-[#f8f6f0] placeholder-[#9e9b93] focus:border-[#c9a15c] focus:outline-none transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#c9a15c] text-[#14181d] transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}