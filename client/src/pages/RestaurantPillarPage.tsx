import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RestaurantCard from "@/components/RestaurantCard";
import { restaurants } from "@/lib/data";
import SEOHead from "@/components/SEOHead";
import { ChevronRight } from "lucide-react";
import { RestaurantListJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export default function RestaurantPillarPage() {
    const vegRestaurants = [...restaurants]
        .filter(r => r.type === "vegetarian" || r.type === "friendly")
        .sort((a, b) => b.rating - a.rating);

    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
            <SEOHead
                title="Vegetariánské restaurace Praha | Nejlepší bezmasé podniky"
                description="Průvodce nejlepšími vegetariánskými restauracemi v Praze. Od bister po večerní podniky — veganské možnosti, recenze a lokální tipy."
                ogUrl="https://www.bezmasajidla.cz/restaurace/vegetarianske-restaurace-praha"
            />
            <BreadcrumbJsonLd items={[
                { name: "Domů", url: "/" },
                { name: "Restaurace", url: "/restaurace" },
                { name: "Vegetariánské restaurace Praha", url: "/restaurace/vegetarianske-restaurace-praha" },
            ]} />
            <RestaurantListJsonLd restaurants={vegRestaurants} />
            <Header />

            <section className="bg-emerald-900 text-white py-16">
                <div className="container max-w-4xl">
                    <nav className="text-xs text-emerald-300 font-medium tracking-wide mb-6 flex items-center gap-2">
                        <Link href="/" className="hover:text-white transition-colors">Domů</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/restaurace" className="hover:text-white transition-colors">Restaurace</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-white">Vegetariánské restaurace Praha</span>
                    </nav>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
                        Nejlepší <span className="text-amber-400">vegetariánské restaurace</span> v Praze
                    </h1>

                    <p className="text-emerald-100 text-lg leading-relaxed mb-8 max-w-2xl">
                        Od rychlých bezmasých obědů na Vinohradech po večerní posezení ve Starém Městě. Objevte ověřené vegetariánské podniky a vegan-friendly restaurace v celé Praze.
                    </p>
                </div>
            </section>

            <section className="py-12 container">
                <div className="flex justify-between items-end mb-8 border-b border-emerald-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
                        Výběr podniků
                    </h2>
                    <span className="text-sm text-gray-500 font-medium">Nalezeno {vegRestaurants.length} restaurací</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {vegRestaurants.map((r, idx) => (
                        <RestaurantCard key={r.id} restaurant={r} rank={idx + 1} />
                    ))}
                </div>

                <div className="mt-16 bg-white border border-emerald-100 rounded-3xl p-8 lg:p-12 prose prose-emerald max-w-none">
                    <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
                        Kam zajít na dobré bezmasé jídlo v Praze?
                    </h2>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                        Praha se za poslední dekádu stala jednou z nejpřívětivějších evropských metropolí pro vegetariány a vegany. Už dávno neplatí, že byste si v centru mohli dát leda smažený sýr, jemuž vévodila mírně unavená obloha. Naopak – od jemného fine diningu po pulzující bistra dýchající asijskou či balkánskou kulturou je zde nabídka bezmasých pokrmů špičková.
                    </p>

                    <h3 className="text-xl font-bold mt-8 mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>Vegetariánské podniky podle lokalit</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                        <Link href="/restaurace?district=Vinohrady" className="text-emerald-700 font-medium hover:underline">Vinohrady</Link> a Žižkov patří mezi hlavní bašty moderních rostlinných bister, zatímco klasiky najdete spíše okolo Staroměstského náměstí (např. v uličce Týnská nebo na Starém Městě) – ideální pro speciální posezení nebo rande.
                    </p>

                    <h3 className="text-xl font-bold mt-8 mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>Co čekat cenově?</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                        V pražských vegetariánských restauracích narazíte na široký rozptyl cen. Levnější, rychlé obědy formou samoobslužných bufetů (kde jídlo platíte typicky na váhu) vás nasytí za pár stovek. Pokud naopak cílíte na zážitkovou večeři, moderní interiér a obsluhu s párováním vína, připravte si odpovídající budget. Většina podniků má nicméně polední menu (tzv. hotovky), díky kterým můžete špičkovou gastronomii degustovat šetrně.
                    </p>

                    <hr className="my-8 border-emerald-100" />
                    <p className="text-sm text-gray-500 italic">
                        Tento výběr pravidelně aktualizujeme. Řada restaurací v našem seznamu nabízí současně bezlepkové menu nebo možnost vegan úpravy. U každého profilu najdete jasné označení dietologických omezení i doporučení na kultovní jídla z karty (tzv. "must-order").
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
}
