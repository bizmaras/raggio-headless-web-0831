'use client';

import React, { useState, useEffect } from 'react';
import { X, Gift, Pizza, CheckCircle2, AlertCircle } from 'lucide-react';

export default function WelcomePopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isEs, setIsEs] = useState(false);

    const FOODTEC_ORDER_URL = 'https://phillystyleexpress.foodtecsolutions.com/';

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsEs(window.location.pathname.startsWith('/es') || document.documentElement.lang === 'es');
        }
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

    // Format phone to standard US (XXX) XXX-XXXX as user types
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '');
        if (raw.length <= 3) {
            setPhone(raw);
        } else if (raw.length <= 6) {
            setPhone(`(${raw.slice(0, 3)}) ${raw.slice(3)}`);
        } else {
            setPhone(`(${raw.slice(0, 3)}) ${raw.slice(3, 6)}-${raw.slice(6, 10)}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const cleanPhone = phone.replace(/\D/g, '');

        if (!trimmedName || !trimmedEmail || !cleanPhone) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        if (cleanPhone.length < 10) {
            setErrorMessage('Please enter a valid 10-digit phone number.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/welcome-signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: trimmedName,
                    email: trimmedEmail,
                    phone: cleanPhone,
                }),
            });

            const result = await res.json();

            if (result.success) {
                if (result.isDuplicate) {
                    setIsDuplicate(true);
                } else {
                    setIsDuplicate(false);
                }
                setIsSubmitted(true);
                localStorage.setItem('raggio_welcome_seen', 'true');
            } else {
                setErrorMessage(result.error || 'Failed to submit registration. Please try again.');
            }
        } catch (error) {
            console.error('Data submission error', error);
            setErrorMessage('Unable to connect. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a0c0f]/80 backdrop-blur-sm animate-in fade-in duration-500" role="dialog" aria-modal="true" aria-labelledby="popup-title">
            <div className="relative w-full max-w-4xl bg-[#1c2127] rounded-2xl shadow-[0_0_40px_rgba(201,161,92,0.15)] border border-[#c9a15c]/30 overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-500">

                <div className="hidden md:flex md:w-1/2 bg-[#14181d] relative items-center justify-center p-8 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#c9a15c]/20 to-transparent z-0" />
                    <div className="relative z-10 text-center space-y-6">
                        <div className="w-24 h-24 mx-auto bg-[#c9a15c]/10 rounded-full flex items-center justify-center border-2 border-[#c9a15c] shadow-[0_0_30px_rgba(201,161,92,0.4)]">
                            <Gift className="w-12 h-12 text-[#c9a15c]" aria-hidden="true" />
                        </div>
                        <h2 id="popup-title" className="text-4xl font-extrabold text-[#f8f6f0] leading-tight">
                            {isEs ? (
                                <>
                                    Sabor Gourmet, <br />
                                    <span className="text-[#c9a15c]">Precio Exclusivo.</span>
                                </>
                            ) : (
                                <>
                                    Gourmet Taste, <br />
                                    <span className="text-[#c9a15c]">Exclusive Price.</span>
                                </>
                            )}
                        </h2>
                        <p className="text-[#9e9b93] text-lg">
                            {isEs
                                ? 'Únete a la familia Raggio hoy y obtén beneficios instantáneos en tu primer pedido.'
                                : 'Join the Raggio family today and get instant perks on your first order.'}
                        </p>
                    </div>
                    <Pizza className="absolute -bottom-12 -left-12 w-64 h-64 text-[#c9a15c]/5 -rotate-12" aria-hidden="true" />
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-12 relative flex flex-col justify-center">
                    <button
                        onClick={handleClose}
                        aria-label={isEs ? 'Cerrar ventana emergente' : 'Close popup window'}
                        title={isEs ? 'Cerrar ventana emergente' : 'Close popup window'}
                        className="absolute top-4 right-4 p-2 text-[#9e9b93] hover:text-[#c9a15c] transition-colors rounded-full hover:bg-[#232932] cursor-pointer"
                    >
                        <X className="w-6 h-6" aria-hidden="true" />
                    </button>

                    {!isSubmitted ? (
                        <>
                            <div className="text-center md:text-left mb-8">
                                <h3 className="text-2xl md:text-3xl font-bold text-[#f8f6f0] mb-3">
                                    {isEs ? (
                                        <>¡Obtén <span className="text-[#c9a15c]">20% DE DESCUENTO</span> Ahora!</>
                                    ) : (
                                        <>Get <span className="text-[#c9a15c]">20% OFF</span> Now!</>
                                    )}
                                </h3>
                                <p className="text-[#9e9b93] text-sm md:text-base">
                                    {isEs
                                        ? 'Regístrate a continuación y completa tu registro en nuestro portal de pedidos para reclamar tu 20% de descuento.'
                                        : 'Sign up below and complete your registration on our ordering portal to claim your 20% discount.'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {errorMessage && (
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}

                                <input
                                    type="text"
                                    placeholder={isEs ? 'Nombre' : 'First Name'}
                                    aria-label={isEs ? 'Nombre' : 'First Name'}
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-xl bg-[#14181d] border border-[#38414e] text-[#f8f6f0] placeholder-[#9e9b93] focus:outline-none focus:border-[#c9a15c] focus:ring-1 focus:ring-[#c9a15c] transition-all"
                                />
                                <input
                                    type="email"
                                    placeholder={isEs ? 'Correo Electrónico' : 'Email Address'}
                                    aria-label={isEs ? 'Correo Electrónico' : 'Email Address'}
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-xl bg-[#14181d] border border-[#38414e] text-[#f8f6f0] placeholder-[#9e9b93] focus:outline-none focus:border-[#c9a15c] focus:ring-1 focus:ring-[#c9a15c] transition-all"
                                />
                                <input
                                    type="tel"
                                    placeholder={isEs ? 'Número de Teléfono (ej. 302-369-0553)' : 'Phone Number (e.g. 302-369-0553)'}
                                    aria-label={isEs ? 'Número de Teléfono' : 'Phone Number'}
                                    required
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    maxLength={14}
                                    className="w-full px-5 py-3.5 rounded-xl bg-[#14181d] border border-[#38414e] text-[#f8f6f0] placeholder-[#9e9b93] focus:outline-none focus:border-[#c9a15c] focus:ring-1 focus:ring-[#c9a15c] transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 mt-2 bg-[#c9a15c] text-[#14181d] font-bold text-lg rounded-xl hover:bg-[#b58e4e] hover:shadow-[0_0_20px_rgba(201,161,92,0.4)] transition-all disabled:opacity-70 cursor-pointer"
                                >
                                    {loading
                                        ? (isEs ? 'Verificando...' : 'Checking...')
                                        : (isEs ? 'Reclamar Mi 20% de Descuento' : 'Claim My 20% OFF')}
                                </button>

                                <p className="text-[11px] text-[#d1d5db] text-center leading-tight mt-3">
                                    {isEs
                                        ? 'Al hacer clic en "Reclamar Mi 20% de Descuento", aceptas recibir correos promocionales y mensajes SMS de Raggio Gourmet Pizza. Puedes cancelar en cualquier momento.'
                                        : 'By clicking \'Claim My 20% OFF\', you agree to receive promotional emails and SMS messages from Raggio Gourmet Pizza. You can opt out at any time.'}
                                </p>
                            </form>
                            <button
                                onClick={handleClose}
                                className="w-full text-center mt-6 text-sm text-[#d1d5db] hover:text-white transition-colors underline decoration-[#d1d5db]/30 underline-offset-4 cursor-pointer"
                            >
                                {isEs ? 'No gracias, prefiero pagar precio completo.' : 'No thanks, I\'ll pay full price.'}
                            </button>
                        </>
                    ) : isDuplicate ? (
                        /* Duplicate Notice Screen */
                        <div className="text-center py-6 animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 mx-auto bg-amber-500/15 rounded-full flex items-center justify-center border-2 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)] mb-6">
                                <CheckCircle2 className="w-10 h-10 text-amber-400" aria-hidden="true" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-[#f8f6f0] mb-3">
                                {isEs ? '¡Ya estás registrado!' : 'You\'re Already Registered!'}
                            </h3>
                            <p className="text-[#9e9b93] text-sm md:text-base mb-6 leading-relaxed">
                                {isEs ? (
                                    <>Parece que <span className="text-[#c9a15c] font-semibold">{email.trim()}</span> ya está en nuestro sistema. Tu 20% de descuento fue enviado a tu correo, o puedes ordenar directamente a través de nuestro portal ahora.</>
                                ) : (
                                    <>It looks like <span className="text-[#c9a15c] font-semibold">{email.trim()}</span> is already in our system. Your 20% discount was sent to your email, or you can order directly through our portal now!</>
                                )}
                            </p>

                            <a
                                href={FOODTEC_ORDER_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleClose}
                                className="inline-block w-full py-4 bg-[#c9a15c] text-[#14181d] font-bold text-lg rounded-xl hover:bg-[#b58e4e] hover:shadow-[0_0_20px_rgba(201,161,92,0.4)] transition-all mb-4 text-center cursor-pointer"
                            >
                                {isEs ? 'Continuar al Portal de Pedidos' : 'Continue to Order Portal'}
                            </a>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setIsDuplicate(false);
                                    setEmail('');
                                }}
                                className="text-sm text-[#9e9b93] hover:text-[#c9a15c] underline decoration-[#9e9b93]/40 underline-offset-4 transition-colors cursor-pointer"
                            >
                                {isEs ? 'Registrarse con un correo diferente' : 'Register with a different email'}
                            </button>
                        </div>
                    ) : (
                        /* Fresh Registration Success Screen */
                        <div className="text-center py-6 animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)] mb-6">
                                <Gift className="w-10 h-10 text-green-500" aria-hidden="true" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-[#f8f6f0] mb-3">
                                {isEs ? `¡Estás dentro, ${name.trim()}!` : `You're in, ${name.trim()}!`}
                            </h3>
                            <p className="text-[#9e9b93] text-sm md:text-base mb-8 leading-relaxed">
                                {isEs
                                    ? 'Para desbloquear tu 20% de descuento, simplemente continúa a nuestro portal de pedidos y completa tu registro rápido. ¡Tu descuento se aplicará automáticamente!'
                                    : 'To unlock your 20% discount, simply proceed to our ordering portal and complete your quick registration. Your discount will apply automatically!'}
                            </p>

                            <a
                                href={FOODTEC_ORDER_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleClose}
                                className="inline-block w-full py-4 bg-[#c9a15c] text-[#14181d] font-bold text-lg rounded-xl hover:bg-[#b58e4e] hover:shadow-[0_0_20px_rgba(201,161,92,0.4)] transition-all text-center cursor-pointer"
                            >
                                {isEs ? 'Continuar al Portal de Pedidos' : 'Continue to Order Portal'}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}