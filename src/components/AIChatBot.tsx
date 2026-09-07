'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';

interface Message {
    sender: 'user' | 'bot';
    text: string;
    feedback?: 'up' | 'down' | null;
}

const ORDER_URL = 'https://phillystyleexpress.foodtecsolutions.com/';
const SESSION_KEY = 'raggio_chat_history';

const QUICK_REPLIES = [
    { label: '🍕 Deals', message: "What are today's deals and specials?" },
    { label: '🛵 Hours & Delivery', message: 'What are your hours and do you deliver to my area?' },
    { label: '🌮 Latin Menu', message: 'Tell me about your Latin food menu — pupusas, tacos, etc.' },
    { label: '🎉 Catering', message: 'I want to ask about catering for a group event.' },
];

export default function AIChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [showQuickReplies, setShowQuickReplies] = useState(true);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        try {
            const savedHistory = sessionStorage.getItem(SESSION_KEY);
            if (savedHistory) {
                setMessages(JSON.parse(savedHistory));
                setShowQuickReplies(false);
            } else {
                setMessages([
                    {
                        sender: 'bot',
                        text: "Hey there! 🍕 Craving a fresh-out-of-the-oven **gourmet pizza**, **authentic Latin food**, **wings**, or **cheesesteaks**? You're in the right place — what can I get started for you today?",
                    },
                ]);
            }
        } catch (e) {
            setMessages([{ sender: 'bot', text: "Hello! How can I help you today?" }]);
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages));
        }
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen, loading]);

    useEffect(() => {
        if (isOpen && typeof window !== 'undefined' && window.innerWidth >= 640) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || loading) return;
        setShowQuickReplies(false);
        setInput('');

        const newMessages: Message[] = [...messages, { sender: 'user', text }];
        setMessages(newMessages);
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });
            const data = await response.json();
            const botReply = data.reply || "I'm sorry, I couldn't process that right now.";
            setMessages((prev) => [...prev, { sender: 'bot', text: botReply, feedback: null }]);
        } catch (error) {
            setMessages((prev) => [...prev, { sender: 'bot', text: 'Connection error. Please try again.', feedback: null }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = () => sendMessage(input);
    const handleQuickReply = (message: string) => sendMessage(message);

    const handleFeedback = (idx: number, value: 'up' | 'down') => {
        setMessages((prev) =>
            prev.map((msg, i) => i === idx ? { ...msg, feedback: msg.feedback === value ? null : value } : msg)
        );
    };

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
        if (url.includes('#') && typeof window !== 'undefined') {
            e.preventDefault();
            setIsOpen(false);
            try {
                const id = url.split('#')[1].toLowerCase().replace(/[^a-z0-9]/g, '');
                const elements = Array.from(document.querySelectorAll('[id]'));
                const targetElement = elements.find(el => el.id.toLowerCase().replace(/[^a-z0-9]/g, '').includes(id));

                if (targetElement) {
                    setTimeout(() => {
                        const isMobile = window.innerWidth < 640;
                        const yOffset = isMobile ? -180 : -220;
                        const y = targetElement.getBoundingClientRect().top + window.scrollY + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                    }, 250);
                } else {
                    window.location.hash = url.split('#')[1];
                }
            } catch (err) {
                window.location.hash = url.split('#')[1];
            }
        }
    };

    // ZEKİ LİNK FİLTRESİ (Regex) - Satır atlamalarını ve boşlukları affeden yeni versiyon
    const formatMessage = (text: string) => {
        if (!text) return null;

        // Markdown liste işaretlerini ("- " / "* ") görsel madde imine çevir.
        // Kalın yazı regex'i "**" ile çakışmasın diye tek yıldızı sadece satır başında yakalıyoruz.
        const normalized = text.replace(/^[ \t]*[-*][ \t]+/gm, '• ');

        // DÜZELTME: \s* eklendi (aradaki boşluk/enter'ları yutar) ve parantez hataları giderildi.
        const regex = /(\[[^\]]+\]\s*\([^)]+\)|https?:\/\/[^\s)]+|\*\*.*?\*\*)/g;
        const parts = normalized.split(regex);

        return parts.map((part, index) => {
            if (!part) return null;

            // Link Formatı: [Yazı](URL) - \s* ile aradaki görünmez boşlukları affediyoruz
            const mdLinkMatch = part.match(/^\[([^\]]+)\]\s*\(([^)]+)\)$/);

            if (mdLinkMatch) {
                const linkText = mdLinkMatch[1];
                const url = mdLinkMatch[2].trim();
                const isInternal = url.includes('#');
                return (
                    <a
                        key={index}
                        href={url}
                        target={isInternal ? "_self" : "_blank"}
                        rel="noopener noreferrer"
                        onClick={(e) => isInternal ? handleLinkClick(e, url) : undefined}
                        className="font-bold underline text-[#c9a15c] hover:text-white transition-colors cursor-pointer break-words"
                    >
                        {linkText}
                    </a>
                );
            }

            // Çıplak http:// formatı
            if (part.startsWith('http')) {
                const url = part.trim();
                const isInternal = url.includes('#');
                return (
                    <a
                        key={index}
                        href={url}
                        target={isInternal ? "_self" : "_blank"}
                        rel="noopener noreferrer"
                        onClick={(e) => isInternal ? handleLinkClick(e, url) : undefined}
                        className="font-bold underline text-[#c9a15c] hover:text-white transition-colors break-all cursor-pointer"
                    >
                        {url}
                    </a>
                );
            }

            // Kalın Yazı **Formatı** - sarı vurgu + biraz daha büyük punto
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <strong key={index} className="text-[#ffd54a] font-bold text-[1.08em]">
                        {part.slice(2, -2)}
                    </strong>
                );
            }

            // Normal Metin
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <>
            {!isOpen && (
                <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#14181d] border-2 border-[#c9a15c] text-[#c9a15c] shadow-[0_6px_20px_rgba(201,161,92,0.28)] transition-transform hover:scale-105 active:scale-95"
                        aria-label="Open Chat"
                    >
                        <MessageSquare className="h-6 w-6" />
                    </button>
                </div>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-50 flex flex-col bg-[#1c2127] h-[100dvh] sm:h-[80vh] sm:bottom-6 sm:right-6 sm:inset-auto sm:max-h-[760px] sm:min-h-[520px] sm:w-[450px] md:w-[470px] sm:rounded-2xl sm:border sm:border-[#252b34] sm:shadow-2xl overflow-hidden animate-in fade-in sm:zoom-in-95 duration-200">
                    <div className="flex items-center justify-between border-b border-[#252b34] bg-[#14181d] px-4 py-3.5 sm:px-5 sm:py-4 text-[#f8f6f0] shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c9a15c] bg-[#232932]">
                                <Bot className="h-5 w-5 text-[#c9a15c]" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-base text-[#f8f6f0] leading-tight">Raggio AI</h3>
                                <p className="text-xs text-[#9e9b93]">Gourmet Assistant</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <a
                                href={ORDER_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 rounded-lg border border-[#c9a15c] px-3 py-1.5 text-xs font-semibold text-[#c9a15c] hover:bg-[#c9a15c] hover:text-[#14181d] transition-colors"
                            >
                                Order Now <ExternalLink className="h-3 w-3" />
                            </a>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 text-[#9e9b93] hover:text-[#f8f6f0] transition-colors rounded-lg hover:bg-[#252b34]"
                                aria-label="Close Chat"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 space-y-4 [scrollbar-width:thin] [scrollbar-color:#38414e_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#38414e] [&::-webkit-scrollbar-thumb]:rounded-full">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`max-w-[92%] sm:max-w-[88%] rounded-2xl p-3.5 sm:p-4 text-[14.5px] sm:text-[15px] leading-relaxed break-words whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-[#c9a15c] text-[#14181d] font-medium rounded-tr-sm' : 'bg-[#232932] text-[#f8f6f0] border border-[#38414e] rounded-tl-sm'}`}
                                >
                                    {formatMessage(msg.text)}
                                </div>
                                {msg.sender === 'bot' && idx !== 0 && (
                                    <div className="mt-1 flex items-center gap-1 px-1">
                                        <button onClick={() => handleFeedback(idx, 'up')} className={`rounded p-1 transition-colors ${msg.feedback === 'up' ? 'text-[#c9a15c]' : 'text-[#5a6270] hover:text-[#9e9b93]'}`}><ThumbsUp className="h-3.5 w-3.5" /></button>
                                        <button onClick={() => handleFeedback(idx, 'down')} className={`rounded p-1 transition-colors ${msg.feedback === 'down' ? 'text-[#c9a15c]' : 'text-[#5a6270] hover:text-[#9e9b93]'}`}><ThumbsDown className="h-3.5 w-3.5" /></button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {showQuickReplies && !loading && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {QUICK_REPLIES.map((qr) => (
                                    <button
                                        key={qr.label}
                                        onClick={() => handleQuickReply(qr.message)}
                                        className="rounded-full border border-[#38414e] bg-[#232932] px-3 py-1.5 text-xs font-medium text-[#f8f6f0] hover:border-[#c9a15c] hover:text-[#c9a15c] transition-colors text-left"
                                    >
                                        {qr.label}
                                    </button>
                                ))}
                            </div>
                        )}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex items-center gap-1.5 rounded-2xl bg-[#232932] px-4 py-3 border border-[#38414e] rounded-tl-sm">
                                    <span className="h-2 w-2 rounded-full bg-[#c9a15c] animate-bounce [animation-delay:-0.3s]" />
                                    <span className="h-2 w-2 rounded-full bg-[#c9a15c] animate-bounce [animation-delay:-0.15s]" />
                                    <span className="h-2 w-2 rounded-full bg-[#c9a15c] animate-bounce" />
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="border-t border-[#252b34] bg-[#14181d] p-3.5 sm:p-4 shrink-0 pb-safe">
                        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2.5">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about menu, specials..."
                                className="flex-1 rounded-xl border border-[#38414e] bg-[#232932] px-4 py-3 text-base sm:text-[15px] text-[#f8f6f0] placeholder-[#9e9b93] focus:border-[#c9a15c] focus:outline-none transition-colors"
                            />
                            <button type="submit" disabled={loading || !input.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#c9a15c] text-[#14181d] transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100">
                                <Send className="h-5 w-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}