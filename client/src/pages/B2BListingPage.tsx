// ============================================================
// BEZMASAJIDLA.CZ — B2B Self-Service Restaurant Onboarding Portal
// "/inzerce/pridat-podnik" — Direct Monetization & Comgate Integration
// ============================================================

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Building2,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  Globe,
  Phone,
  Mail,
  Award,
  Crown
} from "lucide-react";

export default function B2BListingPage() {
  const [tier, setTier] = useState<"free" | "premium" | "top">("premium");
  const [formData, setFormData] = useState({
    restaurantName: "",
    ico: "",
    contactPerson: "",
    email: "",
    phone: "",
    city: "Praha",
    category: "Veganská",
    website: "",
    description: "",
  });

  const paymentMutation = trpc.payment.createPayment.useMutation({
    onSuccess: (data) => {
      toast.info("Přesměrovávám do platební brány Comgate...");
      window.location.href = data.redirectUrl;
    },
    onError: (err) => {
      toast.error(err.message || "Chyba při registraci podniku.");
    },
  });

  const contactMutation = trpc.contact.send.useMutation({
    onSuccess: () => {
      toast.success("Žádost o bezplatný zápis byla úspěšně odeslána!");
      setFormData({
        restaurantName: "",
        ico: "",
        contactPerson: "",
        email: "",
        phone: "",
        city: "Praha",
        category: "Veganská",
        website: "",
        description: "",
      });
    },
    onError: (err) => {
      toast.error(err.message || "Nepodařilo se odeslat žádost.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.restaurantName || !formData.email || !formData.phone) {
      toast.error("Vyplňte prosím název podniku, e-mail a telefon.");
      return;
    }

    if (tier === "free") {
      contactMutation.mutate({
        name: formData.contactPerson || formData.restaurantName,
        email: formData.email,
        subject: `[B2B Zápis ZDARMA] ${formData.restaurantName} (${formData.city})`,
        message: `Žádost o bezplatný zápis podniku:\n\n` +
          `Název: ${formData.restaurantName}\n` +
          `IČO: ${formData.ico}\n` +
          `Telefon: ${formData.phone}\n` +
          `Město: ${formData.city}\n` +
          `Kategorie: ${formData.category}\n` +
          `Web: ${formData.website}\n` +
          `Popis: ${formData.description}`,
      });
    } else {
      const price = tier === "premium" ? 2990 : 4990;
      const label = tier === "premium"
        ? `B2B Premium Profil — ${formData.restaurantName}`
        : `B2B TOP Sponzor Profil — ${formData.restaurantName}`;

      paymentMutation.mutate({
        priceCzk: price,
        label,
        payerEmail: formData.email,
        payerName: formData.contactPerson || formData.restaurantName,
        orderType: "b2b_listing",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <SEOHead
        title="Přidat podnik & Inzerce restaurací | Bezmasá Jídla"
        description="Získejte tisíce zákazníků hledajících bezmasé a veganské stravování. Zaregistrujte svou restauraci na portálu BezmasáJídla.cz."
        canonicalUrl="https://www.bezmasajidla.cz/inzerce/pridat-podnik"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Domů", url: "/" },
          { name: "Inzerce", url: "/inzerce" },
          { name: "Přidat podnik", url: "/inzerce/pridat-podnik" },
        ]}
      />
      <Header />

      {/* Hero Header */}
      <section className="py-12 bg-gradient-to-b from-[#16271E] to-[#0F1914] text-white">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>B2B Portál pro Restaurace a Bistro</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Získejte hosty, kteří hledají bezmasá jídla
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            BezmasáJídla.cz propojuje tisíce vědomých strávníků s nejlepšími vegetariánskými a veganskými podniky v ČR. Přidejte svůj podnik a oslovte cílové zákazníky.
          </p>
        </div>
      </section>

      {/* Main Content & Pricing Tiers */}
      <main className="flex-1 container max-w-5xl py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vyberte si úroveň propagace</h2>
          <p className="text-xs text-gray-600">Garance zobrazení a okamžitá aktivace přes platební bránu Comgate.</p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Free Tier */}
          <div
            onClick={() => setTier("free")}
            className={`cursor-pointer bg-white rounded-3xl p-6 border-2 transition-all flex flex-col justify-between ${
              tier === "free" ? "border-emerald-600 shadow-md ring-2 ring-emerald-600/20" : "border-gray-200 hover:border-emerald-300"
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Základní</span>
                {tier === "free" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              </div>
              <div className="text-3xl font-extrabold text-gray-900 mb-2">
                Zdarma
              </div>
              <p className="text-xs text-gray-600 mb-6">Základní zápis v katalogu restaurací.</p>

              <ul className="text-xs text-gray-700 space-y-2.5 mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Zápis v lokálním vyhlašování</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Zobrazení adresy a kontaktu</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Možnost uživatelských recenzí</li>
              </ul>
            </div>
            <button
              type="button"
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors ${
                tier === "free" ? "bg-emerald-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Zvolit Zpráva Zdarma
            </button>
          </div>

          {/* Premium Tier (Recommended) */}
          <div
            onClick={() => setTier("premium")}
            className={`relative cursor-pointer bg-gradient-to-b from-white to-emerald-50/40 rounded-3xl p-6 border-2 transition-all flex flex-col justify-between ${
              tier === "premium" ? "border-emerald-600 shadow-xl ring-4 ring-emerald-600/20" : "border-emerald-200 hover:border-emerald-400"
            }`}
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" /> Nejpopulárnější
            </div>

            <div>
              <div className="flex justify-between items-center mb-4 pt-2">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" /> PREMIUM Profil
                </span>
                {tier === "premium" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              </div>
              <div className="text-3xl font-extrabold text-gray-900 mb-1">
                2 990 Kč <span className="text-xs font-normal text-gray-500">/ rok</span>
              </div>
              <p className="text-xs text-gray-600 mb-6">Zvýrazněná karta s odznakem Ověřený podnik.</p>

              <ul className="text-xs text-gray-700 space-y-2.5 mb-6">
                <li className="flex items-center gap-2 font-medium text-emerald-950"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Odznak Ověřený podnik + Zvýraznění</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Vložení odkazu na Denní Menu</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Fotogalerie & Proklik na váš Web</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Přednostní zobrazení ve městě</li>
              </ul>
            </div>
            <button
              type="button"
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors ${
                tier === "premium" ? "bg-emerald-700 text-white shadow-md" : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
              }`}
            >
              Zvolit PREMIUM (2 990 Kč)
            </button>
          </div>

          {/* Top Sponsor Tier */}
          <div
            onClick={() => setTier("top")}
            className={`cursor-pointer bg-white rounded-3xl p-6 border-2 transition-all flex flex-col justify-between ${
              tier === "top" ? "border-amber-500 shadow-lg ring-2 ring-amber-500/20" : "border-gray-200 hover:border-amber-300"
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> TOP Sponzor
                </span>
                {tier === "top" && <CheckCircle2 className="w-5 h-5 text-amber-500" />}
              </div>
              <div className="text-3xl font-extrabold text-gray-900 mb-1">
                4 990 Kč <span className="text-xs font-normal text-gray-500">/ rok</span>
              </div>
              <p className="text-xs text-gray-600 mb-6">Maximální zviditelnění na hlavní straně a v mega menu.</p>

              <ul className="text-xs text-gray-700 space-y-2.5 mb-6">
                <li className="flex items-center gap-2 font-medium"><CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" /> 1. Pozice v doporučených podnicích</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" /> Banner v Týdenním plánovači jídel</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" /> PR Článek na blogu v ceně</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" /> Všechny výhody PREMIUM profilu</li>
              </ul>
            </div>
            <button
              type="button"
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors ${
                tier === "top" ? "bg-amber-500 text-amber-950 shadow-md" : "bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
            >
              Zvolit TOP Sponzor (4 990 Kč)
            </button>
          </div>
        </div>

        {/* Registration Form Box */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm max-w-3xl mx-auto">
          <div className="mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Registrační formulář podniku
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Vybraný balíček: <strong className="text-emerald-700">{tier === "free" ? "Základní (Zdarma)" : tier === "premium" ? "PREMIUM (2 990 Kč)" : "TOP Sponzor (4 990 Kč)"}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Název podniku *</label>
                <input
                  type="text"
                  value={formData.restaurantName}
                  onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                  placeholder="Např. Maitrea Restaurant"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">IČO *</label>
                <input
                  type="text"
                  value={formData.ico}
                  onChange={(e) => setFormData({ ...formData, ico: e.target.value })}
                  placeholder="12345678"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Kontaktní osoba</label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="Jan Novák"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">E-mail *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="info@restaurace.cz"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Telefon *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+420 777 123 456"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Město *</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Praha">Praha</option>
                  <option value="Brno">Brno</option>
                  <option value="Ostrava">Ostrava</option>
                  <option value="Plzeň">Plzeň</option>
                  <option value="Liberec">Liberec</option>
                  <option value="Olomouc">Olomouc</option>
                  <option value="Jiné">Jiné město</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Kategorie *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Veganská">100% Veganská</option>
                  <option value="Vegetariánská">Vegetariánská</option>
                  <option value="Bezmasá nabídka">Restaurace s bezmasou nabídkou</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Web podniku</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Popis podniku & poznámka</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Stručný popis podniku, týdenního menu nebo špecialit..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={paymentMutation.isPending || contactMutation.isPending}
                className="w-full bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm py-4 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>
                  {paymentMutation.isPending || contactMutation.isPending
                    ? "Zpracovávám..."
                    : tier === "free"
                    ? "Odeslat žádost o zápis zdarma"
                    : `Pokračovat k platbě v Comgate (${tier === "premium" ? "2 990 Kč" : "4 990 Kč"})`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center gap-4 text-[11px] text-gray-500 mt-6 pt-4 border-t border-gray-100">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Garance aktivace do 24h</span>
            <span>•</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Platba kartou, QR i bankovními tlačítky</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
