'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';
import { ORDER_LINKS } from '@/config/ordering';

interface Message {
    sender: 'user' | 'bot';
    text: string;
    feedback?: 'up' | 'down' | null;
}

const ORDER_URL = ORDER_LINKS.root;
const SESSION_KEY = 'raggio_chat_history';

const QUICK_REPLIES_EN = [
    { label: 'Deals', message: "What are today's deals and specials?" },
    { label: 'Hours & Delivery', message: 'What are your hours and do you deliver to my area?' },
    { label: 'Latin Menu', message: 'Tell me about your Latin food menu — pupusas, tacos, etc.' },
    { label: 'Catering', message: 'I want to ask about catering for a group event.' },
];

const QUICK_REPLIES_ES = [
    { label: 'Ofertas', message: "¿Cuáles son las ofertas y especiales de hoy?" },
    { label: 'Horarios y Entrega', message: "¿Cuáles son sus horarios y hacen entregas a mi zona?" },
    { label: 'Comida Latina', message: "Cuéntame sobre el menú latino: pupusas, tacos, etc." },
    { label: 'Catering', message: "Quiero consultar sobre catering para un evento grupal." },
];

function initialChatState(): { isEs: boolean; messages: Message[]; quick: boolean } {
    const spanish = typeof window !== 'undefined' && (window.location.pathname.startsWith('/es') || document.documentElement.lang === 'es');
    try {
        const savedHistory = sessionStorage.getItem(SESSION_KEY);
        if (savedHistory) {
            return { isEs: spanish, messages: JSON.parse(savedHistory), quick: false };
        } else {
            return { isEs: spanish, quick: true, messages: [
                {
                    sender: 'bot',
                    text: spanish
                        ? "¡Hola! ¿Se te antoja una **pizza gourmet** recién horneada, auténtica **comida latina**, **alitas** o **cheesesteaks**? Estás en el lugar correcto — ¿en qué te puedo ayudar hoy?"
                        : "Hey there! Craving a fresh-out-of-the-oven **gourmet pizza**, **authentic Latin food**, **wings**, or **cheesesteaks**? You're in the right place — what can I get started for you today?",
                },
            ] };
        }
    } catch {
        return { isEs: spanish, quick: true, messages: [{ sender: 'bot', text: spanish ? "¡Hola! ¿Cómo te puedo ayudar hoy?" : "Hello! How can I help you today?" }] };
    }
}

