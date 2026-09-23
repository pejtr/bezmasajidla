import React, { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { hermelinAnalytics, HermelinCtaPosition, getTrackingContext } from "@/lib/hermelinTracking";
import { BookOpen, Check, Download, Sparkles, Loader2 } from "lucide-react";

interface HermelinEbookCtaProps {
  position: HermelinCtaPosition;
  className?: string;
  compact?: boolean;
}

export default function HermelinEbookCta({
  position,
  className = "",
  compact = false,
}: HermelinEbookCtaProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: (data) => {
      setIsSuccess(true);
      hermelinAnalytics.trackSignupCompleted(position);

      // Trigger direct PDF download
      triggerDownload();
    },
    onError: (err) => {
      setErrorMessage(err.message || "Nepodařilo se přihlásit k odběru. Zkuste to prosím znovu.");
    },
  });

  useEffect(() => {
    hermelinAnalytics.trackCtaView(position);
  }, [position]);

  const triggerDownload = () => {
    hermelinAnalytics.trackDownloaded(position);
    const link = document.createElement("a");
    link.href = "/ebooks/hermelin_around_the_world_ebook.pdf";
    link.download = "hermelin_around_the_world_ebook.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !email.includes("@")) {
      setErrorMessage("Zadejte prosím platnou e-mailovou adresu.");
      return;
    }

    if (!consent) {
      setErrorMessage("Pro zaslání e-booku je nutné potvrdit souhlas se zpracováním e-mailu.");
      return;
    }

    hermelinAnalytics.trackCtaClick(position);
    hermelinAnalytics.trackSignupStarted(position);

    const trackingCtx = getTrackingContext();

    subscribeMutation.mutate({
      email: email.trim().toLowerCase(),
      source: "hermelin_ebook",
      landingPage: "/varianty-nakladaneho-hermelinu",
      utmSource: trackingCtx.utm_source,
      utmMedium: trackingCtx.utm_medium,
      utmCampaign: trackingCtx.utm_campaign,
      utmContent: trackingCtx.utm_content || `cta_${position}`,
      consent: true,
    });
  };

  return (
    <div
      id={position === "A" ? "stahnout-ebook" : undefined}
      data-testid={`hermelin-cta-${position.toLowerCase()}`}
      className={`relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-emerald-50/70 p-6 md:p-8 shadow-md transition-all duration-300 ${className}`}
    >
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-amber-200/30 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-emerald-200/30 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
        {/* Preview image */}
        <div className="w-full md:w-56 shrink-0 flex flex-col items-center">
          <div className="relative group overflow-hidden rounded-xl shadow-lg border border-amber-300/60 bg-white transform transition hover:scale-105 duration-300">
            <img
              src="/images/hermelin-15-variant-prehled.jpg"
              alt="E-book Hermelín Around the World — 15 autorských variant nakládaného hermelínu"
              className="w-full h-auto object-cover max-h-48 md:max-h-56"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
              <span className="text-[11px] font-semibold text-white tracking-wide flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                E-BOOK • 15 RECEPTŮ
              </span>
            </div>
          </div>
        </div>

        {/* Content & Form */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Bezplatný degustační e-book
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Hermelín Around the World
          </h3>

          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
            Kompletní průvodce pro domácí přípravu: od české hospodské klasiky přes Maroko a Sicílii až po prémiový černý česnek s lanýžem.
          </p>

          {/* Value props */}
          <div className="grid grid-cols-2 gap-2 text-xs md:text-sm font-medium text-gray-700 mb-5">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>15 autorských receptů</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>30 fotografií</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Doporučené oleje</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Tipy na servírování</span>
            </div>
          </div>

          {/* State: Form or Success */}
          {isSuccess ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-sm animate-fade-in">
              <div className="flex items-center gap-2 font-bold mb-1 text-base">
                <Check className="w-5 h-5 text-emerald-600" />
                Váš e-book je připraven!
              </div>
              <p className="text-xs md:text-sm text-emerald-800 mb-3">
                Stahování se automaticky spustilo. Zkontrolovat můžete i svou e-mailovou schránku, kam jsme vám zaslali záložní odkaz.
              </p>
              <button
                type="button"
                onClick={triggerDownload}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5" />
                Stáhnout PDF znovu
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto md:mx-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => hermelinAnalytics.trackCtaClick(position)}
                  placeholder="Zadejte váš e-mail..."
                  required
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none bg-white text-gray-900 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold text-sm transition shadow-sm hover:shadow disabled:opacity-75"
                >
                  {subscribeMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Připravuji...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Získat e-book
                    </>
                  )}
                </button>
              </div>

              {errorMessage && (
                <p className="text-xs text-rose-600 font-medium">{errorMessage}</p>
              )}

              <div className="flex items-start gap-2 max-w-lg mx-auto md:mx-0 text-left">
                <input
                  type="checkbox"
                  id={`consent-${position}`}
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor={`consent-${position}`} className="text-[11px] text-gray-500 leading-tight">
                  Souhlasím se zasláním e-booku a občasných bezmasých receptů. Z odběru se můžete kdykoli odhlásit. Žádný spam.
                </label>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
