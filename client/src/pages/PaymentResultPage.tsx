// ============================================================
// BEZMASAJIDLA.CZ — Payment Result Page (Comgate Redirect Target)
// Handles /platba/uspech & /platba/zruseno
// ============================================================

import { Link, useSearch } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { CheckCircle2, XCircle, ArrowRight, ShoppingBag, Sparkles, BookOpen } from "lucide-react";

export default function PaymentResultPage({ status }: { status: "success" | "cancelled" }) {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const orderId = searchParams.get("orderId") || "BM-ORDER";

  const isSuccess = status === "success";

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <SEOHead
        title={`${isSuccess ? "Platba úspěšná" : "Platba byla zrušena"} | Bezmasá Jídla`}
        description="Stav platby přes bránu Comgate na portálu Bezmasájídla.cz"
        canonicalUrl={`https://www.bezmasajidla.cz/platba/${status}`}
      />
      <Header />

      <main className="flex-1 container max-w-2xl py-16 flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-emerald-100 p-8 sm:p-12 shadow-sm text-center w-full">
          {isSuccess ? (
            <>
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                Platba proběhla úspěšně
              </span>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Děkujeme za vaši objednávku!
              </h1>

              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Vaše platba byla v pořádku zpracována platební bránou Comgate. Detaily objednávky č. <strong>{orderId}</strong> jsme odeslali na váš e-mail.
              </p>

              <div className="bg-emerald-50/60 rounded-2xl border border-emerald-100 p-4 text-left mb-8 space-y-2 text-xs text-emerald-900">
                <div className="flex items-center gap-2 font-semibold text-emerald-800">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Co bude následovat?</span>
                </div>
                <p>1. Zkontrolujte e-mail s potvrzením a odkazem na stažení e-knihy/plánu.</p>
                <p>2. V týdenním plánovači si můžete rovnou jedním klikem nakoupit suroviny na Rohlík.cz nebo Košík.cz.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/bezmasy-warrior-vyzva">
                  <button className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Přejít na Bezmasého Warriora</span>
                  </button>
                </Link>
                <Link href="/tydenni-planovac-receptu">
                  <button className="w-full sm:w-auto bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-sm px-6 py-3 rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Týdenní Plánovač</span>
                  </button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10" />
              </div>

              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                Platba nebyla dokončena
              </span>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Platba byla zrušena
              </h1>

              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Platba pro objednávku č. <strong>{orderId}</strong> byla stornována nebo vypršel časový limit. Z účtu vám nebyly odečteny žádné peníze.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/bezmasy-warrior-vyzva">
                  <button className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <span>Zkusit zaplatit znovu</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
