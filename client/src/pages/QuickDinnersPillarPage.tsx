import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { recipes } from "@/lib/data";
import SEOHead from "@/components/SEOHead";
import { ChevronRight, Clock, Sparkles } from "lucide-react";
import { RecipeListJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export default function QuickDinnersPillarPage() {
  const quickRecipes = recipes.filter(r => r.prepTime + r.cookTime <= 25);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <SEOHead
        title="Rychlé bezmasé večeře do 20 minut | Bezmasá Jídla"
        description="Ověřené vegetariánské a veganské recepty na rychlou večeři do 20 minut. Těstoviny, stir-fry, rychlé polévky i asijská jídla z dostupných surovin."
        canonicalUrl="https://www.bezmasajidla.cz/recepty/rychle-bezmase-vecere"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Domů", url: "/" },
          { name: "Recepty", url: "/recepty" },
          { name: "Rychlé večeře", url: "/recepty/rychle-bezmase-vecere" },
        ]}
      />
      <RecipeListJsonLd recipes={quickRecipes} />
      <Header />

      {/* Hero Section */}
      <section className="bg-emerald-900 text-white py-14">
        <div className="container max-w-4xl">
          <nav className="text-xs text-emerald-300 font-medium tracking-wide mb-5 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">
              Domů
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/recepty" className="hover:text-white transition-colors">
              Recepty
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Rychlé večeře</span>
          </nav>

          <div className="flex items-center gap-2 mb-3">
            <span className="bg-emerald-800 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-700">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Do 20-25 minut
            </span>
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold mb-5"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Rychlé bezmasé večeře <span className="text-amber-400">do 20 minut</span>
          </h1>

          <p className="text-emerald-100 text-lg leading-relaxed mb-6 max-w-2xl">
            Vracíte se z práce nebo školy a nechcete trávit hodiny u plotny? Vybrali jsme pro vás nejrychlejší vegetariánské a veganské recepty, které zvládnete bleskově a z běžných surovin.
          </p>
        </div>
      </section>

      <section className="py-12 container">
        <div className="flex justify-between items-end mb-8 border-b border-emerald-100 pb-4">
          <h2
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Recepty do 20 minut
          </h2>
          <span className="text-sm text-gray-500 font-medium">
            Nalezeno {quickRecipes.length} receptů
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickRecipes.map(r => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>

        {/* SEO / Guide Section */}
        <div className="mt-16 bg-white border border-emerald-100 rounded-3xl p-8 lg:p-12 prose prose-emerald max-w-none">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Tipy na bleskovou bezmasou večeři
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Rychlá večeře nemusí znamenat polotovar. S několika základními ingrediencemi v lednici a spíži připravíte během 15 minut plnohodnotné jídlo bohaté na bílkoviny i vlákninu.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">1. Asijské stir-fry s tofu a zeleninou</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Rýžové nebo pšeničné nudle zalijte vroucí vodou. Na pánvi prudce osmahněte nakrájené tofu, brokolici, mrkev a pórek. Přidejte trochu sójové omáčky a sezamu a smíchejte s nudlemi. Hotovo za 12 minut.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">2. Krémové gnocchi nebo těstoviny</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Kupované bramborové gnocchi se vaří jen 3 minuty. Na pánvi rozehřejte pár lžic bazalkového pesta nebo rostlinné smetany se sušenými rajčaty, smíchejte a posypte parmazánem či lahůdkovým droždím.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">3. Cizrnový salát nebo bleskový hummus</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Konzervovaná cizrna nevyžaduje žádné vaření. Propláchněte ji, smíchejte s nakrájenou okurkou, rajčaty, olivovým olejem a feta sýrem (nebo tofu feta) pro lehký a osvěžující večerní salát.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
