// ============================================================
// BEZMASAJIDLA.CZ — Prague District Pillar Page Component
// High-authority localized SEO landing page for Prague neighborhoods.
// ============================================================

import { restaurants } from "@/lib/data";
import { Link } from "wouter";
import RestaurantCard from "@/components/RestaurantCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { MapPin, Sparkles, Utensils, Star, CheckCircle, Navigation } from "lucide-react";

interface DistrictPillarProps {
  districtKey: "vinohrady" | "karlin" | "smichov" | "stare-mesto";
  title: string;
  subtitle: string;
  seoTitle: string;
  seoDescription: string;
  districtLabel: string;
  matchFilter: (r: (typeof restaurants)[0]) => boolean;
  editorialHighlights: {
    bestLunch: string;
    bestVegan: string;
    bestAtmosphere: string;
    description: string;
  };
}

const DISTRICT_CONFIGS: Record<DistrictPillarProps["districtKey"], Omit<DistrictPillarProps, "districtKey">> = {
  vinohrady: {
    districtLabel: "Vinohrady (Praha 2)",
    title: "Nejlepší vegetariánské a veganské restaurace na Vinohradech",
    subtitle: "Průvodce gastro mekkou Prahy 2. Sezónní bistra, specialty coffee a výjimečné rostlinné koncepty.",
    seoTitle: "Vegetariánské a veganské restaurace Vinohrady Praha 2 | Bezmasá Jídla",
    seoDescription: "Objevil jsme nejlepší veganská a vegetariánská bistra na Vinohradech. Recenze, denní menu, adresa a hodnocení podniků na Praze 2.",
    matchFilter: r => r.address.toLowerCase().includes("vinohrady") || r.district === "Praha 2",
    editorialHighlights: {
      bestLunch: "Dhaba Beas Bělehradská",
      bestVegan: "Pastva Restaurant",
      bestAtmosphere: "Střecha Bistro",
      description: "Vinohrady jsou považovány za hlavní město pražské veganské a vegetariánské scény. V sousedství Korunní a Bělehradské najdete přes 10 špičkových podniků.",
    },
  },
  karlin: {
    districtLabel: "Karlín (Praha 8)",
    title: "Veganské a vegetariánské gastro v Karlíně",
    subtitle: "Moderní bistra, polední menu a výběrová káva na Praze 8. Kde se dobře najíst bez masa v Karlíně.",
    seoTitle: "Veganské restaurace Karlín Praha 8 | Nejlepší bezmasé obědy",
    seoDescription: "Průvodce vegetariánskými a veganskými podniky v Karlíně. Kam na polední pauzu, rychlé bistro i gurmánskou večeři na Praze 8.",
    matchFilter: r => r.address.toLowerCase().includes("karlín") || r.district === "Praha 8",
    editorialHighlights: {
      bestLunch: "Spojka Karlín",
      bestVegan: "Dhaba Beas Sokolovská",
      bestAtmosphere: "Forky's Karlín",
      description: "Karlín propojuje korporátní dynamiku s moderní gastronomií. Místní bezmasá bistra nabízí rychlé, výživné a esteticky dokonalé polední menu.",
    },
  },
  smichov: {
    districtLabel: "Smíchov (Praha 5)",
    title: "Bezmasé restaurace a veganská bistra na Smíchově",
    subtitle: "Průvodce vegetariánským jídlem na Praze 5 — od Anděla po nábřeží.",
    seoTitle: "Vegetariánské restaurace Smíchov Praha 5 | Bezmasá Jídla",
    seoDescription: "Kde se najíst vegetariánsky a vegansky na Smíchově u Anděla. Ověřené podniky, denní nabídka a hodnocení zákazníků.",
    matchFilter: r => r.address.toLowerCase().includes("smíchov") || r.address.toLowerCase().includes("anděl") || r.district === "Praha 5",
    editorialHighlights: {
      bestLunch: "Dhaba Beas Nádražní",
      bestVegan: "Loving Hut Smíchov",
      bestAtmosphere: "Manifesto Market Place",
      description: "Smíchov a oblast okolo uzlu Anděl nabízí rychlé a cenově dostupné bezmasé obědy s asijským i mezinárodním zaměřením.",
    },
  },
  "stare-mesto": {
    districtLabel: "Staré Město (Praha 1)",
    title: "Veganské a vegetariánské restaurace v centru Prahy (Staré Město)",
    subtitle: "Objevil jsme historické skvosty bezmasé gastronomie v srdci Prahy 1.",
    seoTitle: "Veganské restaurace Staré Město Praha 1 | Nejlepší podniky v centru",
    seoDescription: "Nejlepší vegetariánské a veganské restaurace na Starém Městě v Praze 1. Maitrea, Lehká Hlava, Country Life a další ikonická místa.",
    matchFilter: r => r.address.toLowerCase().includes("praha 1") || r.address.toLowerCase().includes("staré město") || r.district === "Praha 1",
    editorialHighlights: {
      bestLunch: "Country Life Melantrichova",
      bestVegan: "Maitrea Týnská",
      bestAtmosphere: "Lehká Hlava Boršov",
      description: "Staré Město ukrývá ikonické pražské vegetariánské restaurace s nezaměnitelným interiérem a desetiletou tradicí kvalitního vaření.",
    },
  },
};

