import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { recipes } from "@/lib/data";
import SEOHead from "@/components/SEOHead";
import { ChevronRight, WheatOff } from "lucide-react";
import { RecipeListJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export default function GlutenFreePillarPage() {
  const gfRecipes = recipes.filter(r => r.isGlutenFree || r.tags.some(t => t.toLowerCase().includes("bezlepkov")));

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <SEOHead
        title="Bezlepkové recepty bez masa | Veganské i vegetariánské"
        description="Zdravé a chutné bezlepkové recepty bez masa. Pohanka, jáhly, kuskus, quinoa, rýže i bezlepkové dezerty s ověřenými postupy."
        canonicalUrl="https://www.bezmasajidla.cz/recepty/bezlepkove-recepty"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Domů", url: "/" },
          { name: "Recepty", url: "/recepty" },
          { name: "Bezlepkové recepty", url: "/recepty/bezlepkove-recepty" },
        ]}
      />
      <RecipeListJsonLd recipes={gfRecipes} />
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
            <span className="text-white">Bezlepkové recepty</span>
          </nav>

          <div className="flex items-center gap-2 mb-3">
            <span className="bg-emerald-800 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-700">
              <WheatOff className="w-3.5 h-3.5 text-amber-400" />
              100% Bez lepku
            </span>
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold mb-5"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Bezlepkové recepty <span className="text-amber-400">bez masa</span>
          </h1>

          <p className="text-emerald-100 text-lg leading-relaxed mb-6 max-w-2xl">
            Vyhýbáte se lepku z důvodu celiakie nebo zdravého životního stylu? Vyzkoušejte naše lahodné recepty založené na přirozeně bezlepkových obilovinách jako quinoa, pohanka, jáhly a rýže.
          </p>
        </div>
      </section>

      <section className="py-12 container">
        <div className="flex justify-between items-end mb-8 border-b border-emerald-100 pb-4">
          <h2
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Bezlepkové recepty
          </h2>
          <span className="text-sm text-gray-500 font-medium">
            Nalezeno {gfRecipes.length} receptů
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gfRecipes.map(r => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>

        {/* SEO / Guide Section */}
        <div className="mt-16 bg-white border border-emerald-100 rounded-3xl p-8 lg:p-12 prose prose-emerald max-w-none">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Přirozeně bezlepkové suroviny v bezmasé kuchyni
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Bezlepková strava nemusí spoléhat na průmyslově zpracované bezlepkové směsi. Nejlepší je stavět jídelníček na přirozeně bezlepkových surovinách.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">1. Pohanka a jáhly</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Tradiční plodinám naší kuchyně se vrací zasloužená pozornost. Pohanková krupice je skvělá do rizota nebo salátů s tempehem. Z jáhel připravíte vynikající sladký jáhelník nebo krémovou ranní kaši.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">2. Quinoa a čočky</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Quinoa poskytuje kompletní spektrum esenciálních aminokyselin. V kombinaci s červenou nebo černou čočkou (Beluga) tvoří sytý základ pro teplé i studené bowls.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
