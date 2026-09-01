// ============================================================
// BEZMASAJIDLA.CZ — Commercial Signature Catering Engine
// MATOUŠ MATĚJ × BEZMASÁJÍDLA.CZ
// 3 Standard Packages, Interactive Price Calculator & Lead Tracking
// ============================================================

import { useState, useId } from "react";
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
  Leaf,
  Send,
  Calculator,
  Wine,
  GlassWater,
  ShieldCheck,
  Check,
} from "lucide-react";

// ── 3 Standard Commercial Packages ──────────────────────────
const CATERING_PACKAGES = [
  {
    id: "office",
    name: "GREEN OFFICE",
    pricePerPerson: 590,
    minGuests: 15,
    tagline: "Svěží & Lehké",
    badge: "Pro Firmy & Workshopy",
    description: "Lehká a zdravá bezmasá jídla pro porady, týmové snídaně, teambuildingy a workshopy.",
    color: "border-emerald-500 bg-emerald-50/40 text-emerald-800",
    features: [
      "4× Studený finger food (jednohubky & tapas)",
      "2× Sezónní salát nebo tartař z pečlivě vybrané zeleniny",
      "1× Lehký dezert (chia pudink / bezlepkový koláč)",
      "1× Domácí osvěžující limonáda (máta/citrón)",
    ],
  },
  {
    id: "signature",
    name: "MATOUŠ SIGNATURE",
    pricePerPerson: 950,
    minGuests: 10,
    tagline: "Kurátorovaný Raut",
    badge: "⚡ Nejoblíbenější",
    description: "Kompletní zážitkové menu. Vyvážená kombinace teplých i studených chodů s prémiovým servisem.",
    color: "border-amber-500 bg-amber-50/40 text-amber-950 ring-2 ring-amber-400/30",
    features: [
      "6× Studené tapas & bruschetty (hummus, pečený lilek, sušená rajčata)",
      "3× Teplé signature chody (květákový steak, seitanový goulash, varenyky)",
      "2× Autorský dezert Matouše Matěje",
      "Nealko nápojový bar & ovocné limonády v ceně",
      "Kompletní servírovací rautové nádobí",
    ],
  },
  {
    id: "privatetable",
    name: "PRIVATE TABLE BY MATOUŠ",
    pricePerPerson: 1800,
    minGuests: 6,
    maxGuests: 15,
    tagline: "Osobní Chef Experience",
    badge: "VIP Degustace",
    description: "Komorní fine-dining pro 6 až 15 osob s osobní účastí šéfkuchaře Matouše Matěje.",
    color: "border-purple-600 bg-purple-50/40 text-purple-950",
    features: [
      "5 Chodové degustační menu připravené přímo před hosty",
      "Párování s bio nealko mošty, kombuchami a výběrovou kávou",
      "Osobní příprava a komentované servírování šéfkuchařem",
      "Plný skleněný & porcelánový servis v ceně",
    ],
  },
];

