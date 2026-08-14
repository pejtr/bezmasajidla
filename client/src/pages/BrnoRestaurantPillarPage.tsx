// ============================================================
// BEZMASAJIDLA.CZ — Regional SEO Pillar Page: Brno
// "/restaurace/vegetarianske-restaurace-brno"
// ============================================================

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import RestaurantCard from "@/components/RestaurantCard";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { restaurants } from "@/lib/data";
import { MapPin, Sparkles, Award } from "lucide-react";

export default function BrnoRestaurantPillarPage() {
  const brnoRestaurants = restaurants.filter(
    (r) => r.district.includes("Brno") || r.tags.includes("Brno") || r.address.includes("Brno")
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <SEOHead
        title="Nejlepší vegetariánské a veganské restaurace v Brně (2026) | Bezmasá Jídla"
        description="Kompletní přehled a hodnocení nejlepších vegetariánských a veganských podnicích v Brně. Forky's, Dhaba Beas, Rezet Bistro, Vegalité."
        canonicalUrl="https://www.bezmasajidla.cz/restaurace/vegetarianske-restaurace-brno"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Domů", url: "/" },
          { name: "Restaurace", url: "/restaurace" },
          { name: "Vegetariánské restaurace Brno", url: "/restaurace/vegetarianske-restaurace-brno" },
        ]}
      />
      <Header />

      {/* Hero Banner */}
      <section className="py-12 bg-gradient-to-b from-[#16271E] to-[#0F1914] text-white">
        <div className="container max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Průvodce Gastronomií v Brně</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Nejlepší vegetariánské a veganské restaurace v Brně
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            Brno patří k nejprogresivnějším gastro scénám v ČR. Objevte špičkové veganská bistra, indické bufety i tradiční bezmasé hospodské koncepty.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <main className="flex-1 container max-w-6xl py-12">
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Ověřené bezmasé podniky v Brně</h2>
            <p className="text-xs text-gray-500">Nalezeno {brnoRestaurants.length} podstatných podnicích</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <Award className="w-4 h-4" />
            <span>Aktualizováno pro rok 2026</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brnoRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