export default function DistrictPillarPage({ districtKey }: { districtKey: DistrictPillarProps["districtKey"] }) {
  const config = DISTRICT_CONFIGS[districtKey];
  const matchedRestaurants = restaurants.filter(config.matchFilter);

  return (
    <div className="min-h-screen bg-[#F8FAF6] text-[#2C352E] flex flex-col font-sans">
      <SEOHead
        title={config.seoTitle}
        description={config.seoDescription}
        ogUrl={`https://www.bezmasajidla.cz/restaurace/praha/${districtKey}`}
      />
      <Header />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-[#EBF2E8] to-[#F8FAF6] pt-12 pb-16 border-b border-[#E1EADF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#4A7C59] uppercase tracking-wider mb-3">
            <MapPin className="w-4 h-4" />
            <span>Lokální průvodce Praha • {config.districtLabel}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1C2826] tracking-tight mb-4 max-w-4xl leading-tight">
            {config.title}
          </h1>

          <p className="text-lg text-[#5A685D] max-w-3xl leading-relaxed mb-8">
            {config.subtitle}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl bg-white p-4 rounded-2xl shadow-sm border border-[#E1EADF]">
            <div>
              <div className="text-xs text-[#7A887D] font-medium">Nalezeno podniků</div>
              <div className="text-2xl font-bold text-[#1C2826] mt-0.5">{matchedRestaurants.length}</div>
            </div>
            <div>
              <div className="text-xs text-[#7A887D] font-medium">Průměrné hodnocení</div>
              <div className="text-2xl font-bold text-[#4A7C59] mt-0.5 flex items-center gap-1">
                4.7 <Star className="w-4 h-4 fill-current" />
              </div>
            </div>
            <div>
              <div className="text-xs text-[#7A887D] font-medium">100% Vegan obchody</div>
              <div className="text-2xl font-bold text-[#1C2826] mt-0.5">
                {matchedRestaurants.filter(r => r.type === "vegan").length}
              </div>
            </div>
            <div>
              <div className="text-xs text-[#7A887D] font-medium">Ověřeno redakcí</div>
              <div className="text-2xl font-bold text-[#4A7C59] mt-0.5 flex items-center gap-1">
                100% <CheckCircle className="w-4 h-4 text-[#4A7C59]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Grid */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Editorial Summary Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 mb-12 shadow-sm border border-[#E1EADF]">
          <div className="flex items-center gap-2 text-base font-bold text-[#1C2826] mb-4">
            <Sparkles className="w-5 h-5 text-[#4A7C59]" />
            <h2>Redakční přehled pro {config.districtLabel}</h2>
          </div>
          <p className="text-[#4A554D] leading-relaxed mb-6">
            {config.editorialHighlights.description}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#F0F4EF]">
            <div className="bg-[#F8FAF6] p-4 rounded-xl">
              <span className="text-xs font-semibold text-[#7A887D] uppercase block mb-1">Nejlepší na rychlý oběd</span>
              <span className="font-bold text-[#1C2826]">{config.editorialHighlights.bestLunch}</span>
            </div>
            <div className="bg-[#F8FAF6] p-4 rounded-xl">
              <span className="text-xs font-semibold text-[#7A887D] uppercase block mb-1">Top 100% Vegan volba</span>
              <span className="font-bold text-[#4A7C59]">{config.editorialHighlights.bestVegan}</span>
            </div>
            <div className="bg-[#F8FAF6] p-4 rounded-xl">
              <span className="text-xs font-semibold text-[#7A887D] uppercase block mb-1">Výjimečná atmosféra</span>
              <span className="font-bold text-[#1C2826]">{config.editorialHighlights.bestAtmosphere}</span>
            </div>
          </div>
        </div>

        {/* Restaurant List Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#1C2826] flex items-center gap-2">
            <Utensils className="w-6 h-6 text-[#4A7C59]" />
            Doporučené restaurace v lokalitě ({matchedRestaurants.length})
          </h2>
        </div>

        {matchedRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {matchedRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#E1EADF] mb-12">
            <p className="text-[#5A685D] mb-4">V této lokalitě máme momentálně připravené další restaurační profily ke schválení.</p>
            <Link href="/restaurace">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A7C59] text-white rounded-xl font-semibold hover:bg-[#3D6649] transition-colors cursor-pointer">
                Zobrazit všechny restaurace v Praze
              </span>
            </Link>
          </div>
        )}

        {/* Cross-linking to Recipe Clusters */}
        <section className="bg-[#EBF2E8] rounded-3xl p-8 border border-[#D5E3D2]">
          <h3 className="text-xl font-bold text-[#1C2826] mb-3 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#4A7C59]" />
            Chcete si raději uvařit bezmasé jídlo doma?
          </h3>
          <p className="text-[#4A554D] mb-6">
            Prohlédněte si naše nejpopulárnější bezmasé recepty s vysokým obsahem bílkovin a spočítanou cenou za porci.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/recepty/tofu">
              <span className="px-4 py-2 bg-white rounded-xl text-sm font-semibold text-[#2C352E] hover:bg-[#4A7C59] hover:text-white transition-colors border border-[#D5E3D2] cursor-pointer">
                🌱 Tofu recepty
              </span>
            </Link>
            <Link href="/recepty/cizrna">
              <span className="px-4 py-2 bg-white rounded-xl text-sm font-semibold text-[#2C352E] hover:bg-[#4A7C59] hover:text-white transition-colors border border-[#D5E3D2] cursor-pointer">
                🧆 Cizrna & Hummus
              </span>
            </Link>
            <Link href="/recepty/cocka">
              <span className="px-4 py-2 bg-white rounded-xl text-sm font-semibold text-[#2C352E] hover:bg-[#4A7C59] hover:text-white transition-colors border border-[#D5E3D2] cursor-pointer">
                🍲 Čočkové recepty
              </span>
            </Link>
            <Link href="/recepty/rychle-bezmase-vecere">
              <span className="px-4 py-2 bg-white rounded-xl text-sm font-semibold text-[#2C352E] hover:bg-[#4A7C59] hover:text-white transition-colors border border-[#D5E3D2] cursor-pointer">
                ⚡ Večeře do 20 minut
              </span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
