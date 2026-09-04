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
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleClose = () => {
        inputRef.current?.blur();
        (document.activeElement as HTMLElement)?.blur();
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
                    <a key={match.index} href={match[3]} target="_blank" rel="noopener noreferrer" className="font-bold underline text-gold hover:text-gold-bright transition-colors break-all">
                        {match[2]}
                    </a>
                );
            } else if (match[4]) {
                parts.push(
                    <strong key={match.index} className="font-bold text-white">
                        {match[5]}
                    </strong>
                );
            }
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < text.length) parts.push(text.substring(lastIndex));
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
            setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || 'No response.' }]);
        } catch (err: any) {
            setMessages((prev) => [...prev, { role: 'assistant', content: `Bağlantı Hatası: Lütfen tekrar deneyin.` }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!isOpen && (
                <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 animate-bounce">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-gold hover:bg-gold-bright text-ink p-4 rounded-full shadow-[0_8px_30px_rgb(201,161,92,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-black uppercase tracking-wider"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                            <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
                        </svg>
                        <span className="hidden sm:inline">Ask Raggio AI</span>
                    </button>
                </div>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center bg-black/80 backdrop-blur-md sm:p-6 transition-opacity" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
                    <div className="w-full h-[100dvh] sm:h-[650px] sm:w-[480px] bg-[#0d1117] border border-gray-800 sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
                        {/* Modern Header */}
                        <div className="bg-[#161b22] p-4 border-b border-gray-800 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-full bg-gold text-ink">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                        <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-md font-bold text-white tracking-wide">Raggio AI</h4>
                                    <p className="text-xs text-gray-400">Smart Assistant</p>
                                </div>
                            </div>
                            <button onClick={handleClose} className="p-2 rounded-full text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-[#0d1117]">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${msg.role === 'user' ? 'bg-gold text-ink font-semibold rounded-br-sm' : 'bg-[#161b22] text-gray-200 border border-gray-800 rounded-bl-sm'}`}>
                                        {renderFormattedMessage(msg.content)}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-[#161b22] text-gold text-sm p-4 rounded-2xl border border-gray-800 rounded-bl-sm flex items-center gap-2">
                                        <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Form */}
                        <form onSubmit={handleSend} className="p-4 bg-[#161b22] border-t border-gray-800 flex gap-3 shrink-0">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                style={{ fontSize: '16px' }}
                                className="flex-1 bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors shadow-inner"
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="bg-gold hover:bg-gold-bright text-ink w-12 h-12 rounded-xl disabled:opacity-50 transition-all flex items-center justify-center shrink-0 shadow-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 ml-1">
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