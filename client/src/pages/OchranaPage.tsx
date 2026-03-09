// ============================================================
// BEZMASAJIDLA.CZ — Ochrana soukromí (Privacy Policy / GDPR)
// ============================================================

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "1. Správce osobních údajů",
    content: `Správcem osobních údajů ve smyslu Nařízení Evropského parlamentu a Rady (EU) 2016/679 (GDPR) je provozovatel webu Bezmasájídla.cz. Kontaktní e-mail: info@bezmasajidla.cz`,
  },
  {
    title: "2. Jaké osobní údaje zpracováváme",
    content: `Zpracováváme pouze ty osobní údaje, které nám sami poskytnete nebo které jsou nezbytné pro provoz webu. Jde zejména o: e-mailovou adresu (při přihlášení k newsletteru nebo registraci), jméno a kontaktní údaje (při vyplnění kontaktního formuláře), IP adresu a technické údaje o prohlížeči (prostřednictvím analytických nástrojů), a preference a oblíbené položky (při přihlášení k uživatelskému účtu).`,
  },
  {
    title: "3. Účel a právní základ zpracování",
    content: `Vaše osobní údaje zpracováváme pro následující účely: provoz a zlepšování webu (oprávněný zájem), zasílání newsletteru (souhlas), odpovědi na dotazy a poptávky (plnění smlouvy nebo oprávněný zájem), analytika návštěvnosti (oprávněný zájem), a zobrazování relevantní reklamy (souhlas). Souhlas se zpracováním osobních údajů můžete kdykoliv odvolat.`,
  },
  {
    title: "4. Cookies a analytika",
    content: `Web používá soubory cookies pro zajištění funkčnosti, analýzu návštěvnosti a personalizaci obsahu. Používáme analytické nástroje (Google Analytics) pro sledování anonymizovaných statistik návštěvnosti. Technické cookies jsou nezbytné pro fungování webu a nelze je vypnout. Analytické a marketingové cookies lze spravovat v nastavení prohlížeče nebo prostřednictvím naší cookie lišty.`,
  },
  {
    title: "5. Příjemci osobních údajů",
    content: `Vaše osobní údaje neprodáváme třetím stranám. Sdílíme je pouze s důvěryhodnými poskytovateli služeb nezbytných pro provoz webu (hosting, analytika, e-mailový marketing), kteří jsou vázáni smlouvou o zpracování osobních údajů a nemohou je použít pro jiné účely.`,
  },
  {
    title: "6. Doba uchovávání údajů",
    content: `Osobní údaje uchováváme po dobu nezbytně nutnou pro splnění účelu zpracování, nebo po dobu stanovenou právními předpisy. E-mailové adresy pro newsletter uchováváme do odhlášení. Analytická data jsou anonymizována a uchovávána po dobu 26 měsíců.`,
  },
  {
    title: "7. Vaše práva",
    content: `Jako subjekt osobních údajů máte právo na: přístup k osobním údajům (vědět, jaké údaje o vás zpracováváme), opravu nepřesných údajů, výmaz údajů („právo být zapomenut"), omezení zpracování, přenositelnost údajů, námitku proti zpracování, a odvolání souhlasu. Pro uplatnění těchto práv nás kontaktujte na info@bezmasajidla.cz. Na vaši žádost odpovíme do 30 dnů.`,
  },
  {
    title: "8. Zabezpečení osobních údajů",
    content: `Přijímáme technická a organizační opatření k ochraně vašich osobních údajů před neoprávněným přístupem, ztrátou nebo zničením. Web používá šifrované připojení HTTPS. Přístup k osobním údajům mají pouze oprávněné osoby.`,
  },
  {
    title: "9. Přenos dat mimo EU",
    content: `Některé nástroje, které používáme (např. Google Analytics), mohou přenášet data do USA. Tyto přenosy probíhají na základě standardních smluvních doložek schválených Evropskou komisí nebo jiných vhodných záruk v souladu s GDPR.`,
  },
  {
    title: "10. Stížnosti",
    content: `Pokud se domníváte, že zpracování vašich osobních údajů porušuje GDPR, máte právo podat stížnost u dozorového úřadu — Úřadu pro ochranu osobních údajů (ÚOOÚ), Pplk. Sochora 27, 170 00 Praha 7, www.uoou.cz.`,
  },
  {
    title: "11. Změny zásad ochrany soukromí",
    content: `Tyto zásady ochrany soukromí můžeme průběžně aktualizovat. O podstatných změnách vás budeme informovat prostřednictvím webu nebo e-mailem. Doporučujeme pravidelně kontrolovat tuto stránku.`,
  },
];

export default function OchranaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <Header />

      <section className="bg-emerald-900 py-12">
        <div className="container text-center">
          <h1
            className="text-4xl font-bold text-white mb-2"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Ochrana soukromí
          </h1>
          <p className="text-emerald-300 text-sm">Zásady zpracování osobních údajů (GDPR) · Platné od 1. ledna 2026</p>
        </div>
      </section>

      <section className="py-12 container">
        <div className="max-w-3xl mx-auto">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8 text-sm text-emerald-800">
            Vaše soukromí je pro nás důležité. Tyto zásady vysvětlují, jaké osobní údaje shromažďujeme, jak je používáme a jaká máte práva.
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
