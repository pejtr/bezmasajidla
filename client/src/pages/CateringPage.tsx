// ============================================================
// BEZMASAJIDLA.CZ — Signature Catering Landing Page
// Maryna Deiak × BezmasáJídla.cz
// ============================================================

import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import {
  UtensilsCrossed,
  Sparkles,
  Calendar,
  Users,
  CheckCircle2,
  Phone,
  Mail,
  ArrowRight,
  ChefHat,
  Award,
  HeartHandshake,
  Leaf,
  Send,
} from "lucide-react";

export default function CateringPage() {
  const [guestCount, setGuestCount] = useState<number>(20);
  const [selectedPackage, setSelectedPackage] = useState<string>("signature");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    eventType: "firemni",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAF8]">
      <SEOHead
        title="Bezmasý Catering v Praze — Signature Catering by Maryna Deiak × BezmasáJídla.cz"
        description="Prémiový bezmasý catering pro firmy, soukromé oslavy a wedding eventy v Praze. Moderní evropská kuchyně, ukrajinské kořeny a středomořská lehkost bez masa."
        ogType="website"
        ogUrl="https://www.bezmasajidla.cz/catering"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Domů", url: "/" },
          { name: "Catering", url: "/catering" },
        ]}
      />
      <Header />

      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-[#1C352D] via-[#2A4D42] to-[#152B24] text-white pt-12 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4A7C59_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="container relative z-10 max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Left Text Column */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-amber-300 uppercase mb-4">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>MARYNA DEIAK × BEZMASÁJÍDLA.CZ</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4 font-serif">
                Bez masa. <br />
                <span className="text-amber-400">Bez kompromisu.</span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 font-light max-w-2xl mb-6 leading-relaxed">
                Signature catering od profesionální šéfkuchařky. Moderní evropská kuchyně, ukrajinské kořeny a středomořská lehkost pro firmy, soukromé oslavy i chvíle, kdy jídlo nemá být jen občerstvení, ale součást zážitku.
              </p>

              {/* Badges Bar */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mb-8 text-xs font-semibold">
                <span className="bg-white/15 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
                  📍 Praha & Okolí
                </span>
                <span className="bg-white/15 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
                  🏢 Firemní Catering
                </span>
                <span className="bg-white/15 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
                  🎉 Soukromé Eventy
                </span>
                <span className="bg-white/15 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
                  ✨ Menu Na Míru
                </span>
              </div>

              {/* Hero CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="#poptavka"
                  className="w-full sm:w-auto px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-2xl shadow-lg transition-all text-center"
                >
                  Poptat Catering
                </a>
                <a
                  href="#nabidka"
                  className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/20 transition-all text-center"
                >
                  Prohlédnout Menu
                </a>
              </div>
            </div>

            {/* Right Chef Card Image */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 bg-emerald-950 p-6 text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-amber-400 mb-4 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80"
                    alt="Maryna Deiak — Profesionální Šéfkuchařka"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Maryna Deiak</h3>
                <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-3">
                  Profesionální Šéfkuchařka
                </p>
                <p className="text-xs text-emerald-100/80 italic leading-relaxed">
                  "Spojuji klasické kuchařské řemeslo s moderní bezmasou gastronomií. Každé menu sestavuji s důrazem na čistotu surovin, sezónnost a estetiku."
                </p>
              </div>
            </div>
          </div>

          {/* Value Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10 text-center">
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-emerald-100">
              <UtensilsCrossed className="w-4 h-4 text-amber-400" />
              <span>Chuť bez kompromisu</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-emerald-100">
              <ChefHat className="w-4 h-4 text-amber-400" />
              <span>Poctivé Řemeslo</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-emerald-100">
              <Leaf className="w-4 h-4 text-amber-400" />
              <span>100% Sezónnost</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-emerald-100">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Lehkost & Estetika</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container max-w-6xl mx-auto px-4 py-16">
        {/* Section: Catering Packages */}
        <section id="nabidka" className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider block mb-2">
              Naše Nabídka
            </span>
            <h2 className="text-3xl font-extrabold text-[#1C2826] font-serif">
              Cateringové Balíčky & Koncepty
            </h2>
            <p className="text-sm text-[#5A685D] mt-2">
              Vyberte si formát, který nejlépe odpovídá charakteru vaší události.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Green Office */}
            <div
              onClick={() => setSelectedPackage("office")}
              className={`bg-white rounded-3xl p-6 border transition-all cursor-pointer shadow-sm relative flex flex-col justify-between ${
                selectedPackage === "office"
                  ? "border-[#4A7C59] ring-2 ring-[#4A7C59]/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#4A7C59] flex items-center justify-center mb-4">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1C2826] mb-2">GREEN OFFICE</h3>
                <p className="text-xs text-[#5A685D] leading-relaxed mb-4">
                  Lehká a svěží jídla pro porady, workshopy, teambuildingy a menší firemní setkání.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <span className="text-xs text-[#7A887D] block">Cenový odhad</span>
                <span className="text-lg font-bold text-[#4A7C59]">od 590–690 Kč <span className="text-xs font-normal text-gray-500">/ os.</span></span>
              </div>
            </div>

            {/* Maryna Signature */}
            <div
              onClick={() => setSelectedPackage("signature")}
              className={`bg-white rounded-3xl p-6 border transition-all cursor-pointer shadow-sm relative flex flex-col justify-between ${
                selectedPackage === "signature"
                  ? "border-[#4A7C59] ring-2 ring-[#4A7C59]/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="absolute -top-3 right-4 bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-xs">
                Nejoblíbenější
              </div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <ChefHat className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1C2826] mb-2">MARYNA SIGNATURE</h3>
                <p className="text-xs text-[#5A685D] leading-relaxed mb-4">
                  Kurátorované signature menu. Vyvážená kombinace teplých a studených chodů s kvalitním servisem.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <span className="text-xs text-[#7A887D] block">Cenový odhad</span>
                <span className="text-lg font-bold text-[#4A7C59]">od 890–1 090 Kč <span className="text-xs font-normal text-gray-500">/ os.</span></span>
              </div>
            </div>

            {/* Signature Event */}
            <div
              onClick={() => setSelectedPackage("event")}
              className={`bg-white rounded-3xl p-6 border transition-all cursor-pointer shadow-sm relative flex flex-col justify-between ${
                selectedPackage === "event"
                  ? "border-[#4A7C59] ring-2 ring-[#4A7C59]/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1C2826] mb-2">SIGNATURE EVENT</h3>
                <p className="text-xs text-[#5A685D] leading-relaxed mb-4">
                  Menu na míru, prémiový plating a rautová prezentace včetně možnosti profesionální obsluhy.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <span className="text-xs text-[#7A887D] block">Cenový odhad</span>
                <span className="text-lg font-bold text-[#4A7C59]">od 1 190–1 490 Kč <span className="text-xs font-normal text-gray-500">/ os.</span></span>
              </div>
            </div>

            {/* Private Table by Maryna */}
            <div
              onClick={() => setSelectedPackage("privatetable")}
              className={`bg-white rounded-3xl p-6 border transition-all cursor-pointer shadow-sm relative flex flex-col justify-between ${
                selectedPackage === "privatetable"
                  ? "border-[#4A7C59] ring-2 ring-[#4A7C59]/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1C2826] mb-2">PRIVATE TABLE</h3>
                <p className="text-xs text-[#5A685D] leading-relaxed mb-4">
                  Pro 6–14 hostů. Komorní chef experience s osobnou účastí Maryny a individuálním degustčním menu.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <span className="text-xs text-[#7A887D] block">Cenový odhad</span>
                <span className="text-lg font-bold text-[#4A7C59]">od 1 800 Kč <span className="text-xs font-normal text-gray-500">/ os.</span></span>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Signature Menu Concepts */}
        <section className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider block mb-2">
              Kulinářský Styl
            </span>
            <h2 className="text-3xl font-extrabold text-[#1C2826] font-serif">
              Signature Menu Koncepty
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Kyiv Roots */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="h-44 rounded-2xl overflow-hidden mb-5">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
                  alt="Kyiv Roots"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-[#1C2826] mb-2">KYIV ROOTS</h3>
              <p className="text-xs text-[#4A7C59] font-semibold mb-3">Moderní interpretace postní kuchyně</p>
              <ul className="space-y-1.5 text-xs text-[#5A685D]">
                <li className="flex items-center gap-2">• Pečená řepa a uzená pohanka</li>
                <li className="flex items-center gap-2">• Moderní varenyky s bramborem a houbami</li>
                <li className="flex items-center gap-2">• Fermentovaná zelenina & koření</li>
                <li className="flex items-center gap-2">• Mák, vlašské ořechy a lesní ovoce</li>
              </ul>
            </div>

            {/* Mediterranean Table */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="h-44 rounded-2xl overflow-hidden mb-5">
                <img
                  src="https://images.unsplash.com/photo-1577906096429-f73cbe038379?auto=format&fit=crop&w=600&q=80"
                  alt="Mediterranean Table"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-[#1C2826] mb-2">MEDITERRANEAN TABLE</h3>
              <p className="text-xs text-[#4A7C59] font-semibold mb-3">Středomořské suroviny, lehce a poctivě</p>
              <ul className="space-y-1.5 text-xs text-[#5A685D]">
                <li className="flex items-center gap-2">• Sametový hummus s tahini & pečený lilek</li>
                <li className="flex items-center gap-2">• Domácí křupavá focaccia s rozmarýnem</li>
                <li className="flex items-center gap-2">• Sušená rajčata, olivy & čerstvé bylinky</li>
                <li className="flex items-center gap-2">• Premium panenský olivový olej</li>
              </ul>
            </div>

            {/* Modern Europe */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="h-44 rounded-2xl overflow-hidden mb-5">
                <img
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80"
                  alt="Modern Europe"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-[#1C2826] mb-2">MODERN EUROPE</h3>
              <p className="text-xs text-[#4A7C59] font-semibold mb-3">Současná evropská gastronomie</p>
              <ul className="space-y-1.5 text-xs text-[#5A685D]">
                <li className="flex items-center gap-2">• Sezónní zeleninové tartaře & krémy</li>
                <li className="flex items-center gap-2">• Pečené dýně, květákové steaky & seitan</li>
                <li className="flex items-center gap-2">• Autorské omáčky ze sníženým obsahem tuku</li>
                <li className="flex items-center gap-2">• Elegantní finger food a minidezerty</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section: Process (Jak to funguje) */}
        <section className="bg-[#F0F4EF] rounded-3xl p-8 sm:p-12 mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C2826] font-serif">
              Jak Objednávka Funguje
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-[#4A7C59] text-white font-bold text-sm flex items-center justify-center mb-3">
                1
              </div>
              <h4 className="font-bold text-[#1C2826] mb-1">POPTÁVKA</h4>
              <p className="text-xs text-[#5A685D]">
                Vyplňte formulář níže nebo nás kontaktujte s informacemi o akci.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-[#4A7C59] text-white font-bold text-sm flex items-center justify-center mb-3">
                2
              </div>
              <h4 className="font-bold text-[#1C2826] mb-1">NAVRHNEME MENU</h4>
              <p className="text-xs text-[#5A685D]">
                Připravíme nabídku přímo na míru podle počtu hostů a rozpočtu.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-[#4A7C59] text-white font-bold text-sm flex items-center justify-center mb-3">
                3
              </div>
              <h4 className="font-bold text-[#1C2826] mb-1">POTVRZENÍ</h4>
              <p className="text-xs text-[#5A685D]">
                Dolaďujeme detaily, časový harmonogram a potvrdíme rezervaci termínu.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-[#4A7C59] text-white font-bold text-sm flex items-center justify-center mb-3">
                4
              </div>
              <h4 className="font-bold text-[#1C2826] mb-1">REALIZACE</h4>
              <p className="text-xs text-[#5A685D]">
                Doručíme skvělé jídlo, prostřeme a zajistíme kompletní servis bez starostí.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Catering Inquiry Form */}
        <section id="poptavka" className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider block mb-2">
                Nezávazná poptávka
              </span>
              <h2 className="text-3xl font-extrabold text-[#1C2826] font-serif mb-2">
                Připraveni na Chuťový Zážitek?
              </h2>
              <p className="text-sm text-[#5A685D]">
                Ozvěte se nám a my vám do 24 hodin připravíme nabídku přímo pro váš event.
              </p>
            </div>

            {formSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-[#4A7C59] mx-auto mb-3" />
                <h3 className="text-xl font-bold text-[#1C2826] mb-2">Poptávka byla úspěšně odeslána!</h3>
                <p className="text-sm text-[#5A685D]">
                  Děkujeme. Ozveme se vám zpět na uvedený e-mail do 24 hodin s návrhem menu.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2C352E] uppercase mb-1">
                      Jméno a příjmení / Firma *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jan Novák / Název firmy"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#4A7C59] focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C352E] uppercase mb-1">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jan.novak@email.cz"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#4A7C59] focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2C352E] uppercase mb-1">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+420 777 123 456"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#4A7C59] focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C352E] uppercase mb-1">
                      Datum Akce
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#4A7C59] focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C352E] uppercase mb-1">
                      Odhadovaný Počet Hostů
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={200}
                      value={guestCount}
                      onChange={(e) => setGuestCount(parseInt(e.target.value) || 20)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#4A7C59] focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C352E] uppercase mb-1">
                    Detailnější představa & Poznámky
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Místo konání, speciální dietní požadavky, preferovaný cateringový balíček..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#4A7C59] focus:outline-none text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#4A7C59] hover:bg-[#3D6649] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-base"
                >
                  <Send className="w-5 h-5" />
                  Odeslat Nezávaznou Poptávku
                </button>
              </form>
            )}

            {/* Direct Contact Footer */}
            <div className="mt-8 pt-8 border-t border-gray-100 text-center flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-[#5A685D]">
              <a href="tel:+420734123456" className="flex items-center gap-2 hover:text-[#4A7C59] font-medium">
                <Phone className="w-4 h-4 text-[#4A7C59]" />
                <span>+420 734 123 456</span>
              </a>
              <a href="mailto:catering@bezmasajidla.cz" className="flex items-center gap-2 hover:text-[#4A7C59] font-medium">
                <Mail className="w-4 h-4 text-[#4A7C59]" />
                <span>catering@bezmasajidla.cz</span>
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
