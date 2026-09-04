'use client';

import React, { useState, useRef, useEffect } from 'react';

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
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // iOS Safari viewport kaymasını önleyen kademeli kapatma fonksiyonu
    const handleClose = () => {
        // 1. Klavyeyi indir
        if (inputRef.current) {
            inputRef.current.blur();
        }
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        // 2. iOS klavye kapanma animasyonu bittikten sonra modalı kapat
        setTimeout(() => {
            document.body.style.overflow = '';
            setIsOpen(false);
            window.scrollTo(0, window.scrollY);
        }, 250);
    };

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

            if (!res.ok) {
                throw new Error(`API response failed with status ${res.status}`);
            }

            const data = await res.json();
            if (data && data.reply) {
                setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
            } else {
                setMessages((prev) => [...prev, { role: 'assistant', content: 'I am sorry, I could not process that request right now.' }]);
            }
        } catch (err: any) {
            setMessages((prev) => [...prev, { role: 'assistant', content: 'Gemini API Error. Please check API Key or quota.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!isOpen && (
                <div className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-50">
                    <button
                        onClick={() => setIsOpen(true)}
                        aria-label="Ask Raggio AI Assistant"
                        className="bg-gradient-to-r from-gold via-gold-bright to-gold text-ink p-3.5 sm:p-4 rounded-full shadow-[0_4px_20px_rgba(201,161,92,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 font-bold text-xs uppercase tracking-wider"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6">
                            <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
                        </svg>
                        <span className="hidden sm:inline">Ask Raggio AI</span>
                    </button>
                </div>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center bg-black/70 backdrop-blur-xs sm:p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) handleClose();
                    }}
                >
                    <div className="w-full h-[100dvh] sm:h-[520px] sm:w-[380px] bg-[#14181d] border-t sm:border border-panel-border sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
                        {/* Header */}
                        <div className="bg-[#1c2127] p-3.5 sm:p-4 border-b border-panel-border flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-gold/10 border border-gold/30">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gold">
                                        <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-sm font-extrabold text-cream">Raggio AI</h4>
                                    <p className="text-[10px] text-stone">Menu & Catering Assistant</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                aria-label="Close Chat Window"
                                className="p-2 rounded-full text-stone hover:text-cream bg-black/20 hover:bg-black/50 transition-colors cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-5 sm:h-5">
                                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 bg-ink/50">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-xs leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-gold text-ink font-semibold rounded-br-none' : 'bg-[#1c2127] text-cream border border-panel-border rounded-bl-none'}`}>
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

                        {/* Input Form */}
                        <form onSubmit={handleSend} className="p-3 bg-[#1c2127] border-t border-panel-border flex gap-2 shrink-0">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a question..."
                                style={{ fontSize: '16px' }}
                                className="flex-1 bg-ink border border-panel-border rounded-xl px-3.5 py-2.5 text-[16px] text-cream focus:outline-none focus:border-gold"
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                aria-label="Send Message"
                                className="bg-gold hover:bg-gold-bright text-ink px-4 py-2.5 rounded-xl disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center shrink-0"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                    <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}