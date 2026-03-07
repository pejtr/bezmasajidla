// ============================================================
// BEZMASAJIDLA.CZ — Recipe Detail Page
// "Zelená Metropole" — full recipe with gallery, ingredients, steps
// ============================================================

import { useState } from "react";
import { useParams, Link } from "wouter";
import { Clock, Users, ChefHat, ArrowLeft, Leaf, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { recipes } from "@/lib/data";

const sampleIngredients: Record<string, string[]> = {
  "veganska-svickova": [
    "500 g seitanu (nebo seitan z pšeničného lepku)",
    "2 mrkve",
    "1 petržel",
    "1/4 celeru",
    "2 cibule",
    "200 ml cashew smetany",
    "2 lžíce hořčice",
    "2 lžíce citronové šťávy",
    "Sůl, pepř, bobkový list, nové koření",
    "Houskové knedlíky k podávání",
    "Brusinkový džem k podávání",
  ],
  "cocková-polevka-uzena-paprika": [
    "250 g červené čočky",
    "1 velká cibule",
    "3 stroužky česneku",
    "2 mrkve",
    "2 lžičky uzené papriky",
    "400 ml pasírovaných rajčat",
    "1 l zeleninového vývaru",
    "2 lžíce olivového oleje",
    "Sůl, pepř, kmín",
    "Čerstvá petrželka na ozdobu",
    "Chléb k podávání",
  ],
  "buddha-bowl-pecena-zelenina": [
    "150 g quinoy",
    "1 batát",
    "200 g cizrny (z konzervy)",
    "1 avokádo",
    "100 g červeného zelí",
    "1 mrkev",
    "2 lžíce tahini",
    "1 lžíce citronové šťávy",
    "1 lžíce olivového oleje",
    "Sůl, pepř, kmín, česnek",
    "Sezamová semínka na posypání",
  ],
  "vegansky-gulas-knedliky": [
    "300 g směsi hub (žampiony, hlívy, portobello)",
    "200 g seitanu",
    "2 velké cibule",
    "3 stroužky česneku",
    "3 lžíce sladké papriky",
    "1 lžička kmínu",
    "2 lžíce rajčatového protlaku",
    "500 ml zeleninového vývaru",
    "2 lžíce olivového oleje",
    "Sůl, pepř",
    "Houskové knedlíky k podávání",
    "Čerstvá petrželka na ozdobu",
  ],
  "spenatove-palacinkys-tofu-ricottou": [
    "200 g čerstvého špenátu",
    "150 g hladké mouky",
    "250 ml rostlinného mléka",
    "200 g tvrdého tofu",
    "1 lžíce citronové šťávy",
    "2 stroužky česneku",
    "2 lžíce nutričního droždí",
    "Sůl, pepř, muškátový oříšek",
    "Olivový olej na smažení",
    "Čerstvé bylinky (bazalka, petrželka)",
  ],
  "houbove-rizoto-kešu-parmezan": [
    "300 g arborio rýže",
    "250 g směsi lesních hub",
    "1 cibule",
    "2 stroužky česneku",
    "100 ml bílého vína",
    "800 ml zeleninového vývaru (teplého)",
    "50 g kešu ořechů",
    "2 lžíce nutričního droždí",
    "2 lžíce olivového oleje",
    "Čerstvý tymián",
    "Sůl, pepř",
  ],
  default: [
    "Ingredience budou brzy doplněny.",
  ],
};

const sampleSteps: Record<string, string[]> = {
  "veganska-svickova": [
    "Seitan nakrájejte na plátky a orestujte na oleji do zlatova z obou stran.",
    "Kořenovou zeleninu a cibuli nakrájejte na kostičky a restujte do měkka.",
    "Přidejte koření (bobkový list, nové koření, pepř) a zalijte vodou nebo zeleninovým vývarem.",
    "Vařte na mírném ohni 45 minut, dokud zelenina nezměkne.",
    "Zeleninu rozmixujte dohladka, přidejte cashew smetanu, hořčici a citronovou šťávu.",
    "Omáčku dochutíte solí a pepřem, případně přidejte trochu cukru pro vyvážení chuti.",
    "Podávejte s houskovými knedlíky a brusinkovým džemem.",
  ],
  "cocková-polevka-uzena-paprika": [
    "Na olivovém oleji orestujte nakrájenou cibuli a česnek do zlatova.",
    "Přidejte nakrájenou mrkev a restujte 3 minuty.",
    "Vsypte uzenou papriku a kmín, míchejte 30 sekund.",
    "Přidejte promytou čočku, pasírovaná rajčata a zeleninový vývar.",
    "Přiveďte k varu, poté snižte teplotu a vařte 20–25 minut, dokud čočka nezměkne.",
    "Dochutíte solí a pepřem. Polévku můžete částečně rozmixovat pro krémovější konzistenci.",
    "Podávejte s kapkou olivového oleje, čerstvou petrželkou a chlebem.",
  ],
  "buddha-bowl-pecena-zelenina": [
    "Quinou propláchněte a uvařte podle návodu na obalu (cca 15 minut).",
    "Batát nakrájejte na kostky, obalte v oleji a koření, pečte 25 minut na 200 °C.",
    "Cizrnu obalte v oleji s kmínem a pečte spolu s batátem posledních 15 minut.",
    "Připravte tahini dresink — smíchejte tahini, citronovou šťávu, trochu vody a sůl.",
    "Červené zelí jemně nakrájejte, mrkev nastrouháte, avokádo nakrájejte na plátky.",
    "Do misky naskládejte quinou, pečenou zeleninu, cizrnu, zelí, mrkev a avokádo.",
    "Polijte tahini dresinkem a posypte sezamovými semínky.",
  ],
  "vegansky-gulas-knedliky": [
    "Cibuli nakrájejte na půlměsíce a na oleji restujte do zlatova (cca 10 minut).",
    "Přidejte nakrájený česnek a restujte minutu.",
    "Vsypte sladkou papriku a kmín, rychle promíchejte (nepřepalujte papriku).",
    "Přidejte nakrájené houby a seitan, restujte 5 minut.",
    "Vmíchejte rajčatový protlak a zalijte zeleninovým vývarem.",
    "Vařte pod pokličkou na mírném ohni 40–50 minut, dokud guláš nezhoustne.",
    "Dochutíte solí a pepřem. Podávejte s houskovými knedlíky a čerstvou petrželkou.",
  ],
  "spenatove-palacinkys-tofu-ricottou": [
    "Špenát blanšírujte, scedíte a rozmixujte s rostlinným mlékem.",
    "Smíchejte špenátovou směs s moukou a špetkou soli. Těsto by mělo být hladké.",
    "Tofu rozmačkejte vidličkou, přidejte citronovou šťávu, česnek, nutriční droždí a koření.",
    "Na lehce olejem potřené pánvi smažte tenké palačinky z obou stran.",
    "Na každou palačinku naneste vrstvu tofu ricotty a srolujte nebo přeložte.",
    "Podávejte teplé, ozdobené čerstvými bylinkami a citronovou kůrou.",
  ],
  "houbove-rizoto-kešu-parmezan": [
    "Kešu ořechy rozmixujte s nutričním droždím na jemný prášek — to je váš veganský parmezán.",
    "Na oleji orestujte nakrájenou cibuli a česnek do sklovata.",
    "Přidejte nakrájené houby a restujte 5 minut, dokud pustí šťávu.",
    "Vsypte arborio rýži a míchejte 2 minuty, aby se obalila olejem.",
    "Zalijte bílým vínem a míchejte, dokud se nevsákne.",
    "Postupně přilévejte teplý vývar po naběračkách a stále míchejte (cca 18–20 minut).",
    "Na závěr vmíchejte kešu parmezán, dochutíte solí a pepřem. Ozdobte čerstvým tymánem.",
  ],
  default: [
    "Postup přípravy bude brzy doplněn.",
  ],
};

// ── Image Gallery Component ─────────────────────────────────
function ImageGallery({ images, title }: { images: { url: string; alt: string }[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const goNext = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="mb-6">
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 group">
        <img
          src={images[activeIndex].url}
          alt={images[activeIndex].alt}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Předchozí fotografie"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Další fotografie"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative rounded-lg overflow-hidden h-16 w-24 flex-shrink-0 transition-all duration-200 ${
                i === activeIndex
                  ? "ring-2 ring-emerald-600 ring-offset-2 opacity-100"
                  : "opacity-60 hover:opacity-90"
              }`}
              aria-label={img.alt}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RecipeDetail() {
  const params = useParams<{ slug: string }>();
  const recipe = recipes.find((r) => r.slug === params.slug);

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">🥦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Recept nenalezen
            </h2>
            <Link href="/recepty">
              <Button className="bg-emerald-700 hover:bg-emerald-600 text-white mt-4">
                Zpět na recepty
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const ingredients = sampleIngredients[recipe.slug] || sampleIngredients.default;
  const steps = sampleSteps[recipe.slug] || sampleSteps.default;

  const difficultyColor = {
    snadný: "bg-emerald-100 text-emerald-700",
    střední: "bg-amber-100 text-amber-700",
    náročný: "bg-red-100 text-red-700",
  }[recipe.difficulty];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-emerald-800 py-4">
        <div className="container">
          <nav className="text-xs text-emerald-300 flex items-center gap-1">
            <Link href="/" className="hover:text-white transition-colors">Domů</Link>
            <span>/</span>
            <Link href="/recepty" className="hover:text-white transition-colors">Recepty</Link>
            <span>/</span>
            <span className="text-white">{recipe.title}</span>
          </nav>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <Link href="/recepty" className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Zpět na recepty
          </Link>

          {/* Image Gallery */}
          {recipe.images && recipe.images.length > 0 ? (
            <ImageGallery images={recipe.images} title={recipe.title} />
          ) : (
            <div className="relative rounded-2xl overflow-hidden mb-6 h-72">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          )}

          {/* Vegan badge */}
          {recipe.isVegan && (
            <div className="inline-flex items-center gap-1 bg-emerald-700 text-white text-sm font-semibold px-3 py-1 rounded-full mb-4 shadow-md">
              <Leaf className="w-3.5 h-3.5" />
              Veganský recept
            </div>
          )}

          {/* Header */}
          <div className="bg-white rounded-xl border border-emerald-100 p-6 mb-6">
            <p className="text-sm text-emerald-600 font-medium mb-1">{recipe.category}</p>
            <h1
              className="text-3xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              {recipe.title}
            </h1>
            <p className="text-gray-600 leading-relaxed mb-4">{recipe.description}</p>

            {/* Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-emerald-100">
              <div className="text-center">
                <Clock className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Příprava</p>
                <p className="text-sm font-semibold text-gray-900">{recipe.prepTime} min</p>
              </div>
              <div className="text-center">
                <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Vaření</p>
                <p className="text-sm font-semibold text-gray-900">{recipe.cookTime} min</p>
              </div>
              <div className="text-center">
                <Users className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Porce</p>
                <p className="text-sm font-semibold text-gray-900">{recipe.servings}</p>
              </div>
              <div className="text-center">
                <ChefHat className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Náročnost</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyColor}`}>
                  {recipe.difficulty}
                </span>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-xl border border-emerald-100 p-6 mb-6">
            <h2
              className="text-xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Ingredience
            </h2>
            <ul className="space-y-2">
              {ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-700">{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div className="bg-white rounded-xl border border-emerald-100 p-6 mb-6">
            <h2
              className="text-xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Postup přípravy
            </h2>
            <ol className="space-y-4">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="w-7 h-7 bg-emerald-700 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <span key={tag} className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