export default function AIChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    // Mounted client-only (ssr:false via DeferredWidgets), so reading window/sessionStorage here is safe.
    const [init] = useState(initialChatState);
    const isEs = init.isEs;
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>(init.messages);
    const [loading, setLoading] = useState(false);
    const [showQuickReplies, setShowQuickReplies] = useState(init.quick);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);



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
                    window.location.assign(url);
                }
            } catch (err) {
                window.location.assign(url);
            }
        }
    };

    // Link filter (regex), tolerant of line breaks and whitespace
    const formatMessage = (text: string) => {
        if (!text) return null;

        // Turn Markdown list markers ("- " / "* ") into visual bullets.
        // Single "*" is matched only at line start so it does not clash with the "**" bold regex.
        const normalized = text.replace(/^[ \t]*[-*][ \t]+/gm, '• ');

        // \s* swallows stray spaces/newlines; fixed bracket handling.
        const regex = /(\[[^\]]+\]\s*\([^)]+\)|https?:\/\/[^\s)]+|\*\*.*?\*\*)/g;
        const parts = normalized.split(regex);

        return parts.map((part, index) => {
            if (!part) return null;

            // Link format: [text](URL); \s* tolerates invisible whitespace
            const mdLinkMatch = part.match(/^\[([^\]]+)\]\s*\(([^)]+)\)$/);

            if (mdLinkMatch) {
                const linkText = mdLinkMatch[1];
                const url = mdLinkMatch[2].trim();
                const isSafeProtocol = /^(https?:\/\/|\/|#)/i.test(url);
                if (!isSafeProtocol) {
                    return <span key={index}>{linkText}</span>;
                }
                const isInternal = url.includes('#');
                return (
                    <a
                        key={index}
                        href={url}
                        target={isInternal ? "_self" : "_blank"}
                        rel="noopener noreferrer"
                        onClick={(e) => isInternal ? handleLinkClick(e, url) : undefined}
                        className="font-bold underline text-gold hover:text-white transition-colors cursor-pointer break-words"
                    >
                        {linkText}
                    </a>
                );
            }

            // Bare http:// or https:// URLs
            if (part.startsWith('http://') || part.startsWith('https://')) {
                const url = part.trim();
                const isInternal = url.includes('#');
                return (
                    <a
                        key={index}
                        href={url}
                        target={isInternal ? "_self" : "_blank"}
                        rel="noopener noreferrer"
                        onClick={(e) => isInternal ? handleLinkClick(e, url) : undefined}
                        className="font-bold underline text-gold hover:text-white transition-colors break-all cursor-pointer"
                    >
                        {url}
                    </a>
                );
            }

            // Bold **text**: soft gold, same size (premium, not shouty)
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <strong key={index} className="text-gold-bright font-semibold">
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
                <div className="rg-fab fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-40">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-ink border border-gold text-gold shadow-[0_0_15px_rgba(201,161,92,0.25)] transition-all duration-300 ease-in-out touch-manipulation hover:scale-105 active:scale-90 active:bg-gold/20 cursor-pointer"
                        aria-label="Open Chat"
                    >
                        <MessageSquare className="h-5 w-5 text-gold" />
                    </button>
                </div>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-50 flex flex-col bg-ink h-[100dvh] sm:h-[80vh] sm:bottom-6 sm:right-6 sm:inset-auto sm:max-h-[760px] sm:min-h-[520px] sm:w-[450px] md:w-[470px] sm:rounded-2xl sm:border sm:border-panel sm:shadow-2xl overflow-hidden animate-in fade-in sm:zoom-in-95 duration-200">
                    <div className="flex items-center justify-between border-b border-panel bg-ink px-4 py-3.5 sm:px-5 sm:py-4 text-cream shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold bg-panel">
                                <Bot className="h-5 w-5 text-gold" />
                            </div>
                            <div>
                                <p className="font-semibold text-base text-cream leading-tight">Raggio AI</p>
                                <p className="text-xs text-stone">{isEs ? 'Asistente Gourmet' : 'Gourmet Assistant'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <a
                                href={ORDER_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 rounded-lg border border-gold px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold hover:text-ink transition-colors"
                            >
                                {isEs ? 'Ordenar' : 'Order Now'} <ExternalLink className="h-3 w-3" />
                            </a>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 text-stone hover:text-cream transition-colors rounded-lg hover:bg-panel"
                                aria-label={isEs ? 'Cerrar Chat' : 'Close Chat'}
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 space-y-4 [scrollbar-width:thin] [scrollbar-color:#463f35_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-panel-border [&::-webkit-scrollbar-thumb]:rounded-full">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`max-w-[92%] sm:max-w-[88%] rounded-2xl p-3.5 sm:p-4 text-[14.5px] sm:text-[15px] leading-relaxed break-words whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-ember text-white font-medium rounded-tr-sm' : 'bg-panel text-cream border border-panel-border rounded-tl-sm'}`}
                                >
                                    {formatMessage(msg.text)}
                                </div>
                                {msg.sender === 'bot' && idx !== 0 && (
                                    <div className="mt-1 flex items-center gap-1 px-1">
                                        <button onClick={() => handleFeedback(idx, 'up')} className={`rounded p-1 transition-colors ${msg.feedback === 'up' ? 'text-gold' : 'text-[#5c5347] hover:text-stone'}`}><ThumbsUp className="h-3.5 w-3.5" /></button>
                                        <button onClick={() => handleFeedback(idx, 'down')} className={`rounded p-1 transition-colors ${msg.feedback === 'down' ? 'text-gold' : 'text-[#5c5347] hover:text-stone'}`}><ThumbsDown className="h-3.5 w-3.5" /></button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {showQuickReplies && !loading && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {(isEs ? QUICK_REPLIES_ES : QUICK_REPLIES_EN).map((qr) => (
                                    <button
                                        key={qr.label}
                                        onClick={() => handleQuickReply(qr.message)}
                                        className="rounded-full border border-panel-border bg-panel px-3 py-1.5 text-xs font-medium text-cream hover:border-gold hover:text-gold transition-colors text-left"
                                    >
                                        {qr.label}
                                    </button>
                                ))}
                            </div>
                        )}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex items-center gap-1.5 rounded-2xl bg-panel px-4 py-3 border border-panel-border rounded-tl-sm">
                                    <span className="h-2 w-2 rounded-full bg-gold animate-bounce [animation-delay:-0.3s]" />
                                    <span className="h-2 w-2 rounded-full bg-gold animate-bounce [animation-delay:-0.15s]" />
                                    <span className="h-2 w-2 rounded-full bg-gold animate-bounce" />
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="border-t border-panel bg-ink p-3.5 sm:p-4 shrink-0 pb-safe">
                        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2.5">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={isEs ? 'Pregunta sobre el menú, ofertas...' : 'Ask about menu, specials...'}
                                className="flex-1 rounded-xl border border-panel-border bg-panel px-4 py-3 text-base sm:text-[15px] text-cream placeholder-stone focus:border-gold focus:outline-none transition-colors"
                            />
                            <button type="submit" disabled={loading || !input.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ember text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100">
                                <Send className="h-5 w-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}