// ============================================================
// BEZMASAJIDLA.CZ — Ingredient Cluster Pillar Page Component
// High-authority recipe cluster landing page for key plant-based ingredients.
// ============================================================

import { recipes, type Recipe } from "@/lib/data";
import { Link } from "wouter";
import RecipeCard from "@/components/RecipeCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { ShoppingCart, Flame, Sparkles, ChefHat, ExternalLink, Leaf } from "lucide-react";

interface IngredientPillarProps {
  ingredientKey: "tofu" | "cizrna" | "cocka" | "kvetak" | "tempeh";
  title: string;
  subtitle: string;
  seoTitle: string;
  seoDescription: string;
  ingredientLabel: string;
  matchFilter: (r: Recipe) => boolean;
  nutritionFacts: {
    avgProtein: string;
    avgPrice: string;
    prepDifficulty: string;
  };
  buyingGuide: {
    title: string;
    tips: string[];
    partnerStore: string;
    partnerUrl: string;
  };
}

const INGREDIENT_CONFIGS: Record<IngredientPillarProps["ingredientKey"], Omit<IngredientPillarProps, "ingredientKey">> = {
  tofu: {
    ingredientLabel: "Tofu",
    title: "Nejlepší recepty z tofu: Výživné, křupavé a jednoduché",
    subtitle: "Průvodce vařením s tofu. Jak marinovat, opékat a připravit tofu s vysokým obsahem bílkovin.",
    seoTitle: "Nejlepší recepty z tofu | Rychlá jídla s vysokým obsahem bílkovin",
    seoDescription: "Objevte ověřené vegetariánské a veganské recepty z tofu. Křupavé tofu, curry, asijské soté i pomazánky s přepočtem bílkovin a ceny porce.",
    matchFilter: r => r.title.toLowerCase().includes("tofu") || r.tags.some(t => t.toLowerCase().includes("tofu")) || r.description.toLowerCase().includes("tofu"),
    nutritionFacts: {
      avgProtein: "16–22 g / porce",
      avgPrice: "32 Kč / porce",
      prepDifficulty: "Snadná (15–25 min)",
    },
    buyingGuide: {
      title: "Jak vybrat a kde koupit nejlepší tofu?",
      tips: [
        "Pro opékání a stir-fry volte extra tvrdé natural tofu (např. Lunter nebo Sunfood).",
        "Silken (hedvábné) tofu je ideální do krémových omáček, dezertů a veganské míchané 'vajíčkové' snídaně.",
        "Uzené tofu dodá polévkám a omáčkám hlubokou uzenou chuť i bez marinování.",
      ],
      partnerStore: "Ekočlověk BIO Potraviny",
      partnerUrl: "https://www.ekoclovek.cz/?utm_source=bezmasajidla&utm_medium=tofu_cluster",
    },
  },
  cizrna: {
    ingredientLabel: "Cizrna",
    title: "Ověřené recepty z cizrny: Od krémového hummusu po pečenou cizrnu",
    subtitle: "Rostlinná superpotravina plná vlákniny a minerálů. Recepty na kari, saláty i poctivé polévky.",
    seoTitle: "Recepty z cizrny | Hummus, kari a pečená cizrna bez masa",
    seoDescription: "Nejlepší bezmasé recepty z cizrny. Krémový hummus, indické chana masala, cizrnové karbanátky i křupavá pečená cizrna jako snack.",
    matchFilter: r => r.title.toLowerCase().includes("cizrn") || r.tags.some(t => t.toLowerCase().includes("cizrn")) || r.description.toLowerCase().includes("cizrn"),
    nutritionFacts: {
      avgProtein: "14–19 g / porce",
      avgPrice: "24 Kč / porce",
      prepDifficulty: "Velmi snadná (10–20 min)",
    },
    buyingGuide: {
      title: "Tipy pro nákup a přípravu cizrny",
      tips: [
        "Vařená cizrna ve skle nebo plechu ušetří 12 hodin namáčení a je připravena k okamžitému použití.",
        "Nezahazujte nálev z cizrny (Aquafaba) — lze z ní ušlehat dokonalý veganský sníh na dezerty.",
        "Sušená BIO cizrna po namočení a uvaření s špetkou jedlé sody vytvoří ten nejkrémovější hummus.",
      ],
      partnerStore: "Ekočlověk BIO Cizrna & Tahini",
      partnerUrl: "https://www.ekoclovek.cz/?utm_source=bezmasajidla&utm_medium=cizrna_cluster",
    },
  },
  cocka: {
    ingredientLabel: "Čočka",
    title: "Poctivé čočkové recepty: Červená, černá Beluga i hnědá čočka",
    subtitle: "Vyvážený zdroj železa a bílkovin pro každý den. Polévky, omáčky, sekaná i rychlé saláty.",
    seoTitle: "Čočkové recepty bez masa | Červená, černá Beluga a indický dál",
    seoDescription: "Výživné recepty z čočky bez masa. Červená čočka za 15 minut, černá Beluga do salátů, klasický čočkový dál a polévky.",
    matchFilter: r => r.title.toLowerCase().includes("čočk") || r.title.toLowerCase().includes("cock") || r.tags.some(t => t.toLowerCase().includes("čočk") || t.toLowerCase().includes("cock")) || r.description.toLowerCase().includes("čočk"),
    nutritionFacts: {
      avgProtein: "18–25 g / porce",
      avgPrice: "22 Kč / porce",
      prepDifficulty: "Velmi rychlá (15 min)",
    },
    buyingGuide: {
      title: "Jakou čočku vybrat pro jaké jídlo?",
      tips: [
        "Červená loupaná čočka se vaří jen 10–12 minut bez namáčení a dokonale zahustí polévky a kari.",
        "Černá čočka Beluga drží pevný tvar a má jemnou oříškovou chuť — ideální do teplých salátů.",
        "Francouzská zelená čočka Puy má pevnou slupku a skvěle se hodí do bezmasých sekaných a ragú.",
      ],
      partnerStore: "Ekočlověk BIO Luštěniny",
      partnerUrl: "https://www.ekoclovek.cz/?utm_source=bezmasajidla&utm_medium=cocka_cluster",
    },
  },
  kvetak: {
    ingredientLabel: "Květák",
    title: "Květák jinak: Pečený křídla, steak, rýže i krémové kari",
    subtitle: "Objevte všestrannost květáku v moderní bezmasé kuchyni.",
    seoTitle: "Květákové recepty | Pečený květák, buffalo křídla a kari",
    seoDescription: "Skvělé vegetariánské recepty z květáku. Pečený květákový steak, chrumkavá buffalo křidélka, květáková rýže a krémové polévky.",
    matchFilter: r => r.title.toLowerCase().includes("květák") || r.title.toLowerCase().includes("kvetak") || r.tags.some(t => t.toLowerCase().includes("květák") || t.toLowerCase().includes("kvetak")),
    nutritionFacts: {
      avgProtein: "8–14 g / porce",
      avgPrice: "28 Kč / porce",
      prepDifficulty: "Střední (25–35 min)",
    },
    buyingGuide: {
      title: "Květákový gastro tip",
      tips: [
        "Při pečení na vysokou teplotu (220 °C) s uzenou paprikou a římským kmínem získá květák masovou strukturu.",
        "Listy květáku nevyhazujte — nakrájené a opékané na olivovém oleji chutnají skvěle.",
      ],
      partnerStore: "Rohlík.cz Čerstvá Zelenina",
      partnerUrl: "https://www.rohlik.cz/?utm_source=bezmasajidla&utm_medium=kvetak_cluster",
    },
  },
  tempeh: {
    ingredientLabel: "Tempeh",
    title: "Gurmánské recepty z tempehu: Fermentovaný zázrak plný bílkovin",
    subtitle: "Uzený i smažený tempeh pro maximální chuti a zdravou střevní mikrobiotu.",
    seoTitle: "Recepty z tempehu | Uzený tempeh, stir-fry a bezmasá slanina",
    seoDescription: "Nejlepší recepty s tempehem. Uzený tempeh k těstovinám, smažený v marinádě i jako křupavá rostlinná 'slanina' s vysokým obsahem proteinu.",
    matchFilter: r => r.title.toLowerCase().includes("tempeh") || r.tags.some(t => t.toLowerCase().includes("tempeh")) || r.description.toLowerCase().includes("tempeh"),
    nutritionFacts: {
      avgProtein: "20–26 g / porce",
      avgPrice: "38 Kč / porce",
      prepDifficulty: "Snadná (15–20 min)",
    },
    buyingGuide: {
      title: "Proč zařadit tempeh do jídelníčku?",
      tips: [
        "Tempeh vzniká fermentací celých sójových bobů ušlechtilou plísní — díky tomu je extrémně stravitelný.",
        "Uzený tempeh z obchodu stačí nakrájet a nakrátko opéct na pánvi — má přirozeně výraznou slanou chuť.",
      ],
      partnerStore: "Ekočlověk BIO Tempeh",
      partnerUrl: "https://www.ekoclovek.cz/?utm_source=bezmasajidla&utm_medium=tempeh_cluster",
    },
  },
};

