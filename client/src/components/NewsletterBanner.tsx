// ============================================================
// BEZMASAJIDLA.CZ — Newsletter Banner Component
// "Zelená Metropole" — shown only once per session
// ============================================================

import { useState, useEffect } from "react";
import { X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function NewsletterBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show only once per session
    const seen = sessionStorage.getItem("newsletter_seen");
    if (!seen) {
      const timer = setTimeout(() => setVisible(true), 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem("newsletter_seen", "1");
  };

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Děkujeme za přihlášení k odběru novinek!");
    handleDismiss();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4">
      <div className="bg-emerald-800 rounded-2xl shadow-2xl border border-emerald-700 p-5 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-emerald-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center flex-shrink-0">
            <Mail className="w-4 h-4 text-amber-900" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Novinky ze světa bezmasé Prahy
            </h3>
            <p className="text-emerald-300 text-xs mt-0.5">
              Nové restaurace, recepty a tipy každý týden.
            </p>
          </div>
        </div>
        <form onSubmit={handleSubscribe} className="flex gap-2">
          <input
            type="email"
            placeholder="Tvůj e-mail..."
            required
            className="flex-1 bg-emerald-700 border border-emerald-600 text-white placeholder-emerald-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <Button
            type="submit"
            className="bg-amber-400 hover:bg-amber-300 text-amber-900 font-semibold text-sm px-4 rounded-lg"
          >
            Přihlásit
          </Button>
        </form>
      </div>
    </div>
  );
}
