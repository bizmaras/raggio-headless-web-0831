'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';

interface Message {
    sender: 'user' | 'bot';
    text: string;
    feedback?: 'up' | 'down' | null;
}

const ORDER_URL = 'https://phillystyleexpress.foodtecsolutions.com/';

// Quick reply chips — sends the text directly when clicked
const QUICK_REPLIES = [
    { label: '🍕 Deals', message: "What are today's deals and specials?" },
    { label: '🛵 Hours & Delivery', message: 'What are your hours and do you deliver to my area?' },
    { label: '🌮 Latin Menu', message: 'Tell me about your Latin food menu — pupusas, tacos, etc.' },
    { label: '🎉 Catering', message: 'I want to ask about catering for a group event.' },
];

export default function AIChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            sender: 'bot',
            text: "Hey there! 🍕 Craving a fresh-out-of-the-oven gourmet pizza or a sizzling Latin favorite? You're in the right place — what can I get started for you today?",
        },
    ]);
    const [loading, setLoading] = useState(false);
    const [showQuickReplies, setShowQuickReplies] = useState(true);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen, loading]);

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
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
            setMessages((prev) => [
                ...prev,
                { sender: 'bot', text: 'Connection error. Please check your network and try again.', feedback: null },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = () => sendMessage(input);

    const handleQuickReply = (message: string) => sendMessage(message);

    const handleFeedback = (idx: number, value: 'up' | 'down') => {
        setMessages((prev) =>
            prev.map((msg, i) =>
                i === idx ? { ...msg, feedback: msg.feedback === value ? null : value } : msg
            )
        );
        // TODO: Logging to an /api/feedback endpoint can be added here
        // (to track which responses are useful or need improvement)
    };

    // Function that converts URLs in the message to clickable <a> tags
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
                <div className="flex flex-col rounded-xl border border-[#252b34] bg-[#1c2127] shadow-2xl h-[75vh] max-h-[800px] min-h-[450px] w-[90vw] sm:w-[400px] md:w-[450px] lg:w-[500px]">
                    {/* HEADER */}
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
                        <div className="flex items-center gap-3">
                            <a
                                href={ORDER_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden sm:flex items-center gap-1 rounded-lg border border-[#c9a15c] px-3 py-1.5 text-xs font-semibold text-[#c9a15c] hover:bg-[#c9a15c] hover:text-[#14181d] transition-colors"
                            >
                                Order Now <ExternalLink className="h-3 w-3" />
                            </a>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-[#9e9b93] hover:text-[#f8f6f0] transition-colors"
                                aria-label="Close Chat"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* MESSAGES */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-lg p-3 text-[15px] leading-relaxed ${msg.sender === 'user'
                                        ? 'bg-[#c9a15c] text-[#14181d] font-medium'
                                        : 'bg-[#232932] text-[#f8f6f0] border border-[#38414e]'
                                        }`}
                                >
                                    {formatMessage(msg.text)}
                                </div>

                                {/* Feedback buttons - only on bot messages, excluding the welcome message */}
                                {msg.sender === 'bot' && idx !== 0 && (
                                    <div className="mt-1 flex items-center gap-1 px-1">
                                        <button
                                            onClick={() => handleFeedback(idx, 'up')}
                                            aria-label="Helpful"
                                            className={`rounded p-1 transition-colors ${msg.feedback === 'up'
                                                ? 'text-[#c9a15c]'
                                                : 'text-[#5a6270] hover:text-[#9e9b93]'
                                                }`}
                                        >
                                            <ThumbsUp className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleFeedback(idx, 'down')}
                                            aria-label="Not helpful"
                                            className={`rounded p-1 transition-colors ${msg.feedback === 'down'
                                                ? 'text-[#c9a15c]'
                                                : 'text-[#5a6270] hover:text-[#9e9b93]'
                                                }`}
                                        >
                                            <ThumbsDown className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Quick reply chips - only shown at the beginning of the conversation */}
                        {showQuickReplies && !loading && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {QUICK_REPLIES.map((qr) => (
                                    <button
                                        key={qr.label}
                                        onClick={() => handleQuickReply(qr.message)}
                                        className="rounded-full border border-[#38414e] bg-[#232932] px-3 py-1.5 text-xs font-medium text-[#f8f6f0] hover:border-[#c9a15c] hover:text-[#c9a15c] transition-colors"
                                    >
                                        {qr.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Typing animation */}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex items-center gap-1 rounded-lg bg-[#232932] px-4 py-3 border border-[#38414e]">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#9e9b93] animate-bounce [animation-delay:-0.3s]" />
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#9e9b93] animate-bounce [animation-delay:-0.15s]" />
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#9e9b93] animate-bounce" />
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* INPUT */}
                    <div className="border-t border-[#252b34] bg-[#14181d] p-4 rounded-b-xl">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="flex items-center gap-3"
                        >
                            <input
                                ref={inputRef}
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