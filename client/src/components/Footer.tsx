// ============================================================
// BEZMASAJIDLA.CZ — Footer Component
// "Zelená Metropole" — dark emerald background
// ============================================================

import { Link } from "wouter";
import { Leaf, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-emerald-900 text-emerald-100">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span
                className="text-xl font-bold text-white"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                bezmasájídla
              </span>
            </Link>
            <p className="text-sm text-emerald-300 leading-relaxed">
              Největší český průvodce veganskými a vegetariánskými restauracemi v Praze.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://instagram.com/bezmasajidla"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-emerald-800 rounded-lg flex items-center justify-center hover:bg-emerald-700 transition-colors"
              >
                <Instagram className="w-4 h-4 text-emerald-200" />
              </a>
              <a
                href="https://facebook.com/bezmasajidla"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-emerald-800 rounded-lg flex items-center justify-center hover:bg-emerald-700 transition-colors"
              >
                <Facebook className="w-4 h-4 text-emerald-200" />
              </a>
            </div>
          </div>

          {/* Restaurace */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Restaurace
            </h4>
            <ul className="space-y-2 text-sm text-emerald-300">
              <li><Link href="/restaurace" className="hover:text-white transition-colors">Všechny restaurace</Link></li>
              <li><Link href="/restaurace?type=vegan" className="hover:text-white transition-colors">Veganské</Link></li>
              <li><Link href="/restaurace?type=vegetarian" className="hover:text-white transition-colors">Vegetariánské</Link></li>
              <li><Link href="/mapa" className="hover:text-white transition-colors">Mapa Prahy</Link></li>
              <li><Link href="/restaurace/pridat" className="hover:text-white transition-colors">Přidat restauraci</Link></li>
            </ul>
          </div>

          {/* VEG Recepty */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              VEG Recepty
            </h4>
            <ul className="space-y-2 text-sm text-emerald-300">
              <li><Link href="/recepty" className="hover:text-white transition-colors">Všechny recepty</Link></li>
              <li><Link href="/recepty?cat=hlavni-jidla" className="hover:text-white transition-colors">Hlavní jídla</Link></li>
              <li><Link href="/recepty?cat=polevky" className="hover:text-white transition-colors">Polévky</Link></li>
              <li><Link href="/recepty?cat=snidane" className="hover:text-white transition-colors">Snídane</Link></li>
              <li><Link href="/recepty?cat=dezerty" className="hover:text-white transition-colors">Dezerty</Link></li>
              <li><Link href="/recepty?dietary=bezlepkove" className="hover:text-white transition-colors">Bezleptkové recepty</Link></li>
              <li><Link href="/recepty?dietary=keto" className="hover:text-white transition-colors">Keto recepty</Link></li>
            </ul>
          </div>

          {/* Průvodci + Blog */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Průvodci
            </h4>
            <ul className="space-y-2 text-sm text-emerald-300 mb-6">
              <li><Link href="/pruvodci" className="hover:text-white transition-colors">Všechny průvodce</Link></li>
              <li><Link href="/pruvodci/veganska-praha-po-ctvrtich" className="hover:text-white transition-colors">Veganská Praha po čtvrtích</Link></li>
              <li><Link href="/pruvodci" className="hover:text-white transition-colors">Jak začít s rostlinnou stravou</Link></li>
              <li><Link href="/pruvodci" className="hover:text-white transition-colors">Sezonní bezmasá kuchyně</Link></li>
            </ul>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Blog
            </h4>
            <ul className="space-y-2 text-sm text-emerald-300">
              <li><Link href="/blog" className="hover:text-white transition-colors">Všechny články</Link></li>
              <li><Link href="/blog/top-10-veganskych-restauraci-praha-2026" className="hover:text-white transition-colors">Top 10 veganských restaurací v Praze</Link></li>
              <li><Link href="/blog/pruvodce-veganskou-prahou-ctvrti" className="hover:text-white transition-colors">Průvodce veganskými čtvrtěmi v Praze</Link></li>
              <li><Link href="/blog/nejlepsi-veganske-brunche-praha" className="hover:text-white transition-colors">Nejlepší veganské brunche v Praze</Link></li>
              <li><Link href="/blog/ceska-veganska-kuchyne-tradicni-jidla-bez-masa" className="hover:text-white transition-colors">Česká veganská kuchyně v Praze</Link></li>
            </ul>

            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mt-6 mb-4">
              O projektu
            </h4>
            <ul className="space-y-2 text-sm text-emerald-300">
              <li><Link href="/o-nas" className="hover:text-white transition-colors">O nás</Link></li>
              <li><Link href="/premium" className="hover:text-white transition-colors">Prémiový profil</Link></li>
              <li><Link href="/kontakt" className="hover:text-white transition-colors">Kontakt</Link></li>
            </ul>


          </div>
        </div>

        {/* Partner Projects Row */}
        <div className="border-t border-emerald-800 mt-10 pt-6 pb-4 text-center">
          <p className="text-xs text-emerald-500 uppercase tracking-wider mb-3">Naše další projekty</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-emerald-200">
            <a href="https://www.akcni-letenky.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Akční letenky</a>
            <a href="https://www.do-italie.cz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Do Itálie</a>
            <a href="https://www.katastr-online.cz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Katastr Online</a>
            <a href="https://www.cajovny-praha.cz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Čajovny Praha</a>
            <a href="https://www.humandesignmapa.cz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Human Design</a>
          </div>
        </div>

        <div className="border-t border-emerald-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400">
          <p>© 2026 Bezmasájídla.cz — Všechna práva vyhrazena</p>
          <div className="flex gap-4">
            <Link href="/ochrana-soukromi" className="hover:text-emerald-200 transition-colors">Ochrana soukromí</Link>
            <Link href="/podminky" className="hover:text-emerald-200 transition-colors">Podmínky použití</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
