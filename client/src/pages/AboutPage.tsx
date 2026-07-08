// ============================================================
// BEZMASAJIDLA.CZ — O nás (About Page)
// "Zelená Metropole" — mission, story, contact, E-E-A-T signals
// ============================================================

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart, MapPin, Utensils, Users, Mail, Instagram, Globe, Leaf, ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import { OrganizationJsonLd, FAQPageJsonLd } from "@/components/JsonLd";

const values = [
  {
    icon: <Utensils className="w-6 h-6" />,
    title: "Kvalitní obsah",
    text: "Každou restauraci osobně prověřujeme. Nezveřejňujeme neověřené informace — naše recenze a popisy vycházejí z reálných návštěv a zpětné vazby komunity.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Láska k jídlu",
    text: "Věříme, že bezmasá kuchyně může být stejně bohatá a chutná jako jakákoliv jiná. Naším cílem je ukázat, že vegan a vegetarián neznamená kompromis.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Komunita",
    text: "Budujeme prostor, kde se potkávají milovníci rostlinné stravy — od zkušených veganů po zvědavé flexitariány. Každý hlas je důležitý.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Udržitelnost",
    text: "Podporujeme restaurace, které myslí na planetu. Lokální suroviny, zero-waste přístup a etické podnikání jsou pro nás klíčové hodnoty.",
  },
];