export default function IngredientPillarPage({ ingredientKey }: { ingredientKey: IngredientPillarProps["ingredientKey"] }) {
  const config = INGREDIENT_CONFIGS[ingredientKey];
  const matchedRecipes = recipes.filter(config.matchFilter);

  return (
    <div className="min-h-screen bg-[#F8FAF6] text-[#2C352E] flex flex-col font-sans">
      <SEOHead
        title={config.seoTitle}
        description={config.seoDescription}
        ogUrl={`https://www.bezmasajidla.cz/recepty/${ingredientKey}`}
      />
      <Header />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-[#EBF2E8] to-[#F8FAF6] pt-12 pb-16 border-b border-[#E1EADF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#4A7C59] uppercase tracking-wider mb-3">
            <Leaf className="w-4 h-4" />
            <span>Surovinový průvodce • {config.ingredientLabel}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1C2826] tracking-tight mb-4 max-w-4xl leading-tight">
            {config.title}
          </h1>

          <p className="text-lg text-[#5A685D] max-w-3xl leading-relaxed mb-8">
            {config.subtitle}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl bg-white p-4 rounded-2xl shadow-sm border border-[#E1EADF]">
            <div>
              <div className="text-xs text-[#7A887D] font-medium">Receptů v klastru</div>
              <div className="text-2xl font-bold text-[#1C2826] mt-0.5">{matchedRecipes.length}</div>
            </div>
            <div>
              <div className="text-xs text-[#7A887D] font-medium">Průměrný protein</div>
              <div className="text-2xl font-bold text-[#4A7C59] mt-0.5 flex items-center gap-1">
                {config.nutritionFacts.avgProtein}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#7A887D] font-medium">Odhadovaná cena</div>
              <div className="text-2xl font-bold text-[#1C2826] mt-0.5">
                {config.nutritionFacts.avgPrice}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#7A887D] font-medium">Náročnost</div>
              <div className="text-2xl font-bold text-[#4A7C59] mt-0.5 text-sm sm:text-base">
                {config.nutritionFacts.prepDifficulty}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Grid */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Shopping Guide Box with Affiliate Link */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 mb-12 shadow-sm border border-[#E1EADF]">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2 text-base font-bold text-[#1C2826]">
              <ChefHat className="w-5 h-5 text-[#4A7C59]" />
              <h2>{config.buyingGuide.title}</h2>
            </div>
            <a
              href={config.buyingGuide.partnerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#4A7C59] hover:text-[#3D6649] underline"
            >
              <ShoppingCart className="w-4 h-4" />
              Nakoupit ingredience na {config.buyingGuide.partnerStore}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <ul className="space-y-2.5 text-[#4A554D] text-sm sm:text-base mb-6">
            {config.buyingGuide.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-[#4A7C59] font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recipes Grid */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#1C2826] flex items-center gap-2">
            <Flame className="w-6 h-6 text-[#4A7C59]" />
            Vybrané recepty ({matchedRecipes.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {matchedRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {/* Cross-linking to Prague Restaurants */}
        <section className="bg-[#EBF2E8] rounded-3xl p-8 border border-[#D5E3D2]">
          <h3 className="text-xl font-bold text-[#1C2826] mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#4A7C59]" />
            Nechcete dnes vařit? Vyzkoušejte bezmasá bistra v Praze
          </h3>
          <p className="text-[#4A554D] mb-6">
            Objevil jsme nejlépe hodnocené vegetariánské a veganské restaurace rozdělené podle městských částí.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/restaurace/praha/vinohrady">
              <span className="px-4 py-2 bg-white rounded-xl text-sm font-semibold text-[#2C352E] hover:bg-[#4A7C59] hover:text-white transition-colors border border-[#D5E3D2] cursor-pointer">
                📍 Restaurace Vinohrady
              </span>
            </Link>
            <Link href="/restaurace/praha/karlin">
              <span className="px-4 py-2 bg-white rounded-xl text-sm font-semibold text-[#2C352E] hover:bg-[#4A7C59] hover:text-white transition-colors border border-[#D5E3D2] cursor-pointer">
                📍 Restaurace Karlín
              </span>
            </Link>
            <Link href="/restaurace/praha/smichov">
              <span className="px-4 py-2 bg-white rounded-xl text-sm font-semibold text-[#2C352E] hover:bg-[#4A7C59] hover:text-white transition-colors border border-[#D5E3D2] cursor-pointer">
                📍 Restaurace Smíchov
              </span>
            </Link>
            <Link href="/restaurace/praha/stare-mesto">
              <span className="px-4 py-2 bg-white rounded-xl text-sm font-semibold text-[#2C352E] hover:bg-[#4A7C59] hover:text-white transition-colors border border-[#D5E3D2] cursor-pointer">
                📍 Restaurace Staré Město
              </span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
