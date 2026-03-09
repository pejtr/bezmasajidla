// ============================================================
// BEZMASAJIDLA.CZ — Podmínky použití (Terms of Use)
// ============================================================

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "1. Úvodní ustanovení",
    content: `Tyto podmínky použití (dále jen „Podmínky") upravují pravidla pro používání webové stránky Bezmasájídla.cz (dále jen „Web"), provozované společností Bezmasájídla.cz. Používáním Webu souhlasíte s těmito Podmínkami v plném rozsahu. Pokud s Podmínkami nesouhlasíte, prosíme, Web nepoužívejte.`,
  },
  {
    title: "2. Popis služby",
    content: `Bezmasájídla.cz je informační portál zaměřený na veganské a vegetariánské restaurace v Praze. Web poskytuje přehledy restaurací, recepty, průvodce a editorské recenze. Informace na Webu mají pouze informativní charakter a nezakládají žádný smluvní vztah mezi provozovatelem a uživatelem.`,
  },
  {
    title: "3. Přístup k webu",
    content: `Web je přístupný zdarma bez nutnosti registrace. Provozovatel si vyhrazuje právo omezit přístup k Webu nebo jeho části bez předchozího upozornění, a to zejména z důvodu technické údržby, bezpečnosti nebo porušení těchto Podmínek ze strany uživatele.`,
  },
  {
    title: "4. Autorská práva a duševní vlastnictví",
    content: `Veškerý obsah Webu, včetně textů, fotografií, grafiky, log a databází restaurací, je chráněn autorským právem a je výhradním vlastnictvím provozovatele nebo příslušných třetích stran. Bez předchozího písemného souhlasu provozovatele není dovoleno obsah Webu kopírovat, šířit, upravovat ani jinak komerčně využívat. Citace a sdílení obsahu pro nekomerční účely je povoleno za podmínky uvedení zdroje s odkazem na Bezmasájídla.cz.`,
  },
  {
    title: "5. Uživatelský obsah",
    content: `Uživatelé mohou na Webu přidávat recenze, hodnocení a komentáře. Přidáním obsahu uživatel prohlašuje, že je oprávněn jej zveřejnit a uděluje provozovateli nevýhradní licenci k jeho použití. Provozovatel si vyhrazuje právo bez udání důvodu odstranit jakýkoliv uživatelský obsah, který je v rozporu s těmito Podmínkami, dobrými mravy nebo platným právem.`,
  },
  {
    title: "6. Přesnost informací",
    content: `Provozovatel vynakládá přiměřené úsilí k zajištění přesnosti a aktuálnosti informací na Webu. Přesto nelze zaručit úplnost, přesnost ani aktuálnost veškerých informací, zejména otevírací doby, menu a cen restaurací. Provozovatel nenese odpovědnost za škody vzniklé v důsledku spoléhání se na informace zveřejněné na Webu.`,
  },
  {
    title: "7. Odkazy na třetí strany",
    content: `Web může obsahovat odkazy na webové stránky třetích stran. Tyto stránky nejsou pod kontrolou provozovatele a provozovatel nenese odpovědnost za jejich obsah, dostupnost ani zásady ochrany soukromí. Zařazení odkazu neznamená doporučení ani schválení odkazované stránky.`,
  },
  {
    title: "8. Inzerce a sponzorovaný obsah",
    content: `Web může obsahovat placené reklamní sdělení a sponzorovaný obsah. Veškerý sponzorovaný obsah je řádně označen. Provozovatel odpovídá za obsah reklamy pouze v rozsahu stanoveném zákonem. Bližší informace o možnostech inzerce naleznete na stránce /inzerce.`,
  },
  {
    title: "9. Omezení odpovědnosti",
    content: `Web je poskytován „tak jak je" bez jakýchkoliv záruk. Provozovatel nenese odpovědnost za přímé ani nepřímé škody vzniklé v souvislosti s používáním Webu, včetně ztráty dat, ušlého zisku nebo škod způsobených výpadkem Webu. Celková odpovědnost provozovatele vůči uživateli je omezena na částku 0 Kč, pokud nebylo dohodnuto jinak.`,
  },
  {
    title: "10. Změny podmínek",
    content: `Provozovatel si vyhrazuje právo tyto Podmínky kdykoliv změnit. Změny nabývají účinnosti zveřejněním na Webu. Pokračováním v používání Webu po zveřejnění změn vyjadřujete souhlas s aktualizovanými Podmínkami. Doporučujeme pravidelně kontrolovat tuto stránku.`,
  },
  {
    title: "11. Rozhodné právo a řešení sporů",
    content: `Tyto Podmínky se řídí právním řádem České republiky. Veškeré spory vzniklé v souvislosti s těmito Podmínkami budou řešeny příslušnými soudy České republiky. Spotřebitelé mají právo na mimosoudní řešení sporů prostřednictvím České obchodní inspekce (www.coi.cz).`,
  },
  {
    title: "12. Kontakt",
    content: `V případě dotazů k těmto Podmínkám nás kontaktujte na e-mailové adrese: info@bezmasajidla.cz`,
  },
];

export default function PodminkyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <Header />

      <section className="bg-emerald-900 py-12">
        <div className="container text-center">
          <h1
            className="text-4xl font-bold text-white mb-2"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Podmínky použití
          </h1>
          <p className="text-emerald-300 text-sm">Platné od 1. ledna 2026 · Bezmasájídla.cz</p>
        </div>
      </section>

      <section className="py-12 container">
        <div className="max-w-3xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
            Přečtěte si prosím tyto podmínky před použitím webu. Používáním Bezmasájídla.cz souhlasíte s níže uvedenými pravidly.
          </div>

          <div className="space-y-8">
            {sections.map((s) => (
              <div key={s.title}>
                <h2
                  className="text-xl font-bold text-emerald-900 mb-3"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  {s.title}
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm">{s.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-gray-200 text-xs text-gray-400 text-center">
            Poslední aktualizace: 1. ledna 2026 · Dotazy: <a href="mailto:info@bezmasajidla.cz" className="text-emerald-600 hover:underline">info@bezmasajidla.cz</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