const milestones = [
  { year: "2025", event: "Založení projektu bezmasajidla.cz" },
  { year: "2025", event: "Spuštění Instagram @bezmasajidla" },
  { year: "2026", event: "Launch webové platformy s 28+ restauracemi" },
  { year: "2026", event: "Cíl: 100+ restaurací a 50+ receptů" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEOHead
        title="O nás — Bezmasá Jídla"
        description="Jsme největší český adresář veganských a vegetariánských restaurací v Praze. Naším cílem je usnadnit lidem cestu k bezmasému stravování."
        ogUrl="https://www.bezmasajidla.cz/o-nas"
      />
      <OrganizationJsonLd />
      <FAQPageJsonLd faqs={[
        { question: "Jak přidat svou restauraci na bezmasajidla.cz?", answer: "Kontaktujte nás na info@bezmasajidla.cz s názvem, adresou a popisem vaší restaurace. Základní profil je zdarma. Prémiový profil s rozšířenými funkcemi je k dispozici za měsíční poplatek." },
        { question: "Co znamená označení 'vegan-friendly'?", answer: "Vegan-friendly restaurace nabízejí alespoň několik veganských pokrmů, i když nejsou výhradně veganské. Mohou podávat i masová jídla, ale vždy mají kvalitní bezmasé alternativy." },
        { question: "Jsou všechny restaurace v adresáři osobně ověřeny?", answer: "Ano, každou restauraci v našem adresáři jsme osobně navštívili nebo ověřili na základě zpětné vazby komunity. Usilujeme o aktuální a přesné informace." },
        { question: "Jak funguje hodnocení restaurací?", answer: "Celkové hodnocení (1–5 hvězdiček) vychází z uživatelských recenzí a naší editorské analýzy. Editorské skóre (1–10) hodnotí kuchyni, poměr ceny a kvality, atmosféru a obsluhu." },
        { question: "Mohu na webu najít i recepty?", answer: "Ano, sekce VEG Recepty obsahuje desítky vegetariánských a veganských receptů s makro živinami, dobou přípravy a fotografiemi. Recepty lze filtrovat podle kategorie, obtížnosti a dietních preferencí." },
        { question: "Jak se mohu dostat do restaurace přes Wolt?", answer: "U restaurací, které nabízejí rozvoz přes Wolt, najdete přímý odkaz na jejich Wolt stránku přímo na detailu restaurace." },
        { question: "Jsou na webu i fastfoodové řetězce?", answer: "Ano, v sekci Fastfoodové řetězce najdete přehled vegetariánských a veganských možností v populárních fastfoodech jako McDonald's, KFC nebo Burger King." },
        { question: "Jak mohu inzerovat na bezmasajidla.cz?", answer: "Nabízíme různé formáty inzerce — od bannerů přes sponzorované profily restaurací až po newsletter. Pro více informací a ceník navštivte stránku /inzerce nebo nás kontaktujte na info@bezmasajidla.cz." },
      ]} />
      <Header />

      {/* Hero */}
      <section className="relative bg-emerald-800 py-20 sm:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 40%)",
          }} />
        </div>
        <div className="container relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-5 h-5 text-emerald-300" />
              <span className="text-emerald-300 text-sm font-medium tracking-wide uppercase">O nás</span>
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Průvodce bezmasou Prahou
            </h1>
            <p className="text-lg text-emerald-100 leading-relaxed max-w-2xl">
              Jsme tým nadšenců do rostlinné kuchyně, kteří věří, že Praha si zaslouží
              vlastní komplexní průvodce veganskými a vegetariánskými restauracemi.
              Bez reklam, bez kompromisů — jen poctivé recenze a tipy.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-3xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Náš příběh
            </h2>
            <div className="prose prose-lg text-gray-600 space-y-4">
              <p>
                Všechno to začalo frustrací. Jako milovníci rostlinné kuchyně jsme v Praze
                neustále hledali nová místa k jídlu — a zjistili jsme, že neexistuje žádný
                spolehlivý český zdroj, který by je všechna shromáždil na jednom místě.
              </p>
              <p>
                HappyCow je skvělý, ale je v angličtině a zaměřený na turisty. České food
                portály zase nemají specializovanou sekci pro bezmasá jídla. A tak vznikl
                nápad na <strong>bezmasajidla.cz</strong> — platformu vytvořenou Čechy pro Čechy,
                s důrazem na lokální kontext, české recenze a reálné zkušenosti.
              </p>
              <p>
                Naším cílem je zmapovat <strong>každou veganskou a vegetariánskou restauraci
                  v Praze</strong> — od zavedených podniků jako Lehká Hlava a Maitrea, přes
                moderní bistro koncepty jako Palo Verde a Chutnej, až po skryté poklady,
                o kterých ví jen místní.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20 bg-emerald-50/60">
        <div className="container">
          <h2
            className="text-3xl font-bold text-gray-900 mb-12 text-center"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Naše hodnoty
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 mb-4">
                  {v.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2
              className="text-3xl font-bold text-gray-900 mb-10 text-center"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Milníky projektu
            </h2>
            <div className="space-y-6">
              {milestones.map((m, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-emerald-600 rounded-full mt-1.5" />
                    {i < milestones.length - 1 && (
                      <div className="w-0.5 h-12 bg-emerald-200 mt-1" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                      {m.year}
                    </span>
                    <p className="text-gray-800 font-medium">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-16 sm:py-20 bg-emerald-800 text-white">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { num: "28+", label: "Restaurací v databázi" },
              { num: "6", label: "Receptů online" },
              { num: "10+", label: "Pražských čtvrtí" },
              { num: "100%", label: "Bezmasý obsah" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="text-3xl sm:text-4xl font-bold text-amber-400 mb-1"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  {s.num}
                </div>
                <div className="text-emerald-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="text-3xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Kontaktujte nás
            </h2>
            <p className="text-gray-600 mb-8">
              Máte tip na restauraci, kterou bychom měli přidat? Chcete spolupracovat?
              Nebo jste majitel restaurace a chcete aktualizovat svůj profil?
              Ozvěte se nám!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:info@bezmasajidla.cz"
                className="flex items-center gap-2 px-6 py-3 bg-emerald-700 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium shadow-sm"
              >
                <Mail className="w-4 h-4" />
                info@bezmasajidla.cz
              </a>
              <a
                href="https://instagram.com/bezmasajidla"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-800 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors font-medium"
              >
                <Instagram className="w-4 h-4" />
                @bezmasajidla
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA for restaurants */}
      <section className="py-16 sm:py-20 bg-amber-50 border-t border-amber-100">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <MapPin className="w-8 h-8 text-amber-600 mx-auto mb-4" />
            <h2
              className="text-2xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Jste majitel restaurace?
            </h2>
            <p className="text-gray-600 mb-6">
              Přidejte svou restauraci zdarma do naší databáze a oslovte tisíce
              milovníků rostlinné kuchyně v Praze. Premium profil nabízí zvýrazněnou
              pozici, fotogalerii a přímý odkaz na rezervaci.
            </p>
            <button
              onClick={() => {
                toast("Funkce brzy k dispozici", {
                  description: "Registrace restaurací bude spuštěna v další verzi.",
                });
              }}
              className="px-8 py-3 bg-emerald-700 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium shadow-sm"
            >
              Přidat restauraci zdarma
            </button>
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ── */}
      <section className="py-16 bg-[#F8FAF6]">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">Časté dotazy</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Máte otázky?
            </h2>
            <p className="text-gray-500 mt-2 text-sm">Nejčastější dotazy od návštěvníků a restauratérů.</p>
          </div>
          <FAQAccordion />
        </div>
      </section>

      <Footer />
    </div>
  );
}

const FAQ_ITEMS = [
  {
    question: "Jak přidat svou restauraci na bezmasajidla.cz?",
    answer: "Kontaktujte nás na info@bezmasajidla.cz s názvem, adresou a popisem vaší restaurace. Základní profil je zdarma. Prémiový profil s rozšířenými funkcemi je k dispozici za měsíční poplatek.",
  },
  {
    question: "Co znamená označení 'vegan-friendly'?",
    answer: "Vegan-friendly restaurace nabízejí alespoň několik veganských pokrmů, i když nejsou výhradně veganské. Mohou podávat i masová jídla, ale vždy mají kvalitní bezmasé alternativy.",
  },
  {
    question: "Jsou všechny restaurace v adresáři osobně ověřeny?",
    answer: "Ano, každou restauraci v našem adresáři jsme osobně navštívili nebo ověřili na základě zpětné vazby komunity. Usilujeme o aktuální a přesné informace.",
  },
  {
    question: "Jak funguje hodnocení restaurací?",
    answer: "Celkové hodnocení (1–5 hvězdiček) vychází z uživatelských recenzí a naší editorské analýzy. Editorské skóre (1–10) hodnotí kuchyni, poměr ceny a kvality, atmosféru a obsluhu.",
  },
  {
    question: "Mohu na webu najít i recepty?",
    answer: "Ano, sekce VEG Recepty obsahuje desítky vegetariánských a veganských receptů s makro živinami, dobou přípravy a fotografiemi. Recepty lze filtrovat podle kategorie, obtížnosti a dietních preferencí.",
  },
  {
    question: "Jak se mohu dostat do restaurace přes Wolt?",
    answer: "U restaurací, které nabízejí rozvoz přes Wolt, najdete přímý odkaz na jejich Wolt stránku přímo na detailu restaurace.",
  },
  {
    question: "Jsou na webu i fastfoodové řetězce?",
    answer: "Ano, v sekci Fastfoodové řetězce najdete přehled vegetariánských a veganských možností v populárních fastfoodech jako McDonald's, KFC nebo Burger King.",
  },
  {
    question: "Jak mohu inzerovat na bezmasajidla.cz?",
    answer: "Nabízíme různé formáty inzerce — od bannerů přes sponzorované profily restaurací až po newsletter. Pro více informací navštivte stránku /inzerce nebo nás kontaktujte na info@bezmasajidla.cz.",
  },
];

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
      {FAQ_ITEMS.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-emerald-50 transition-colors group"
            aria-expanded={openIndex === i}
          >
            <span className="font-medium text-gray-900 group-hover:text-emerald-700 transition-colors pr-4">
              {item.question}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-emerald-600 flex-shrink-0 transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""
                }`}
            />
          </button>
          {openIndex === i && (
            <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 bg-emerald-50/30">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
