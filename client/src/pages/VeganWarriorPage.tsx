// ============================================================
// BEZMASAJIDLA.CZ — Vegan Warrior CZ Online Program & Challenge
// "Bezmasý Warrior: 21-Denní Transformace & High-Protein Plán"
// Monetization & Lead Generation Engine with Brevo API
// ============================================================

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Dumbbell,
  Flame,
  Zap,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Award,
  BookOpen,
  Mail,
  HeartHandshake
} from "lucide-react";
import { getRohlikLink, getKosikLink, trackAffiliateClick } from "@/lib/affiliates";

export default function VeganWarriorPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Váš startovací 7-denní plán byl odeslán na e-mail!");
    },
    onError: (err) => {
      toast.error(err.message || "Nepodařilo se přihlásit k výzvě.");
    },
  });

  const paymentMutation = trpc.payment.createPayment.useMutation({
    onSuccess: (data) => {
      toast.info("Přesměrovávám do platební brány Comgate...");
      window.location.href = data.redirectUrl;
    },
    onError: (err) => {
      toast.error(err.message || "Chyba při vytváření platby.");
    },
  });

  const handleBuyFullProgram = () => {
    if (!email || !email.includes("@")) {
      toast.error("Pro zakoupení programu zadejte prosím váš e-mail níže.");
      return;
    }
    paymentMutation.mutate({
      priceCzk: 490,
      label: "Bezmasý Warrior: 21-Denní VIP Program",
      payerEmail: email,
      orderType: "warrior_program",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Zadejte platný e-mail.");
      return;
    }
    subscribeMutation.mutate({ email });
  };

  const highProteinIngredients = ["tofu uzené", "seitan", "červená čočka", "tempeh", "cizrna", "chia semínka"];

  return (
    <div className="min-h-screen flex flex-col bg-[#0F1914] text-white">
      <SEOHead
        title="Bezmasý Warrior — 21-Denní High-Protein Výzva | Bezmasá Jídla"
        description="Transformujte své tělo a sílu na rostlinné stravě. 21-denní fitness program, recepty bohaté na bílkoviny, jídelníčky a nákupní košíky na Rohlík.cz."
        canonicalUrl="https://www.bezmasajidla.cz/bezmasy-warrior-vyzva"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Domů", url: "/" },
          { name: "Bezmasý Warrior Výzva", url: "/bezmasy-warrior-vyzva" },
        ]}
      />
      <Header />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-[#16271E] via-[#0F1914] to-[#0B130F]">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container max-w-5xl relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>První Český High-Protein Rostlinný Program</span>
            </div>

            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Bezmasý <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Warrior</span>
            </h1>

            <p className="text-emerald-100/90 text-lg sm:text-xl leading-relaxed mb-8">
              Být silný, mít energii a nabrat svalovou hmotu bez gramu masa. Komplexní 21-denní výzva inspirovaná světovým konceptem <em>Vegan Warrior</em> — uzpůsobená české kuchyni a dostupným surovinám.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl mb-10">
              <div className="bg-emerald-950/60 border border-emerald-800/60 rounded-xl p-3 text-center">
                <Dumbbell className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-emerald-200">120g+ bílkovin/den</span>
              </div>
              <div className="bg-emerald-950/60 border border-emerald-800/60 rounded-xl p-3 text-center">
                <Flame className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-emerald-200">21 dní jídelníčků</span>
              </div>
              <div className="bg-emerald-950/60 border border-emerald-800/60 rounded-xl p-3 text-center">
                <ShoppingBag className="w-5 h-5 text-teal-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-emerald-200">Rohlík.cz Košík</span>
              </div>
              <div className="bg-emerald-950/60 border border-emerald-800/60 rounded-xl p-3 text-center">
                <Award className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-emerald-200">100% Česká jídla</span>
              </div>
            </div>
          </div>

          {/* Lead Magnet / Opt-in Box */}
          <div className="bg-gradient-to-br from-emerald-900/90 to-teal-950/90 border border-emerald-700/60 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-sm max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                Získejte zdarma startovací balíček
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Stáhněte si 7-denní High-Protein Plán zdarma
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/90 mt-2">
                Pošleme vám na e-mail kompletní rozpis 7 dní, nákupní seznam a 15 rychlých proteinových receptů.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-2xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">Váš plán je na cestě!</h3>
                <p className="text-xs sm:text-sm text-emerald-200">
                  Zkontrolujte svou e-mailovou schránku <strong>{email}</strong>. Zaslali jsme vám startovací balíček a odkaz na nakoupení ingrediencí.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Zadejte váš e-mail..."
                    required
                    className="w-full bg-emerald-950/90 border border-emerald-700/80 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-emerald-950 font-extrabold text-sm py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>{subscribeMutation.isPending ? "Odesílám..." : "Získat 7-denní plán zdarma"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <div className="flex items-center justify-center gap-4 text-[11px] text-emerald-400/80 mt-4">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Nespamujeme</span>
              <span>•</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Odhlášení 1 klikem</span>
            </div>

            {/* Direct Comgate Purchase Box */}
            <div className="mt-8 pt-6 border-t border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-950/40 p-4 rounded-2xl border border-emerald-700/40">
              <div className="text-left">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Chcete plný přístup ihned?
                </span>
                <p className="text-sm font-bold text-white">
                  Kompletní 21-denní VIP Balíček & E-Kniha (490 Kč)
                </p>
                <p className="text-[11px] text-emerald-300">
                  Karta • QR Platba • Bankovní tlačítka • Apple Pay via Comgate
                </p>
              </div>

              <button
                type="button"
                onClick={handleBuyFullProgram}
                disabled={paymentMutation.isPending}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-amber-950 font-extrabold text-xs py-3 px-5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>{paymentMutation.isPending ? "Zpracovávám..." : "Koupit VIP Balíček (490 Kč)"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Program Details Section */}
      <section className="py-16 bg-[#0B130F] border-t border-emerald-950">
        <div className="container max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Co obsahuje kompletní 21-denní výzva?
            </h2>
            <p className="text-sm text-emerald-200/80">
              Navrženo pro aktivní lidi, sportovce i každého, kdo chce jíst zdravě bez zbytečné vědy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#14231B] border border-emerald-900/60 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-900/60 flex items-center justify-center text-emerald-400 mb-4">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">1. Kompletní E-Kniha & Průvodce</h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  Více než 60 receptů s přesným rozpisem kalorií, bílkovin, sacharidů a tuků. Žádná exotická ingredience, které neseženete.
                </p>
              </div>
              <ul className="text-xs text-emerald-300 space-y-1.5">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Svíčková se seitanem</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Proteinový seitanový guláš</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Tofu scramble & kaše</li>
              </ul>
            </div>

            <div className="bg-[#14231B] border border-emerald-900/60 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-900/60 flex items-center justify-center text-teal-400 mb-4">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">2. Nákupní Košíky 1 Klikem</h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  Získejte přímé nákupní seznamy propojené s Rohlík.cz a Košík.cz. Všechny suroviny pro daný týden přenesete do košíku za 3 sekundy.
                </p>
              </div>
              <div className="pt-2">
                <a
                  href={getRohlikLink("High Protein Vegan", highProteinIngredients)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  onClick={() => trackAffiliateClick("rohlik", "vegan_warrior", "challenge_page")}
                  className="w-full bg-[#D42B28] hover:bg-[#b8221f] text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Vyzkoušet košík na Rohlík.cz</span>
                </a>
              </div>
            </div>

            <div className="bg-[#14231B] border border-emerald-900/60 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-900/60 flex items-center justify-center text-amber-400 mb-4">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">3. Doporučené Suplementy & Oleje</h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  Praktické rady pro přírodní regeneraci, správné tuky (BIO panenský olivový olej z do-italie.cz) a přirozené vitamíny B12 a D3.
                </p>
              </div>
              <ul className="text-xs text-emerald-300 space-y-1.5">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Tipy na vstřebatelnost železa</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Krevní rozbory & mýty</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
