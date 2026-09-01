// ============================================================
// BEZMASAJIDLA.CZ — Curated Editorial Rankings & Guides
// Opinionated top-lists for food lovers in Prague
// ============================================================

import { Link } from "wouter";
import { Award, Flame, Coffee, Moon, Baby, Sparkles, ArrowRight } from "lucide-react";

const curatedRankings = [
  {
    slug: "nejlepsi-bezmase-brunche-praha",
    title: "Nejlepší Bezmasé Brunche v Praze",
    subtitle: "Od nadýchaných lívanců po tofu scrambled eggs v Karlíně a na Vinohradech.",
    badge: "Top 7 Podniků",
    icon: Coffee,
    gradient: "from-amber-500 to-orange-600",
    link: "/restaurace/praha/vinohrady",
  },
  {
    slug: "kam-na-nejlepsi-svickovou-bez-masa",
    title: "Kde Ochutnat Nejlepší Svíčkovou Bez Masa",
    subtitle: "Poctivé kořenové omáčky s ovesnou smetanou a seitanovými plátky v centru Prahy.",
    badge: "Česká Klasika",
    icon: Award,
    gradient: "from-emerald-600 to-teal-700",
    link: "/recepty/svickova-bez-masa",
  },
  {
    slug: "kde-se-najist-po-22-hodine",
    title: "Bezmasá Večeře I Po 22:00 Hodině",
    subtitle: "Noční hlad v Praze? Tipy na otevřená bistra, ramen bary a veganský fast food.",
    badge: "Noční Život",
    icon: Moon,
    gradient: "from-indigo-600 to-purple-700",
    link: "/restaurace?type=fastfood",
  },
  {
    slug: "kam-s-detmi-bezmase-restaurace",
    title: "Bezmasé Podniky Vhodné Pro Rodiny S Dětmi",
    subtitle: "Klidná atmosféra, dětský koutek a menu, které si zamilují i ti nejmenší.",
    badge: "Rodina & Děti",
    icon: Baby,
    gradient: "from-rose-500 to-pink-600",
    link: "/restaurace",
  },
];

export default function CuratedRankingsSection() {
  return (
    <section className="py-12 bg-gradient-to-b from-white via-[#F8FAF6] to-[#F0F4EF]">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#4A7C59] uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-[#4A7C59]" />
              <span>Redakční výběry & Žebříčky</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C2826] font-serif">
              Kam v Praze za tím nejlepším
            </h2>
            <p className="text-sm text-[#5A685D] mt-1">
              Testováno redakcí BezmasáJídla.cz — podle reálné chuti, obsluhy a atmosféry.
            </p>
          </div>

          <Link
            href="/restaurace"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A7C59] hover:text-[#3D6649] transition-colors"
          >
            <span>Prohlédnout všechny žebříčky</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {curatedRankings.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.slug} href={item.link}>
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center shadow-xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-100">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#1C2826] group-hover:text-[#4A7C59] transition-colors leading-snug mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#5A685D] leading-relaxed mb-4">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#4A7C59]">
                    <span>Zobrazit podrobný žebříček</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
