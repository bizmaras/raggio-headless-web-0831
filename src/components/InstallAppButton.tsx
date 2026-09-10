'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallAppButton({ className = '' }: { className?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
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
    const isIosDevice = /iphone|ipad|ipod/i.test(ua);
    if (isIosDevice) {
      setIsIOS(true);
      setIsInstallable(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        aria-label="Install Raggio VIP App"
        className={'inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#14181d] border border-gold/70 text-gold hover:bg-gold hover:text-ink transition-all font-semibold text-xs shadow-[0_0_12px_rgba(212,175,55,0.15)] active:scale-95 cursor-pointer ' + className}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span className="hidden sm:inline">Uygulamayı İndir</span>
        <span className="sm:hidden">App</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#12151a] border border-gold/40 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-left">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-stone hover:text-white p-1 rounded-full bg-white/5"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl border border-gold bg-[#101216] p-1 flex items-center justify-center">
                <img src="/icon-192.png" alt="Raggio Logo" className="w-full h-full object-contain rounded-lg" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Raggio VIP App</h3>
                <p className="text-xs text-gold">Ana Ekrana Ekle</p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-xs text-stone leading-relaxed">
                <p>iPhone veya iPad cihazınızda hızlıca yüklemek için:</p>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-cream">
                  <span className="text-base">1️⃣</span>
                  <span>Safari altındaki <strong>Paylaş</strong> (kare içinden ok çıkan) simgesine dokunun.</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-cream">
                  <span className="text-base">2️⃣</span>
                  <span>Açılan menüden <strong>"Ana Ekrana Ekle"</strong> seçeneğini seçin.</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-stone leading-relaxed">
                <p>Google Chrome veya Edge tarayıcınızda:</p>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-cream">
                  <span className="text-base">1️⃣</span>
                  <span>Adres çubuğundaki <strong>"Uygulamayı Yükle"</strong> simgesine tıklayın.</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-cream">
                  <span className="text-base">2️⃣</span>
                  <span>Çıkan pencerede <strong>"Yükle"</strong> butonuna basın.</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-gold text-ink font-bold text-xs uppercase tracking-wider hover:bg-gold-bright transition-all"
            >
              Anladım
            </button>
          </div>
        </div>
      )}
    </>
  );
}