export default function CateringPage() {
  const guestCountInputId = useId();
  // Calculator state
  const [selectedPkgId, setSelectedPkgId] = useState<string>("signature");
  const [guestCount, setGuestCount] = useState<number>(25);
  const [includeBioDrinks, setIncludeBioDrinks] = useState<boolean>(true);
  const [includeGlassware, setIncludeGlassware] = useState<boolean>(false);
  const [includeStaff, setIncludeStaff] = useState<boolean>(false);

  // Form submission state
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    eventType: "firemni",
    notes: "",
  });

  const activePackage = CATERING_PACKAGES.find((p) => p.id === selectedPkgId) || CATERING_PACKAGES[1];

  // Price Calculation Logic
  const basePricePerPerson = activePackage.pricePerPerson;
  const drinkAddon = includeBioDrinks ? 150 : 0;
  const glasswareAddon = includeGlassware ? 80 : 0;
  const staffFlatFee = includeStaff ? 3500 : 0;

  // Volume discounts
  let volumeDiscountPct = 0;
  if (guestCount >= 80) volumeDiscountPct = 10;
  else if (guestCount >= 50) volumeDiscountPct = 5;

  const grossPerPerson = basePricePerPerson + drinkAddon + glasswareAddon;
  const discountedPerPerson = Math.round(grossPerPerson * (1 - volumeDiscountPct / 100));
  const estimatedTotal = discountedPerPerson * guestCount + staffFlatFee;

  const handleApplyCalculatorToForm = () => {
    const el = document.getElementById("poptavka");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        packageId: activePackage.id,
        packageName: activePackage.name,
        guestCount,
        estimatedTotal,
        discountedPerPerson,
        includeBioDrinks,
        includeGlassware,
        includeStaff,
      };

      await fetch("/api/catering-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setFormSubmitted(true);
    } catch (err) {
      console.error("Inquiry submit error", err);
      setFormSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAF8]">
      <SEOHead
        title="Bezmasý Catering v Praze — Signature Catering by Matouš Matěj × BezmasáJídla.cz"
        description="Prémiový bezmasý catering pro firmy, soukromé oslavy a wedding eventy v Praze. Kalkulačka ceny na míru, 3 pevné balíčky, osobní chef experience."
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
                <span>MATOUŠ MATĚJ × BEZMASÁJÍDLA.CZ</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4 font-serif">
                Bez masa. <br />
                <span className="text-amber-400">Bez kompromisu.</span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 font-light max-w-2xl mb-6 leading-relaxed">
                Signature catering od šéfkuchaře Matouše Matěje. Moderní evropská kuchyně, autorské receptury a středomořská lehkost pro firmy, soukromé oslavy i chvíle, kdy jídlo nemá být jen občerstvení, ale součást zážitku.
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
                  href="#kalkulacka"
                  className="w-full sm:w-auto px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-2xl shadow-lg transition-all text-center flex items-center justify-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Spočítat Cenu Akce</span>
                </a>
                <a
                  href="#balicky"
                  className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/20 transition-all text-center"
                >
                  Prohlédnout Balíčky
                </a>
              </div>
            </div>

            {/* Right Chef Card Image */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 bg-emerald-950 p-6 text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-amber-400 mb-4 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80"
                    alt="Matouš Matěj — Profesionální Šéfkuchař"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Matouš Matěj</h3>
                <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-3">
                  Profesionální Šéfkuchař
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
        {/* Section 1: 3 Standard Commercial Packages */}
        <section id="balicky" className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider block mb-2">
              Standardní Nabídka
            </span>
            <h2 className="text-3xl font-extrabold text-[#1C2826] font-serif">
              3 Pevné Cateringové Balíčky
            </h2>
            <p className="text-sm text-[#5A685D] mt-2">
              Jasně definované složení menu i cena. Žádné skryté poplatky.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CATERING_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPkgId(pkg.id)}
                className={`bg-white rounded-3xl p-7 border transition-all cursor-pointer shadow-sm relative flex flex-col justify-between ${
                  selectedPkgId === pkg.id
                    ? "border-[#4A7C59] ring-2 ring-[#4A7C59]/30 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3.5 right-6 bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-xs">
                    {pkg.badge}
                  </div>
                )}

                <div>
                  <span className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider block mb-1">
                    {pkg.tagline}
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#1C2826] font-serif mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-[#5A685D] leading-relaxed mb-6">
                    {pkg.description}
                  </p>

                  {/* Price Banner */}
                  <div className="bg-[#F4F7F4] rounded-2xl p-4 mb-6 border border-emerald-100/60">
                    <span className="text-xs text-[#7A887D] block mb-0.5">Základní cena</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-[#1C2826]">{pkg.pricePerPerson} Kč</span>
                      <span className="text-xs text-gray-500 font-medium">/ osoba</span>
                    </div>
                    <span className="text-[11px] text-[#4A7C59] font-semibold block mt-1">
                      Minimálně {pkg.minGuests} osob
                    </span>
                  </div>

                  {/* Features checklist */}
                  <div className="space-y-3 mb-6">
                    {pkg.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-[#3C4A3E]">
                        <Check className="w-4 h-4 text-[#4A7C59] flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedPkgId(pkg.id);
                    handleApplyCalculatorToForm();
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5 ${
                    selectedPkgId === pkg.id
                      ? "bg-[#4A7C59] text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span>Vybrat tento balíček</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Interactive Real-Time Price Calculator */}
        <section id="kalkulacka" className="mb-20 bg-gradient-to-br from-[#1C352D] to-[#25463B] rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-amber-300 mb-3 border border-white/10">
                <Calculator className="w-4 h-4 text-amber-300" />
                <span>Interaktivní Výpočet Ceny</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif mb-2">
                Kalkulačka Ceny Cateringu
              </h2>
              <p className="text-sm text-emerald-100/80">
                Spočítejte si okamžitou orientační cenu pro vaši akci podle počtu osob a volitelných doplňků.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Configuration Inputs (7 cols) */}
              <div className="lg:col-span-7 space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                {/* Step A: Package Select */}
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                    1. Vyberte Balíček
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {CATERING_PACKAGES.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPkgId(p.id)}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          selectedPkgId === p.id
                            ? "bg-amber-400 text-slate-900 border-amber-300 font-bold shadow-md"
                            : "bg-white/10 text-white border-white/15 hover:bg-white/15"
                        }`}
                      >
                        <span className="text-xs font-extrabold block truncate">{p.name}</span>
                        <span className="text-[10px] opacity-80">{p.pricePerPerson} Kč / os.</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step B: Guest Count Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor={guestCountInputId} className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      2. Počet Osob (Hostů)
                    </label>
                    <span className="text-lg font-black text-amber-400 bg-black/30 px-3 py-0.5 rounded-lg border border-amber-400/30">
                      {guestCount} osob
                    </span>
                  </div>
                  <input
                    id={guestCountInputId}
                    type="range"
                    min={activePackage.minGuests}
                    max={activePackage.maxGuests || 150}
                    step={1}
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value) || 10)}
                    className="w-full h-2 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <div className="flex justify-between text-[10px] text-emerald-200/60 mt-1">
                    <span>Min {activePackage.minGuests} osob</span>
                    {guestCount >= 50 && <span className="text-amber-300 font-bold">🎉 5% Sleva pro 50+ osob</span>}
                    {guestCount >= 80 && <span className="text-amber-300 font-bold">🎉 10% Sleva pro 80+ osob</span>}
                    <span>Max {activePackage.maxGuests || 150} osob</span>
                  </div>
                </div>

                {/* Step C: Add-ons checkboxes */}
                <div className="space-y-3 pt-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-amber-300">
                    3. Volitelné Doplňky
                  </span>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <Wine className="w-4 h-4 text-amber-300" />
                      <div>
                        <span className="text-xs font-semibold block">Bio Nealko Nápojový Bar</span>
                        <span className="text-[10px] text-emerald-200/70">Domácí mošty, kombuchy & limonády (+150 Kč/os)</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={includeBioDrinks}
                      onChange={(e) => setIncludeBioDrinks(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400 accent-amber-400"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <GlassWater className="w-4 h-4 text-amber-300" />
                      <div>
                        <span className="text-xs font-semibold block">Zapůjčení Skla & Porcelánu</span>
                        <span className="text-[10px] text-emerald-200/70">Designový inventář vč. debarasu (+80 Kč/os)</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={includeGlassware}
                      onChange={(e) => setIncludeGlassware(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400 accent-amber-400"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <ChefHat className="w-4 h-4 text-amber-300" />
                      <div>
                        <span className="text-xs font-semibold block">Profesionální Obsluha Na Místě</span>
                        <span className="text-[10px] text-emerald-200/70">Obsluha po celou dobu akce (+3 500 Kč paušál)</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={includeStaff}
                      onChange={(e) => setIncludeStaff(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400 accent-amber-400"
                    />
                  </label>
                </div>
              </div>

              {/* Right Calculated Total Result Card (5 cols) */}
              <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border-4 border-amber-400/40">
                <span className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider block mb-1">
                  Kalkulovaná Odhadní Cena
                </span>
                <h3 className="text-xl font-bold text-[#1C2826] mb-4">
                  {activePackage.name}
                </h3>

                <div className="space-y-2 border-t border-b border-gray-100 py-4 mb-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Počet hostů:</span>
                    <span className="font-bold text-gray-900">{guestCount} osob</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Základní cena:</span>
                    <span className="font-bold text-gray-900">{basePricePerPerson} Kč / os.</span>
                  </div>
                  {includeBioDrinks && (
                    <div className="flex justify-between text-emerald-700">
                      <span>+ Bio Nealko Bar:</span>
                      <span className="font-bold">+150 Kč / os.</span>
                    </div>
                  )}
                  {includeGlassware && (
                    <div className="flex justify-between text-emerald-700">
                      <span>+ Sklo & Porcelán:</span>
                      <span className="font-bold">+80 Kč / os.</span>
                    </div>
                  )}
                  {volumeDiscountPct > 0 && (
                    <div className="flex justify-between text-amber-600 font-bold bg-amber-50 p-1.5 rounded-lg">
                      <span>🎉 Množstevní sleva ({volumeDiscountPct}%):</span>
                      <span>Ušetříte {Math.round(grossPerPerson * (volumeDiscountPct / 100))} Kč/os</span>
                    </div>
                  )}
                  {includeStaff && (
                    <div className="flex justify-between text-purple-700">
                      <span>+ Obsluha na místě:</span>
                      <span className="font-bold">+3 500 Kč</span>
                    </div>
                  )}
                </div>

                {/* Final Total Display */}
                <div className="mb-6">
                  <span className="text-xs text-gray-500 block">Celková orientační cena akce:</span>
                  <div className="text-4xl font-black text-[#4A7C59] tracking-tight">
                    {estimatedTotal.toLocaleString("cs-CZ")} Kč
                  </div>
                  <span className="text-xs text-gray-400">
                    ({discountedPerPerson} Kč / osoba vč. vybraných doplňků)
                  </span>
                </div>

                <button
                  onClick={handleApplyCalculatorToForm}
                  className="w-full py-4 bg-[#4A7C59] hover:bg-[#3D6649] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Poptat Tuto Akci</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Catering Inquiry Form with Lead Tracking */}
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
                Vyplňte kontaktní údaje a my vám do 24 hodin zašleme přesné potvrzení termínu a finální rozpočet.
              </p>
            </div>

            {/* Selected summary banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#4A7C59]" />
                <div>
                  <span className="font-bold text-[#1C2826]">Vybraný balíček: {activePackage.name}</span>
                  <span className="text-[#5A685D] block">Počet osob: {guestCount} | Kalkulováno: {estimatedTotal.toLocaleString("cs-CZ")} Kč</span>
                </div>
              </div>
              <span className="bg-[#4A7C59] text-white font-bold px-3 py-1 rounded-full text-[10px]">
                Nezávazná rezervace
              </span>
            </div>

            {formSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-[#4A7C59] mx-auto mb-3" />
                <h3 className="text-xl font-bold text-[#1C2826] mb-2">Poptávka byla úspěšně odeslána!</h3>
                <p className="text-sm text-[#5A685D]">
                  Děkujeme. Šéfkuchař Matouš Matěj a náš tým se vám ozvou zpět na e-mail <strong>{formData.email}</strong> do 24 hodin.
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C352E] uppercase mb-1">
                    Poznámka / Místo konání / Diety
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Místo konání akce v Praze, alergie, speciální přání..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#4A7C59] focus:outline-none text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#4A7C59] hover:bg-[#3D6649] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                  <span>{isSubmitting ? "Odesílám..." : "Odeslat Nezávaznou Poptávku Akce"}</span>
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
