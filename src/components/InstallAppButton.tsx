'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallAppButtonProps {
  className?: string;
  children?: React.ReactNode;
  lang?: string;
}

export default function InstallAppButton({ className = '', children, lang }: InstallAppButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isChromeIOS, setIsChromeIOS] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Detect locale
  const activeLang = lang || (typeof window !== 'undefined' && window.location.pathname.startsWith('/es') ? 'es' : 'en');
  const isEs = activeLang === 'es';
  const isTr = activeLang === 'tr' || (typeof window !== 'undefined' && (navigator.language?.toLowerCase().startsWith('tr') || document.documentElement.lang === 'tr'));

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    const ua = window.navigator.userAgent;
    const isIosDevice = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (isIosDevice) {
      setIsIOS(true);
      setIsInstallable(true);
      if (/crios/i.test(ua)) {
        setIsChromeIOS(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  // Bulletproof body scroll lock for iOS Safari & Android when modal opens
  useEffect(() => {
    if (!showModal) return;

    const scrollY = window.scrollY;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    const originalOverflow = document.body.style.overflow;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      document.body.style.overflow = originalOverflow;
      window.scrollTo(0, scrollY);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstallable(false);
        }
        setDeferredPrompt(null);
      } catch {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  const modalContent = showModal && mounted ? (
    <div
      style={{ zIndex: 99999999 }}
      className="fixed inset-0 z-[99999999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 pb-12 sm:p-6 overflow-y-auto pointer-events-auto"
      onClick={() => setShowModal(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Install Raggio VIP App Guide"
    >
      <div
        className="bg-[#12151a] border border-[#d4af62]/40 rounded-3xl p-6 sm:p-7 max-w-sm sm:max-w-md w-full shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative text-left my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setShowModal(false)}
          aria-label={isTr ? 'Kapat' : isEs ? 'Cerrar' : 'Close'}
          className="absolute top-4 right-4 text-stone hover:text-white w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-[#d4af62]/50 cursor-pointer transition-colors"
        >
          ✕
        </button>

        {/* App Branding */}
        <div className="flex items-center gap-3.5 mb-5 pr-8">
          <div className="w-12 h-12 rounded-2xl border border-[#d4af62] bg-[#101216] p-1 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,98,0.3)] shrink-0 overflow-hidden">
            <img src="/icons/icon-192.png" alt="Raggio Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-base leading-tight">Raggio VIP App</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#d4af62]/15 text-[#ebd092] border border-[#d4af62]/30">
                PWA
              </span>
            </div>
            <p className="text-xs text-[#d4af62] font-medium mt-0.5">
              {isTr ? 'Kurulum Rehberi (3 Kolay Adım)' : isEs ? 'Guía de Instalación (3 Pasos)' : 'Installation Guide (3 Simple Steps)'}
            </p>
          </div>
        </div>

        {/* Steps container */}
        {isIOS ? (
          <div className="space-y-3 text-xs text-stone leading-relaxed">
            <p className="text-cream font-semibold text-xs sm:text-sm">
              {isChromeIOS
                ? (isTr
                    ? "iPhone'da Google Chrome ile yüklemek için:"
                    : isEs
                    ? 'Para instalar en Chrome en iPhone o iPad:'
                    : 'To install via Chrome on your iPhone or iPad:')
                : (isTr
                    ? "iPhone veya iPad'inize Safari ile yüklemek için:"
                    : isEs
                    ? 'Para instalar en Safari en su iPhone o iPad:'
                    : 'To install via Safari on your iPhone or iPad:')}
            </p>

            {/* Step 1 */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-cream">
              <div className="w-7 h-7 rounded-lg bg-[#d4af62]/15 border border-[#d4af62]/30 flex items-center justify-center shrink-0 text-[#d4af62] font-bold text-xs">
                1
              </div>
              <div className="pt-0.5 leading-snug">
                {isChromeIOS ? (
                  isTr ? (
                    <>
                      En üstteki adres çubuğunun sağındaki <strong className="text-white">Paylaş</strong> simgesine veya en sağ alttaki <strong className="text-white">[ ··· ]</strong> menüsüne dokunun:
                      <span className="inline-flex items-center gap-1 ml-1.5 px-2 py-0.5 rounded bg-white/10 text-[#ebd092] font-medium align-middle">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Paylaş
                      </span>
                    </>
                  ) : isEs ? (
                    <>
                      Toque el icono <strong className="text-white">Compartir</strong> a la derecha de la barra superior o el menú <strong className="text-white">[ ··· ]</strong> abajo:
                      <span className="inline-flex items-center gap-1 ml-1.5 px-2 py-0.5 rounded bg-white/10 text-[#ebd092] font-medium align-middle">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Compartir
                      </span>
                    </>
                  ) : (
                    <>
                      Tap the <strong className="text-white">Share</strong> icon at the top right of address bar (or the <strong className="text-white">[ ··· ]</strong> menu at bottom right):
                      <span className="inline-flex items-center gap-1 ml-1.5 px-2 py-0.5 rounded bg-white/10 text-[#ebd092] font-medium align-middle">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Share
                      </span>
                    </>
                  )
                ) : (
                  isTr ? (
                    <>
                      Safari ekranının en altındaki <strong className="text-white">Paylaş</strong> simgesine dokunun:
                      <span className="inline-flex items-center gap-1 ml-1.5 px-2 py-0.5 rounded bg-white/10 text-[#ebd092] font-medium align-middle">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Paylaş
                      </span>
                    </>
                  ) : isEs ? (
                    <>
                      Toque el botón <strong className="text-white">Compartir</strong> en la barra inferior de Safari:
                      <span className="inline-flex items-center gap-1 ml-1.5 px-2 py-0.5 rounded bg-white/10 text-[#ebd092] font-medium align-middle">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Compartir
                      </span>
                    </>
                  ) : (
                    <>
                      Tap the <strong className="text-white">Share</strong> button in Safari's bottom toolbar:
                      <span className="inline-flex items-center gap-1 ml-1.5 px-2 py-0.5 rounded bg-white/10 text-[#ebd092] font-medium align-middle">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Share
                      </span>
                    </>
                  )
                )}
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-cream">
              <div className="w-7 h-7 rounded-lg bg-[#d4af62]/15 border border-[#d4af62]/30 flex items-center justify-center shrink-0 text-[#d4af62] font-bold text-xs">
                2
              </div>
              <div className="pt-0.5 leading-snug">
                {isTr ? (
                  <>
                    Açılan menüde aşağı kaydırıp <strong className="text-[#ebd092]">"Ana Ekrana Ekle"</strong> seçeneğini seçin.
                  </>
                ) : isEs ? (
                  <>
                    Desplácese y seleccione <strong className="text-[#ebd092]">"Agregar a pantalla de inicio"</strong>.
                  </>
                ) : (
                  <>
                    Scroll down and tap <strong className="text-[#ebd092]">"Add to Home Screen"</strong>.
                  </>
                )}
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-cream">
              <div className="w-7 h-7 rounded-lg bg-[#d4af62]/15 border border-[#d4af62]/30 flex items-center justify-center shrink-0 text-[#d4af62] font-bold text-xs">
                3
              </div>
              <div className="pt-0.5 leading-snug">
                {isTr ? (
                  <>
                    Sağ üst köşedeki <strong className="text-white">"Ekle"</strong> butonuna basın. Raggio VIP App ana ekranınıza eklendi!
                  </>
                ) : isEs ? (
                  <>
                    Toque <strong className="text-white">"Agregar"</strong> en la esquina superior. ¡Disfrute su App!
                  </>
                ) : (
                  <>
                    Tap <strong className="text-white">"Add"</strong> in top right. Enjoy full-screen VIP ordering!
                  </>
                )}
              </div>
            </div>

            {/* Visual Pointer Hint */}
            <div className="pt-2 pb-1 flex items-center justify-center gap-2 text-[#ebd092] text-[11px] font-semibold animate-pulse">
              <span>{isChromeIOS ? '⬆️' : '⬇️'}</span>
              <span>
                {isChromeIOS
                  ? (isTr
                      ? "Ekranın üstündeki Paylaş veya en sağ alttaki [ ··· ] simgesine dokunun"
                      : isEs
                      ? "Toque Compartir arriba o [ ··· ] abajo a la derecha"
                      : "Tap Share at top right or [ ··· ] at bottom right")
                  : (isTr
                      ? "Safari'nin en alt çubuğundaki Paylaş butonuna dokunun"
                      : isEs
                      ? "Toque el icono Compartir en la barra de Safari abajo"
                      : "Tap the Share icon at the bottom of Safari")}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-xs text-stone leading-relaxed">
            <p className="text-cream font-semibold text-xs sm:text-sm">
              {isTr
                ? 'Google Chrome veya Microsoft Edge:'
                : isEs
                ? 'En Google Chrome o Microsoft Edge:'
                : 'In Google Chrome or Microsoft Edge:'}
            </p>
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-cream">
              <div className="w-7 h-7 rounded-lg bg-[#d4af62]/15 border border-[#d4af62]/30 flex items-center justify-center shrink-0 text-[#d4af62] font-bold text-xs">
                1
              </div>
              <div className="pt-0.5 leading-snug">
                {isTr ? (
                  <>Adres çubuğundaki <strong className="text-[#ebd092]">"Uygulamayı Yükle"</strong> simgesine tıklayın.</>
                ) : isEs ? (
                  <>Haga clic en el icono <strong className="text-[#ebd092]">"Instalar aplicación"</strong> en la barra de direcciones.</>
                ) : (
                  <>Click the <strong className="text-[#ebd092]">"Install App"</strong> icon in your browser address bar.</>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-cream">
              <div className="w-7 h-7 rounded-lg bg-[#d4af62]/15 border border-[#d4af62]/30 flex items-center justify-center shrink-0 text-[#d4af62] font-bold text-xs">
                2
              </div>
              <div className="pt-0.5 leading-snug">
                {isTr ? (
                  <>Çıkan onay penceresinde <strong className="text-white">"Yükle"</strong> butonuna basın.</>
                ) : isEs ? (
                  <>Haga clic en <strong className="text-white">"Instalar"</strong> para confirmar.</>
                ) : (
                  <>Click <strong className="text-white">"Install"</strong> to confirm.</>
                )}
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowModal(false)}
          className="mt-6 w-full py-3 rounded-xl bg-[#d4af62] text-[#131518] font-extrabold text-xs uppercase tracking-wider hover:bg-[#ebd092] transition-all cursor-pointer shadow-md active:scale-98"
        >
          {isTr ? 'Anladım, Kapat' : isEs ? 'Entendido, Cerrar' : 'Got It, Close'}
        </button>
      </div>
    </div>
  ) : null;

  const buttonLabel = isTr ? 'Uygulamayı Yükle' : isEs ? 'Instalar App' : 'Install App';

  return (
    <>
      {children ? (
        <div onClick={handleInstallClick} className={`inline-block cursor-pointer ${className}`}>
          {children}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleInstallClick}
          aria-label="Install Raggio VIP App"
          className={'inline-flex items-center gap-2 bg-[#181c22] border border-[#d4af62]/60 text-[#ebd092] hover:bg-[#d4af62] hover:text-[#1c1408] font-bold text-xs px-5 py-2.5 rounded-full transition-all duration-200 cursor-pointer shadow-sm active:scale-95 ' + className}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 text-[#d4af62]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>{buttonLabel}</span>
        </button>
      )}

      {mounted && typeof document !== 'undefined' && modalContent
        ? createPortal(modalContent, document.body)
        : null}
    </>
  );
}
