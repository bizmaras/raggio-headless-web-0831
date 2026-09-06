'use client';

import React, { useState, useEffect } from 'react';
import { X, Gift, Pizza } from 'lucide-react';

export default function WelcomePopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwe23dYVGbmlt56kJhIw7RV_8VO2EnqhdXRzqau3e65mYpDItW6ggp8YX-4rzxtdHIv/exec';
    const FOODTEC_ORDER_URL = 'https://phillystyleexpress.foodtecsolutions.com/';

    useEffect(() => {
        const hasSeenPopup = localStorage.getItem('raggio_welcome_seen');
        if (!hasSeenPopup) {
            const timer = setTimeout(() => setIsOpen(true), 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('raggio_welcome_seen', 'true');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !phone) return;

        setLoading(true);

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: JSON.stringify({ name, email, phone })
            });

            setIsSubmitted(true);
            localStorage.setItem('raggio_welcome_seen', 'true');
        } catch (error) {
            console.error("Data submission error", error);
            setIsSubmitted(true);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a0c0f]/80 backdrop-blur-sm animate-in fade-in duration-500">
            <div className="relative w-full max-w-4xl bg-[#1c2127] rounded-2xl shadow-[0_0_40px_rgba(201,161,92,0.15)] border border-[#c9a15c]/30 overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-500">

                <div className="hidden md:flex md:w-1/2 bg-[#14181d] relative items-center justify-center p-8 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#c9a15c]/20 to-transparent z-0" />
                    <div className="relative z-10 text-center space-y-6">
                        <div className="w-24 h-24 mx-auto bg-[#c9a15c]/10 rounded-full flex items-center justify-center border-2 border-[#c9a15c] shadow-[0_0_30px_rgba(201,161,92,0.4)]">
                            <Gift className="w-12 h-12 text-[#c9a15c]" />
                        </div>
                        <h2 className="text-4xl font-extrabold text-[#f8f6f0] leading-tight">
                            Gourmet Taste, <br />
                            <span className="text-[#c9a15c]">Exclusive Price.</span>
                        </h2>
                        <p className="text-[#9e9b93] text-lg">
                            Join the Raggio family today and get instant perks on your first order.
                        </p>
                    </div>
                    <Pizza className="absolute -bottom-12 -left-12 w-64 h-64 text-[#c9a15c]/5 -rotate-12" />
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-12 relative flex flex-col justify-center">
                    <button
                        onClick={handleClose}
                        aria-label="Close popup"
                        className="absolute top-4 right-4 p-2 text-[#9e9b93] hover:text-[#c9a15c] transition-colors rounded-full hover:bg-[#232932]"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {!isSubmitted ? (
                        <>
                            <div className="text-center md:text-left mb-8">
                                <h3 className="text-2xl md:text-3xl font-bold text-[#f8f6f0] mb-3">
                                    Get <span className="text-[#c9a15c]">20% OFF</span> Now!
                                </h3>
                                <p className="text-[#9e9b93] text-sm md:text-base">
                                    Sign up below and complete your registration on our ordering portal to claim your 20% discount.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-xl bg-[#14181d] border border-[#38414e] text-[#f8f6f0] placeholder-[#5a6270] focus:outline-none focus:border-[#c9a15c] focus:ring-1 focus:ring-[#c9a15c] transition-all"
                                />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-xl bg-[#14181d] border border-[#38414e] text-[#f8f6f0] placeholder-[#5a6270] focus:outline-none focus:border-[#c9a15c] focus:ring-1 focus:ring-[#c9a15c] transition-all"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-xl bg-[#14181d] border border-[#38414e] text-[#f8f6f0] placeholder-[#5a6270] focus:outline-none focus:border-[#c9a15c] focus:ring-1 focus:ring-[#c9a15c] transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 mt-2 bg-[#c9a15c] text-[#14181d] font-bold text-lg rounded-xl hover:bg-[#b58e4e] hover:shadow-[0_0_20px_rgba(201,161,92,0.4)] transition-all disabled:opacity-70"
                                >
                                    {loading ? 'Processing...' : 'Claim My 20% OFF'}
                                </button>

                                <p className="text-[11px] text-[#5a6270] text-center leading-tight mt-3">
                                    By clicking 'Claim My 20% OFF', you agree to receive promotional emails and SMS messages from Raggio Gourmet Pizza. You can opt out at any time.
                                </p>
                            </form>
                            <button onClick={handleClose} className="w-full text-center mt-6 text-sm text-[#5a6270] hover:text-[#9e9b93] transition-colors underline decoration-[#5a6270]/30 underline-offset-4">
                                No thanks, I'll pay full price.
                            </button>
                        </>
                    ) : (
                        <div className="text-center py-8 animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)] mb-6">
                                <Gift className="w-10 h-10 text-green-500" />
                            </div>
                            <h3 className="text-3xl font-bold text-[#f8f6f0] mb-4">You're in, {name}!</h3>
                            <p className="text-[#9e9b93] mb-8">
                                To unlock your 20% discount, simply proceed to our ordering portal and complete your quick registration. Your discount will apply automatically!
                            </p>

                            <a
                                href={FOODTEC_ORDER_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleClose}
                                className="inline-block w-full py-4 bg-[#c9a15c] text-[#14181d] font-bold text-lg rounded-xl hover:bg-[#b58e4e] hover:shadow-[0_0_20px_rgba(201,161,92,0.4)] transition-all"
                            >
                                Continue to Order Portal
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}