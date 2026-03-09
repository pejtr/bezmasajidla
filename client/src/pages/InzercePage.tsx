// ============================================================
// BEZMASAJIDLA.CZ — Inzerce (Advertising) Page
// "Zelená Metropole" design system
// ============================================================

import { useState } from "react";
import { Mail, BarChart2, Users, TrendingUp, Star, CheckCircle, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { WebsiteJsonLd } from "@/components/JsonLd";

const adFormats = [
  {
    icon: "🖼️",
    title: "Display Banner",
    sizes: ["728×90 (Leaderboard)", "300×250 (Rectangle)", "160×600 (Skyscraper)"],
    description:
      "Grafický banner umístěný na klíčových stránkách webu — homepage, seznam restaurací, detail restaurace. Ideální pro zvýšení povědomí o značce.",
    placements: ["Homepage hero sekce", "Stránka restaurací", "Detail restaurace"],
    cta: "Vyžádat ceník",
  },
  {
    icon: "🏆",
    title: "Sponzorovaný profil restaurace",
    sizes: ["TOP pozice v seznamu", "Zvýrazněná karta", "Badge 'Doporučujeme'"],
    description:
      "Váš podnik se zobrazí na předních místech v seznamu restaurací s výrazným vizuálním odlišením. Zahrnuje rozšířený profil s fotogalerií, menu a speciálními nabídkami.",
    placements: ["Top 3 pozice v seznamu", "Zvýraznění v mapě", "Sekce 'Doporučujeme' na homepage"],
    cta: "Vyžádat ceník",
  },
  {
    icon: "📧",
    title: "Newsletter",
    sizes: ["Exkluzivní sponzoring", "Bannery v obsahu", "Zmínka v editoriálu"],
    description:
      "Oslovte naše odběratele přímo v jejich e-mailové schránce. Newsletter posíláme pravidelně s tipy na restaurace, recepty a novinkami ze světa rostlinné stravy.",
    placements: ["Hlavní sponzoring vydání", "Banner v obsahu", "Doporučení v textu"],
    cta: "Vyžádat ceník",
  },
  {
    icon: "📱",
    title: "Sociální sítě",
    sizes: ["Instagram post", "Instagram Stories", "Facebook post"],
    description:
      "Autentický obsah sdílený na našich sociálních sítích. Organický dosah doplněný placenou propagací pro maximální viditelnost u cílové skupiny.",
    placements: ["Instagram @bezmasajidla", "Facebook Bezmasá Jídla", "Placenou propagací"],
    cta: "Vyžádat ceník",
  },
  {
    icon: "✍️",
    title: "Sponzorovaný článek",
    sizes: ["Recenze restaurace", "Průvodce kuchyní", "Rozhovor s šéfkuchařem"],
    description:
      "Editorsky zpracovaný článek nebo recenze napsaná naším týmem. Přirozené začlenění do obsahu webu s trvalým umístěním a SEO hodnotou.",
    placements: ["Sekce Blog", "Průvodci", "Recepty"],
    cta: "Vyžádat ceník",
  },
  {
    icon: "🗺️",
    title: "Zvýraznění na mapě",
    sizes: ["PIN s logem", "Prioritní zobrazení", "Popup s akcí"],
    description:
      "Vaše restaurace se zobrazí s výrazným označením na interaktivní mapě Prahy. Uživatelé hledající restaurace v okolí vás okamžitě uvidí.",
    placements: ["Interaktivní mapa Prahy", "Vyhledávání v okolí", "Mobilní zobrazení"],
    cta: "Vyžádat ceník",
  },
];

const stats = [
  { value: "15 000+", label: "Měsíčních návštěvníků", icon: Users },
  { value: "85%", label: "Organická návštěvnost", icon: TrendingUp },
  { value: "4.2 min", label: "Průměrná doba na webu", icon: BarChart2 },
  { value: "4.8/5", label: "Hodnocení obsahu", icon: Star },
];

const audience = [
  "Lidé přecházející na rostlinnou stravu (18–45 let)",
  "Aktivní vegané a vegetariáni v Praze",
  "Zdravě se stravující profesionálové",
  "Turisté hledající bezmasé restaurace v Praze",
  "Rodiče hledající zdravé možnosti pro rodinu",
  "Fitness a wellness komunita",
];

export default function InzercePage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "", format: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Open mailto with pre-filled content
    const subject = encodeURIComponent(`Poptávka inzerce — ${form.format || "obecná"} — ${form.company}`);
    const body = encodeURIComponent(
      `Jméno: ${form.name}\nE-mail: ${form.email}\nSpolečnost: ${form.company}\nZájem o: ${form.format}\n\n${form.message}`
    );
    window.location.href = `mailto:inzerce@bezmasajidla.cz?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <WebsiteJsonLd />
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900 to-emerald-800 py-16">
        <div className="container text-center">
          <span className="inline-block bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
            Reklama
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Inzerujte na Bezmasájídla.cz
          </h1>
          <p className="text-emerald-200 text-lg max-w-2xl mx-auto mb-8">
            Oslovte tisíce návštěvníků hledajících veganské a vegetariánské restaurace v Praze. Vaše značka tam, kde jsou vaši zákazníci.
          </p>
          <a
            href="#kontakt"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-amber-900 font-semibold px-8 py-3 rounded-xl shadow-lg transition-colors"
          >
            <Mail className="w-4 h-4" />
            Nezávazně se zeptat
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-emerald-800 py-6">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div
                  className="text-2xl font-bold text-amber-400"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  {s.value}
                </div>
                <div className="text-xs text-emerald-300 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Formats */}
      <section className="py-14 container">
        <div className="text-center mb-10">
          <h2
            className="text-3xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Možnosti inzerce
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Nabízíme různé formáty přizpůsobené vašim cílům a rozpočtu. Ceny sdělíme na vyžádání.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adFormats.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-xl border border-emerald-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3
                className="text-lg font-bold text-gray-900 mb-2"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{f.description}</p>

              <div className="mb-4">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">Formáty / Umístění</p>
                <ul className="space-y-1">
                  {f.placements.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#kontakt"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                {f.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-12 bg-emerald-50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Naše publikum</span>
              <h2
                className="text-3xl font-bold text-gray-900 mt-1 mb-4"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Kdo jsou naši čtenáři?
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Bezmasájídla.cz navštěvují lidé, kteří aktivně hledají kvalitní bezmasé stravování v Praze. Jde o angažovanou, kupní sílu mající skupinu s jasným záměrem — najít dobré místo k jídlu nebo recept k vaření.
              </p>
              <ul className="space-y-2">
                {audience.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-emerald-100 shadow-sm">
              <h3
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Proč inzerovat u nás?
              </h3>
              <div className="space-y-4">
                {[
                  { title: "Cílená audience", desc: "Oslovíte přesně lidi, kteří hledají vaše produkty nebo služby." },
                  { title: "Vysoká angažovanost", desc: "Průměrná doba na webu 4+ minuty — čtenáři skutečně čtou obsah." },
                  { title: "SEO hodnota", desc: "Sponzorované články přinášejí trvalé zpětné odkazy a organický dosah." },
                  { title: "Flexibilita", desc: "Přizpůsobíme formát a délku spolupráce vašim potřebám a rozpočtu." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="kontakt" className="py-14 container">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2
              className="text-3xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Nezávazná poptávka
            </h2>
            <p className="text-gray-500">
              Napište nám a do 2 pracovních dnů vám zašleme ceník a možnosti spolupráce.
            </p>
          </div>

          {sent ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-emerald-800 mb-1">Zpráva odeslána!</h3>
              <p className="text-emerald-600 text-sm">Otevřel se váš e-mailový klient s předvyplněnou zprávou. Ozveme se do 2 pracovních dnů.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-emerald-100 p-8 space-y-4 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Jméno *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Jan Novák"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">E-mail *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="jan@firma.cz"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Firma / Restaurace</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Název firmy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Zájem o formát</label>
                  <select
                    value={form.format}
                    onChange={(e) => setForm({ ...form, format: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                  >
                    <option value="">Vyberte formát…</option>
                    <option value="Display Banner">Display Banner</option>
                    <option value="Sponzorovaný profil restaurace">Sponzorovaný profil restaurace</option>
                    <option value="Newsletter">Newsletter</option>
                    <option value="Sociální sítě">Sociální sítě</option>
                    <option value="Sponzorovaný článek">Sponzorovaný článek</option>
                    <option value="Zvýraznění na mapě">Zvýraznění na mapě</option>
                    <option value="Více formátů / nevím">Více formátů / nevím</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Zpráva</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                  placeholder="Popište váš záměr, cílovou skupinu nebo dotazy…"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Odeslat poptávku
              </Button>
              <p className="text-xs text-gray-400 text-center">
                Nebo nás kontaktujte přímo na{" "}
                <a href="mailto:inzerce@bezmasajidla.cz" className="text-emerald-600 hover:underline">
                  inzerce@bezmasajidla.cz
                </a>
              </p>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
