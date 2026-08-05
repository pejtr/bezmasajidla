import { ExternalLink, Leaf, ShoppingCart, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const AFFILIATE_BASE = "https://ehub.cz/system/scripts/click.php?a_aid=6e1140ca&a_bid=7092fff6";

function affiliateUrl(productUrl: string) {
  return `${AFFILIATE_BASE}&url=${encodeURIComponent(productUrl)}`;
}

const categories = [
  {
    name: "Přírodní kosmetika",
    description: "Veganská, cruelty-free kosmetika z přírodních ingrediencí.",
    icon: "🌿",
    products: [
      {
        title: "Carpathia Herbarium - sprchový gel hebkost a regenerace",
        brand: "Carpathia Herbarium",
        price: "114 Kč",
        image: "https://cdn.myshoptet.com/usr/eshop.ekoclovek.cz/user/shop/orig/5831_sprchovy-gel-hebkost-a-regenerace-350ml.jpg?668d4b21",
        link: "https://eshop.ekoclovek.cz/ekologicka-telova-kosmetika-2/carpathia-herbarium-sprchovy-gel-hebkost-a-regenerace/",
        description: "100% veganský sprchový gel s extraktem z damašské růže a ibišku pro hebkou pokožku.",
      },
      {
        title: "Soaphoria - Broskvový sprchový gel Vendetta",
        brand: "YAYA original",
        price: "168 Kč",
        image: "https://cdn.myshoptet.com/usr/eshop.ekoclovek.cz/user/shop/orig/6691_yaya-sprchovy-gel-broskynova-vendetta.png?68e5080a",
        link: "https://eshop.ekoclovek.cz/ekologicka-domacnost/soaphoria-vendetta-broskvi-sprchovy-gel/",
        description: "Extravagantní sprchový gel s vůní šťavnatých broskví, 100% přírodní složení.",
      },
      {
        title: "Soaphoria - Balzám na ruce Macaroon",
        brand: "Soaphoria",
        price: "189 Kč",
        image: "https://cdn.myshoptet.com/usr/eshop.ekoclovek.cz/user/shop/orig/6689_yaya-balzam-na-ruce-macaroon.png?68e5080a",
        link: "https://eshop.ekoclovek.cz/ekologicka-telova-kosmetika-2/soaphoria-balzam-na-ruce-macaroon/",
        description: "Výživný balzám na ruce s vůní makronek, zanechává pokožku hebkou.",
      },
    ],
  },
  {
    name: "Ekologické čištění",
    description: "Bio čistící prostředky na rostlinné bázi, šetrné k přírodě.",
    icon: "✨",
    products: [
      {
        title: "SONETT - Univerzální čistící prostředek",
        brand: "SONETT",
        price: "143 Kč",
        image: "https://cdn.myshoptet.com/usr/eshop.ekoclovek.cz/user/shop/orig/4298_sonett-univerzalni-cistici-prostredek.jpg?65902b77",
        link: "https://eshop.ekoclovek.cz/ekologicke-cistici-prostredky/sonett-univerzalni-cistici-prostredek/",
        description: "Jemný univerzální čistič na všechny omyvatelné povrchy, účinný i v tvrdé vodě.",
      },
      {
        title: "SONETT - Čistič na povrchy Koupelna",
        brand: "SONETT",
        price: "150 Kč",
        image: "https://cdn.myshoptet.com/usr/eshop.ekoclovek.cz/user/shop/orig/4301-2_sonett-cistic-na-povrchy-koupelna.jpg?68b84c52",
        link: "https://eshop.ekoclovek.cz/ekologicke-cistici-prostredky/sonett-cistic-na-povrchy-koupelna/",
        description: "Čistič na bázi kyseliny citronové, odstraňuje vodní kámen i mastné nečistoty.",
      },
      {
        title: "SONETT - Prací prostředek na barevné prádlo",
        brand: "SONETT",
        price: "185 Kč",
        image: "https://cdn.myshoptet.com/usr/eshop.ekoclovek.cz/user/shop/orig/4295_sonett-praci-prostredek-na-barevne-pradlo.jpg?65902b77",
        link: "https://eshop.ekoclovek.cz/ekologicke-cistici-prostredky/sonett-praci-prostredek-na-barevne-pradlo/",
        description: "Jemný prací gel na barevné prádlo s přírodními tenzidy, šetrný k pokožce.",
      },
    ],
  },
  {
    name: "Aromaterapie",
    description: "100% přírodní esenciální oleje a směsi pro relaxaci i zdraví.",
    icon: "🌸",
    products: [
      {
        title: "Natasha - Osvěžovač vzduchu Sladké sny",
        brand: "Natasha",
        price: "228 Kč",
        image: "https://cdn.myshoptet.com/usr/eshop.ekoclovek.cz/user/shop/orig/6778_natasha---osvezovac-vzduchu-sladke-sny.jpg?691db681",
        link: "https://eshop.ekoclovek.cz/aromaterapie/natasha-osvezovac-vzduchu-sladke-sny/",
        description: "100% přírodní směs esenciálních olejů pro relaxaci a klidný spánek.",
      },
      {
        title: "Natasha - Osvěžovač vzduchu Volně dýchám",
        brand: "Natasha",
        price: "228 Kč",
        image: "https://cdn.myshoptet.com/usr/eshop.ekoclovek.cz/user/shop/orig/6784_natasha---osvezovac-vzduchu-volne-dycham.jpg?691dbe5c",
        link: "https://eshop.ekoclovek.cz/aromaterapie/natasha---osvezovac-vzduchu-volne-dycham/",
        description: "Přírodní směs eukalyptu, tymiánu a máty pro uvolnění dýchacích cest.",
      },
      {
        title: "Natasha - Éterický olej Levandule",
        brand: "Natasha",
        price: "149 Kč",
        image: "https://cdn.myshoptet.com/usr/eshop.ekoclovek.cz/user/shop/orig/6770_natasha-etericky-olej-lavandule.jpg?691dbe5c",
        link: "https://eshop.ekoclovek.cz/aromaterapie/natasha-etericky-olej-lavandule/",
        description: "100% přírodní levandulový olej pro klid, relaxaci a podporu spánku.",
      },
    ],
  },
];

export default function EcoZivotPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Ekologický životní styl | bezmasájídla.cz"
        description="Veganská kosmetika, ekologické čistící prostředky a přírodní aromaterapie - vše bez krutosti na zvířatech."
        url="https://www.bezmasajidla.cz/eko-zivot"
      />
      <Header />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-emerald-50 to-white py-16">
          <div className="container text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" />
              Ekologický životní styl
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Produkty pro ekologickou domácnost
            </h1>
            <p className="text-lg text-emerald-600 max-w-2xl mx-auto mb-8">
              Veganská kosmetika, ekologické čistící prostředky a přírodní aromaterapie
              — vše bez krutosti na zvířatech. Vybráno pro vás z eshopu Ekokočlověk.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-emerald-600">
              <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-pink-500" /> Cruelty-free</span>
              <span className="flex items-center gap-1.5"><Leaf className="w-4 h-4 text-emerald-500" /> Přírodní složení</span>
              <span className="flex items-center gap-1.5">🌱 Veganské</span>
            </div>
          </div>
        </section>

        {/* Categories */}
        {categories.map((category) => (
          <section key={category.name} className="py-12">
            <div className="container">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl">{category.icon}</span>
                <div>
                  <h2
                    className="text-2xl font-bold text-emerald-900"
                    style={{ fontFamily: "'DM Serif Display', serif" }}
                  >
                    {category.name}
                  </h2>
                  <p className="text-emerald-600 text-sm">{category.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.products.map((product) => (
                  <a
                    key={product.title}
                    href={affiliateUrl(product.link)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="group bg-white rounded-2xl border border-emerald-100 overflow-hidden hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
                  >
                    <div className="relative h-48 bg-gray-50 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-xs text-emerald-500 font-medium uppercase tracking-wide mb-1">
                        {product.brand}
                      </p>
                      <h3 className="font-semibold text-emerald-900 mb-2 group-hover:text-emerald-700 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-sm text-emerald-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-emerald-700">
                          {product.price}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 group-hover:text-emerald-800 font-medium transition-colors">
                          <ShoppingCart className="w-4 h-4" />
                          Koupit
                          <ExternalLink className="w-3 h-3 opacity-50" />
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="py-12 bg-emerald-50">
          <div className="container text-center">
            <h2
              className="text-2xl font-bold text-emerald-900 mb-4"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Chcete vidět všechny produkty?
            </h2>
            <p className="text-emerald-600 mb-6 max-w-xl mx-auto">
              Navštivte eshop Ekokočlověk a objevte stovky ekologických produktů
              pro váš domov i tělo.
            </p>
            <a
              href={affiliateUrl("https://eshop.ekoclovek.cz/")}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Přejít do eshopu
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
