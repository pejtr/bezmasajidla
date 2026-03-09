// ============================================================
// BEZMASAJIDLA.CZ — GDPR Cookie Consent Banner
// Shown once per browser session, stored in localStorage
// ============================================================

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Cookie, X, Check, Settings } from "lucide-react";

const STORAGE_KEY = "bezmasajidla_cookie_consent";

type ConsentState = "accepted" | "rejected" | "custom" | null;

interface CookiePrefs {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Small delay so the page renders first
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const save = (state: ConsentState, customPrefs?: CookiePrefs) => {
    const data = {
      state,
      prefs: customPrefs || prefs,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden">
        {/* Main banner */}
        <div className="p-5 md:p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <Cookie className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 mb-1">
                Tento web používá cookies
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Používáme cookies pro zajištění základní funkčnosti webu a analýzu návštěvnosti.
                Vaše soukromí je pro nás důležité.{" "}
                <Link href="/ochrana-soukromi" className="text-emerald-600 hover:underline">
                  Více informací
                </Link>
              </p>
            </div>
            <button
              onClick={() => save("rejected", { necessary: true, analytics: false, marketing: false })}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="Odmítnout cookies"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Detailed preferences */}
          {showDetails && (
            <div className="mt-4 space-y-3 border-t border-emerald-50 pt-4">
              {/* Necessary */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Nezbytné cookies</p>
                  <p className="text-xs text-gray-400">Základní funkce webu — nelze vypnout</p>
                </div>
                <div className="w-10 h-6 bg-emerald-600 rounded-full flex items-center justify-end px-1 cursor-not-allowed opacity-70">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Analytické cookies</p>
                  <p className="text-xs text-gray-400">Pomáhají nám zlepšovat web (anonymní data)</p>
                </div>
                <button
                  onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
                  className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                    prefs.analytics ? "bg-emerald-600 justify-end" : "bg-gray-200 justify-start"
                  }`}
                  aria-label="Přepnout analytické cookies"
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Marketingové cookies</p>
                  <p className="text-xs text-gray-400">Personalizovaná reklama a sociální sítě</p>
                </div>
                <button
                  onClick={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))}
                  className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                    prefs.marketing ? "bg-emerald-600 justify-end" : "bg-gray-200 justify-start"
                  }`}
                  aria-label="Přepnout marketingové cookies"
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => save("accepted", { necessary: true, analytics: true, marketing: true })}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Přijmout vše
            </button>
            <button
              onClick={() => save("rejected", { necessary: true, analytics: false, marketing: false })}
              className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Odmítnout vše
            </button>
            {showDetails ? (
              <button
                onClick={() => save("custom")}
                className="flex items-center gap-1.5 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                Uložit výběr
              </button>
            ) : (
              <button
                onClick={() => setShowDetails(true)}
                className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm px-3 py-2.5 rounded-xl transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                Přizpůsobit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
