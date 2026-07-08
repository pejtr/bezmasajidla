import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { recipes } from "@/lib/data";
import SEOHead from "@/components/SEOHead";
import { ChevronRight, ArrowRight } from "lucide-react";
import { RecipeListJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export default function RecipePillarPage() {
    const pillarRecipes = recipes.filter(r => r.cuisine?.toLowerCase().includes("česká") || r.tags.some(t => t.toLowerCase() === "česká kuchyně"));

    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
            <SEOHead
                title="Tradiční česká kuchyně bez masa | Bezmasá Jídla"
                description="Česká klasika ve vegetariánské a veganské úpravě. Kulajda, houbová omáčka, bramboráky a další recepty s tipy na náhradu masa."
                ogUrl="https://www.bezmasajidla.cz/recepty/ceska-klasika-bez-masa"
            />
            <BreadcrumbJsonLd items={[
                { name: "Domů", url: "/" },
                { name: "Recepty", url: "/recepty" },
                { name: "Česká klasika bez masa", url: "/recepty/ceska-klasika-bez-masa" },
            ]} />
            <RecipeListJsonLd recipes={pillarRecipes} />
            <Header />

            {/* Hero Section */}
            <section className="bg-emerald-900 text-white py-16">
                <div className="container max-w-4xl">
                    <nav className="text-xs text-emerald-300 font-medium tracking-wide mb-6 flex items-center gap-2">
                        <Link href="/" className="hover:text-white transition-colors">Domů</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/recepty" className="hover:text-white transition-colors">Recepty</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-white">Česká klasika bez masa</span>
                    </nav>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
                        Tradiční česká klasika <span className="text-amber-400">bez masa</span>
                    </h1>

                    <p className="text-emerald-100 text-lg leading-relaxed mb-8 max-w-2xl">
                        Svíčková bez masa, houbový guláš, krémová kulajda nebo křupavé bramboráky. Objevte ověřené vegetariánské a veganské verze oblíbených českých receptů, které si zachovávají svou autentickou chuť.
                    </p>
                </div>
            </section>

            <section className="py-12 container">
                <div className="flex justify-between items-end mb-8 border-b border-emerald-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>
                        Recepty
                    </h2>
                    <span className="text-sm text-gray-500 font-medium">Nalezeno {pillarRecipes.length} receptů</span>
                </div>

                {pillarRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pillarRecipes.map((r) => (
                            <RecipeCard key={r.id} recipe={r} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-emerald-100">
                        <div className="text-4xl mb-4">🍄</div>
                        <p className="text-gray-500 max-w-sm mx-auto">Recepty brzy přidáme. Přihlaste se k odběru našeho newsletteru, ať vám nic neuteče.</p>
                    </div>
                )}

                {/* SEO / Content Section directly inside the pillar */}
                <div className="mt-16 bg-white border border-emerald-100 rounded-3xl p-8 lg:p-12 prose prose-emerald max-w-none">
                    <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
                        Jak na českou klasiku bez masa?
                    </h2>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                        Česká kuchyně je sice od základu postavená na vepřovém, hovězím a drůbežím mase, ale spoustu receptů jde skvěle připravit bez něj – a někdy to vlastně vůbec nepoznáte. Důležité je vědět, čím maso chytře nahradit, aby pokrmu nechyběla žádoucí struktura (tzv. "něco na kousání") a hlavně umami, tedy plná masová chuť.
                    </p>

                    <h3 className="text-xl font-bold mt-8 mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>1. Guláše a omáčky</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                        Základem dobrého veganského nebo vegetariánského guláše je kvalitní základ: hodně restované cibule, silný zeleninový (nebo rovnou houbový) vývar a kvalitní sladká paprika. Místo hovězího výborně poslouží <strong>hlíva ústřičná</strong>, <strong>seitan</strong> (pšeničná bílkovina) nebo <strong>fazole</strong>. Dobře vychucený seitan dokáže přesvědčit i milovníky masa.
                    </p>

                    <h3 className="text-xl font-bold mt-8 mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>2. Kuře na paprice a smetanové omáčky</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                        Místo kuřecího masa stačí na kostky nakrájet <strong>tofu</strong> (ideálně uzené nebo marinované) anebo sójové kostky uvařené v silném zeleninovém vývaru s troškou sójové omáčky. Pro veganskou verzi smetany doporučujeme kešu smetanu na vaření, ovesnou nebo sójovou – dnes už nesráží a dají pokrmu klasickou hebkost.
                    </p>

                    <h3 className="text-xl font-bold mt-8 mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>3. Sekané a karbanátky</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                        Rostlinné mleté dnes koupíte běžně, ale skvělou „sekanou“ upečete i z luštěnin – oblíbené jsou směsi z hnědé čočky, vlašských ořechů a osmahnuté cibulky, vše propojené lněným semínkem jako náhražkou vejce.
                    </p>

                    <hr className="my-8 border-emerald-100" />
                    <p className="text-sm text-gray-500 italic">
                        U bezmasých jídel a hub platí, že pomalý var, bylinky (kmín, pepř, majoránka) a poctivost přípravy jsou klíčem. Recepty na vegan kulajdu, čočku na kyselo s vajíčkem (pro vegetariány) nebo křupavé bramboráky se zelím nepotřebují vůbec žádný kompromis. Dobrou chuť!
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
}
