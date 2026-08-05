import { ExternalLink, Leaf, ShoppingCart } from "lucide-react";

const AFFILIATE_BASE = "https://ehub.cz/system/scripts/click.php?a_aid=6e1140ca&a_bid=7092fff6";

function affiliateUrl(productUrl: string) {
  return `${AFFILIATE_BASE}&url=${encodeURIComponent(productUrl)}`;
}

const products = [
  {
    title: "Carpathia Herbarium - sprchový gel",
    brand: "Carpathia Herbarium",
    price: "114 Kč",
    image: "https://cdn.myshoptet.com/usr/eshop.ekoclovek.cz/user/shop/orig/5831_sprchovy-gel-hebkost-a-regenerace-350ml.jpg?668d4b21",
    link: "https://eshop.ekoclovek.cz/ekologicka-telova-kosmetika-2/carpathia-herbarium-sprchovy-gel-hebkost-a-regenerace/",
    description: "100% veganský sprchový gel s extraktem z damašské růže a ibišku.",
    category: "kosmetika",
  },
  {
    title: "Soaphoria - Broskvový sprchový gel",
    brand: "YAYA original",
    price: "168 Kč",
    image: "https://cdn.myshoptet.com/usr/eshop.ekoclovek.cz/user/shop/orig/6691_yaya-sprchovy-gel-broskynova-vendetta.png?68e5080a",
    link: "https://eshop.ekoclovek.cz/ekologicka-domacnost/soaphoria-vendetta-broskvi-sprchovy-gel/",
    description: "Extravagantní sprchový gel s vůní šťavnatých broskví, přírodní složení.",
    category: "kosmetika",
  },
  {
    title: "SONETT - Univerzální čistič",
    brand: "SONETT",
    price: "143 Kč",
    image: "https://cdn.myshoptet.com/usr/eshop.ekoclovek.cz/user/shop/orig/4298_sonett-univerzalni-cistici-prostredek.jpg?65902b77",
    link: "https://eshop.ekoclovek.cz/ekologicke-cistici-prostredky/sonett-univerzalni-cistici-prostredek/",
    description: "Jemný univerzální čistič na všechny omyvatelné povrchy.",
    category: "cisteni",
  },
  {
    title: "SONETT - Čistič Koupelna",
    brand: "SONETT",
    price: "150 Kč",
    image: "https://cdn.myshoptet.com/usr/eshop.ekoclovek.cz/user/shop/orig/4301-2_sonett-cistic-na-povrchy-koupelna.jpg?68b84c52",
    link: "https://eshop.ekoclovek.cz/ekologicke-cistici-prostredky/sonett-cistic-na-povrchy-koupelna/",
    description: "Na bázi kyseliny citronové, odstraňuje vodní kámen i mastnotu.",
    category: "cisteni",
  },
  {
    title: "Natasha - Osvěžovač Sladké sny",
    brand: "Natasha",
    price: "228 Kč",
    image: "https://cdn.myshoptet.com/usr/eshop.ekoclovek.cz/user/shop/orig/6778_natasha---osvezovac-vzduchu-sladke-sny.jpg?691db681",
    link: "https://eshop.ekoclovek.cz/aromaterapie/natasha-osvezovac-vzduchu-sladke-sny/",
    description: "100% přírodní směs esenciálních olejů pro relaxaci a klidný spánek.",
    category: "aromaterapie",
  },
  {
    title: "Natasha - Osvěžovač Volně dýchám",
    brand: "Natasha",
    price: "228 Kč",
    image: "https://cdn.myshoptet.com/usr/eshop.ekoclovek.cz/user/shop/orig/6784_natasha---osvezovac-vzduchu-volne-dycham.jpg?691dbe5c",
    link: "https://eshop.ekoclovek.cz/aromaterapie/natasha---osvezovac-vzduchu-volne-dycham/",
    description: "Přírodní směs eukalyptu, tymiánu a máty pro uvolnění dýchacích cest.",
    category: "aromaterapie",
  },
];

const categoryLabels: Record<string, { label: string; color: string }> = {
  kosmetika: { label: "Přírodní kosmetika", color: "bg-pink-100 text-pink-700" },
  cisteni: { label: "Ekologické čištění", color: "bg-blue-100 text-blue-700" },
  aromaterapie: { label: "Aromaterapie", color: "bg-purple-100 text-purple-700" },
};

export default function EcoProducts() {
  return (
    <section className="py-16 bg-gradient-to-b from-emerald-50 to-white">
      <div className="container">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Leaf className="w-4 h-4" />
            Ekologický životní styl
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold text-emerald-900 mb-3"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Produkty pro ekologickou domácnost
          </h2>
          <p className="text-emerald-600 max-w-2xl mx-auto">
            Veganská kosmetika, ekologické čistící prostředky a přírodní aromaterapie
            — vše bez krutosti na zvířatech.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const cat = categoryLabels[product.category];
            return (
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
                  <span className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full ${cat.color}`}>
                    {cat.label}
                  </span>
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
            );
          })}
        </div>

        <div className="text-center mt-8">
          <a
            href={affiliateUrl("https://eshop.ekoclovek.cz/")}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-medium transition-colors"
          >
            Všechny ekologické produkty
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
