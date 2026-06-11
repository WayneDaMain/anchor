import React, { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";

export default function AppPromo() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) return;

    const dismissed = localStorage.getItem("biblescriptura-promo-dismissed");
    if (dismissed) return;

    // Show after a short delay so the page loads first
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem("biblescriptura-promo-dismissed", "true");
    setVisible(false);
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-modal max-w-sm w-[calc(100%-2rem)] md:w-96 bg-card border border-border rounded-2xl shadow-2xl p-5 pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300">
      {/* Close button */}
      <button
        onClick={dismiss}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Content */}
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12" y2="18" />
          </svg>
        </div>

        <div>
          <h3 className="text-base font-bold text-foreground">
            Try Anchor on your phone
          </h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Download the Android app for the full experience — notifications, and more.
          </p>
        </div>

        <div className="flex flex-col w-full gap-2">
          <a
            href="/Anchor.apk"
            download
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-xs rounded-xl px-4 py-2.5 hover:opacity-90 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download APK
          </a>
          <button
            onClick={dismiss}
            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
