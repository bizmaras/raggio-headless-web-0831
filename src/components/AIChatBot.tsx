'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function AIChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Hello! I am Raggio AI. How can I help you with our menu or catering options today?',
        },
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    // Link [Metin](URL) ve Kalın Metin **Metin** formatlarını işleyen yardımcı fonksiyon
    const renderFormattedMessage = (text: string): React.ReactNode => {
        const regex = /(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))|(\*\*([^*]+)\*\*)/g;
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push(text.substring(lastIndex, match.index));
            }

            if (match[1]) {
                // Tıklanabilir Link
                parts.push(
                    <a
                        key={match.index}
                        href={match[3]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold underline text-gold hover:text-gold-bright transition-colors break-all"
                    >
                        {match[2]}
                    </a>
                );
            } else if (match[4]) {
                // Kalın Yazı
                parts.push(
                    <strong key={match.index} className="font-bold text-cream">
                        {match[5]}
                    </strong>
                );
            }

            lastIndex = regex.lastIndex;
        }

        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }

        return parts;
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: 'user', content: input };
        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: updatedMessages }),
            });

            const data = await res.json();
            if (data.reply) {
                setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
            } else {
                setMessages((prev) => [...prev, { role: 'assistant', content: 'I am sorry, I could not process that request.' }]);
            }
        } catch (err) {
            setMessages((prev) => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-r from-gold via-gold-bright to-gold text-ink p-4 rounded-full shadow-[0_4px_20px_rgba(201,161,92,0.5)] hover:scale-110 transition-all cursor-pointer flex items-center gap-2 font-bold text-xs uppercase tracking-wider"
                >
                    <Bot className="w-6 h-6 stroke-[2.5]" />
                    <span className="hidden sm:inline">Ask Raggio AI</span>
                </button>
            )}

            {isOpen && (
                <div className="w-[340px] sm:w-[380px] h-[500px] bg-[#14181d] border border-panel-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
                    <div className="bg-[#1c2127] p-4 border-b border-panel-border flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-gold/10 border border-gold/30">
                                <Bot className="w-5 h-5 text-gold" />
                            </div>
                            <div>
                                <h4 className="text-sm font-extrabold text-cream">Raggio AI</h4>
                                <p className="text-[10px] text-stone">Menu & Catering Assistant</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 rounded-full text-stone hover:text-cream hover:bg-black/40 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-ink/50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-gold text-ink font-semibold rounded-br-none' : 'bg-[#1c2127] text-cream border border-panel-border rounded-bl-none'}`}>
                                    {renderFormattedMessage(msg.content)}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-[#1c2127] text-gold text-xs p-3 rounded-2xl border border-panel-border animate-pulse">
                                    Raggio AI is thinking...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="p-3 bg-[#1c2127] border-t border-panel-border flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            className="flex-1 bg-ink border border-panel-border rounded-xl px-3.5 py-2 text-xs text-cream focus:outline-none focus:border-gold"
                        />
                        <button type="submit" disabled={loading || !input.trim()} className="bg-gold hover:bg-gold-bright text-ink p-2.5 rounded-xl disabled:opacity-50 transition-all cursor-pointer">
                            <Send className="w-4 h-4 stroke-[2.5]" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}