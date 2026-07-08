import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RestaurantCard from "@/components/RestaurantCard";
import { restaurants } from "@/lib/data";
import SEOHead from "@/components/SEOHead";
import { ChevronRight } from "lucide-react";
import { RestaurantListJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export default function VeganRestaurantPillarPage() {
    // Filter specifically for "vegan" restaurants
    const veganRestaurants = [...restaurants]
        .filter(r => r.type === "vegan")
        .sort((a, b) => b.rating - a.rating);

    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
            <SEOHead
                title="Veganské restaurace Praha | Nejlepší 100% rostlinné podniky"
                description="Průvodce nejlepšími veganskými restauracemi v Praze. Od bister po večerní podniky — 100% veganský oběd, recenze a lokální tipy."
                ogUrl="https://www.bezmasajidla.cz/restaurace/veganske-restaurace-praha"
            />
            <BreadcrumbJsonLd items={[
                { name: "Domů", url: "/" },
                { name: "Restaurace", url: "/restaurace" },
                { name: "Veganské restaurace Praha", url: "/restaurace/veganske-restaurace-praha" },
            ]} />
            <RestaurantListJsonLd restaurants={veganRestaurants} />
            <Header />

            <section className="bg-emerald-900 text-white py-16">
                <div className="container max-w-4xl">
                    <nav className="text-xs text-emerald-300 font-medium tracking-wide mb-6 flex items-center gap-2">
                        <Link href="/" className="hover:text-white transition-colors">Domů</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/restaurace" className="hover:text-white transition-colors">Restaurace</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-white">Veganské restaurace Praha</span>
                    </nav>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
                        Nejlepší <span className="text-amber-400">veganské restaurace</span> v Praze
                    </h1>

                    <p className="text-emerald-100 text-lg leading-relaxed mb-8 max-w-2xl">
                        Od rychlých čistě rostlinných obědů na Vinohradech po večerní posezení ve Starém Městě. Objevte ověřené 100% veganské podniky v celé Praze.
                    </p>
                </div>
            </section>

            <section className="py-12 container">
                <div className="flex justify-between items-end mb-8 border-b border-emerald-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
                        Výběr podniků
                    </h2>
                    <span className="text-sm text-gray-500 font-medium">Nalezeno {veganRestaurants.length} restaurací</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {veganRestaurants.map((r, idx) => (
                        <RestaurantCard key={r.id} restaurant={r} rank={idx + 1} />
                    ))}
                </div>

                <div className="mt-16 bg-white border border-emerald-100 rounded-3xl p-8 lg:p-12 prose prose-emerald max-w-none">
                    <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
                        Kam zajít na dobré veganské jídlo v Praze?
                    </h2>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                        Praha se za poslední dekádu stala jednou z nejpřívětivějších evropských metropolí pro vegany. Od jemného fine diningu po pulzující bistra dýchající asijskou či balkánskou kulturou je zde nabídka 100% rostlinných pokrmů špičková.
                    </p>

                    <h3 className="text-xl font-bold mt-8 mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>Veganské podniky podle lokalit</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                        <Link href="/restaurace?district=Vinohrady" className="text-emerald-700 font-medium hover:underline">Vinohrady</Link> a Žižkov patří mezi hlavní bašty moderních rostlinných bister, zatímco klasiky najdete spíše okolo Staroměstského náměstí (např. v uličce Týnská nebo na Starém Městě) – ideální pro speciální posezení nebo rande.
                    </p>

                    <h3 className="text-xl font-bold mt-8 mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>Co čekat cenově?</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                        V pražských veganských restauracích narazíte na široký rozptyl cen. Levnější, rychlé obědy formou samoobslužných bufetů (kde jídlo platíte typicky na váhu) vás nasytí za pár stovek. Pokud naopak cílíte na zážitkovou večeři, moderní interiér a obsluhu, připravte si odpovídající budget. Většina podniků má nicméně polední meníčka, díky kterým můžete špičkovou rostlinnou gastronomii degustovat šetrně.
                    </p>

                    <hr className="my-8 border-emerald-100" />
                    <p className="text-sm text-gray-500 italic">
                        Tento výběr pravidelně aktualizujeme. Úzce se zaměřujeme pouze na 100% veganský koncept. U každého profilu najdete jasné označení dietologických omezení (např. bezlepkové) i doporučení na kultovní jídla z karty.
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
}
