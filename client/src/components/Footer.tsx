// ============================================================
// BEZMASAJIDLA.CZ — Footer Component
// "Zelená Metropole" — dark emerald background
// ============================================================

import { Link } from "wouter";
import { ArrowUpRight, Leaf, Instagram, Facebook } from "lucide-react";

const partnerProjects = [
  {
    name: "Last Minute dovolené",
    domain: "LASTMINUTEDOVOLENE",
    suffix: ".CZ",
    description: "Dovolená za nejlepší ceny",
    href: "https://www.lastminutedovolene.cz",
    image:
      "https://files.manuscdn.com/user_upload_by_module/session_file/89740521/BkmZsbAdGIRJXzzG.jpg",
  },
  {
    name: "Akční letenky",
    domain: "AKCNI-LETENKY",
    suffix: ".COM",
    description: "Levné lety a cestovatelské tipy",
    href: "https://www.akcni-letenky.com",
    image: "https://www.akcni-letenky.com/hero-bg.jpg",
  },
  {
    name: "Katastr Online",
    domain: "KATASTR-ONLINE",
    suffix: ".CZ",
    description: "Nemovitosti přehledně online",
    href: "https://www.katastr-online.cz",
    image: "https://www.katastr-online.cz/og-image.jpg",
  },
  {
    name: "Čajovny Praha",
    domain: "CAJOVNY-PRAHA",
    suffix: ".CZ",
    description: "Oázy klidu uprostřed Prahy",
    href: "https://www.cajovny-praha.cz",
    image:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032296198/yxZoXDMoMcHuiGuf.jpg",
  },
  {
    name: "Do Itálie",
    domain: "DO-ITALIE",
    suffix: ".CZ",
    description: "Rady, místa a inspirace z Itálie",
    href: "https://www.do-italie.cz",
    image:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=900&h=600&fit=crop&q=82",
  },
  {
    name: "Human Design",
    domain: "HUMANDESIGNMAPA",
    suffix: ".CZ",
    description: "Objevte mapu svého já",
    href: "https://www.humandesignmapa.cz",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/SJUUMjJfby3uu5HSPh4u4R/og-homepage-TnsCURzJFMQ4a9smwqmEMU.png",
  },
] as const;

function PartnerProjectCard({
  project,
  duplicate = false,
}: {
  project: (typeof partnerProjects)[number];
  duplicate?: boolean;
}) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        duplicate ? undefined : `${project.name} – otevřít v novém okně`
      }
      aria-hidden={duplicate || undefined}
      tabIndex={duplicate ? -1 : undefined}
      className="partner-project-card group"
    >
      <img
        src={project.image}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/5" />

      <span className="absolute left-4 top-4 inline-flex overflow-hidden rounded-full bg-white shadow-sm">
        <span className="px-3 py-1.5 text-[10px] font-bold tracking-wide text-slate-700">
          {project.domain}
        </span>
        <span className="bg-amber-400 px-2 py-1.5 text-[10px] font-black text-slate-900">
          {project.suffix}
        </span>
      </span>

      <span className="absolute bottom-4 left-4 right-14 text-white">
        <span
          className="block text-xl font-semibold leading-tight"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          {project.name}
        </span>
        <span className="mt-1 block truncate text-xs text-white/85">
          {project.description}
        </span>
      </span>

      <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-sm transition-colors group-hover:bg-white group-hover:text-emerald-900">
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </a>
  );
}

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
              Největší český průvodce veganskými a vegetariánskými restauracemi
              v Praze.
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
              <li>
                <Link
                  href="/restaurace"
                  className="hover:text-white transition-colors"
                >
                  Všechny restaurace
                </Link>
              </li>
              <li>
                <Link
                  href="/restaurace?type=vegan"
                  className="hover:text-white transition-colors"
                >
                  Veganské
                </Link>
              </li>
              <li>
                <Link
                  href="/restaurace?type=vegetarian"
                  className="hover:text-white transition-colors"
                >
                  Vegetariánské
                </Link>
              </li>
              <li>
                <Link
                  href="/mapa"
                  className="hover:text-white transition-colors"
                >
                  Mapa Prahy
                </Link>
              </li>
              <li>
                <Link
                  href="/restaurace/pridat"
                  className="hover:text-white transition-colors"
                >
                  Přidat restauraci
                </Link>
              </li>
            </ul>
          </div>

          {/* VEG Recepty */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              VEG Recepty
            </h4>
            <ul className="space-y-2 text-sm text-emerald-300">
              <li>
                <Link
                  href="/recepty"
                  className="hover:text-white transition-colors"
                >
                  Všechny recepty
                </Link>
              </li>
              <li>
                <Link
                  href="/recepty?cat=hlavni-jidla"
                  className="hover:text-white transition-colors"
                >
                  Hlavní jídla
                </Link>
              </li>
              <li>
                <Link
                  href="/recepty?cat=polevky"
                  className="hover:text-white transition-colors"
                >
                  Polévky
                </Link>
              </li>
              <li>
                <Link
                  href="/recepty?cat=snidane"
                  className="hover:text-white transition-colors"
                >
                  Snídane
                </Link>
              </li>
              <li>
                <Link
                  href="/recepty?cat=dezerty"
                  className="hover:text-white transition-colors"
                >
                  Dezerty
                </Link>
              </li>
              <li>
                <Link
                  href="/recepty?dietary=bezlepkove"
                  className="hover:text-white transition-colors"
                >
                  Bezleptkové recepty
                </Link>
              </li>
              <li>
                <Link
                  href="/recepty?dietary=keto"
                  className="hover:text-white transition-colors"
                >
                  Keto recepty
                </Link>
              </li>
            </ul>
          </div>

          {/* O nás */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Blog
            </h4>
            <ul className="space-y-2 text-sm text-emerald-300">
              <li>
                <Link
                  href="/blog"
                  className="hover:text-white transition-colors"
                >
                  Všechny články
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/top-10-veganskych-restauraci-praha-2026"
                  className="hover:text-white transition-colors"
                >
                  Top 10 veganských restaurací v Praze
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/pruvodce-veganskou-prahou-ctvrti"
                  className="hover:text-white transition-colors"
                >
                  Průvodce veganskými čtvrtěmi v Praze
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/nejlepsi-veganske-brunche-praha"
                  className="hover:text-white transition-colors"
                >
                  Nejlepší veganské brunche v Praze
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/ceska-veganska-kuchyne-tradicni-jidla-bez-masa"
                  className="hover:text-white transition-colors"
                >
                  Česká veganská kuchyně v Praze
                </Link>
              </li>
            </ul>

            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mt-6 mb-4">
              O projektu
            </h4>
            <ul className="space-y-2 text-sm text-emerald-300">
              <li>
                <Link
                  href="/o-nas"
                  className="hover:text-white transition-colors"
                >
                  O nás
                </Link>
              </li>
              <li>
                <Link
                  href="/premium"
                  className="hover:text-white transition-colors"
                >
                  Prémiový profil
                </Link>
              </li>
              <li>
                <Link
                  href="/kontakt"
                  className="hover:text-white transition-colors"
                >
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Advertising Section */}
        <div className="border-t border-emerald-800 mt-10 pt-6 pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-emerald-500 uppercase tracking-wider mb-1">
                Reklama na našem webu
              </p>
              <p className="text-sm text-emerald-300">
                Oslovte tisíce návštěvníků hledajících veganské a vegetariánské
                restaurace v Praze.
              </p>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-emerald-400">
                <span className="inline-flex items-center gap-1">
                  ✓ Banner 728×90
                </span>
                <span className="inline-flex items-center gap-1">
                  ✓ Sponzorovaný profil restaurace
                </span>
                <span className="inline-flex items-center gap-1">
                  ✓ Newsletter
                </span>
                <span className="inline-flex items-center gap-1">
                  ✓ Sociální sítě
                </span>
              </div>
              <p className="text-xs text-emerald-500 mt-1">
                Ceny na vyžádání —{" "}
                <a
                  href="/inzerce"
                  className="text-emerald-300 hover:text-white underline transition-colors"
                >
                  více informací
                </a>
              </p>
            </div>
            <a
              href="mailto:inzerce@bezmasajidla.cz"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              Napište nám
            </a>
          </div>
        </div>

        <div className="border-t border-emerald-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400">
          <p>© 2026 Bezmasájídla.cz — Všechna práva vyhrazena</p>
          <div className="flex gap-4">
            <Link
              href="/ochrana-soukromi"
              className="hover:text-emerald-200 transition-colors"
            >
              Ochrana soukromí
            </Link>
            <Link
              href="/podminky"
              className="hover:text-emerald-200 transition-colors"
            >
              Podmínky použití
            </Link>
            <Link
              href="/inzerce"
              className="hover:text-emerald-200 transition-colors font-semibold text-emerald-300"
            >
              Inzerce
            </Link>
          </div>
        </div>
      </div>

      <section
        className="partner-projects-strip"
        aria-labelledby="partner-projects-title"
      >
        <h2 id="partner-projects-title" className="partner-projects-title">
          Naše další projekty
        </h2>

        <div className="partner-marquee__viewport">
          <div className="partner-marquee__track">
            <div className="partner-marquee__group">
              {partnerProjects.map(project => (
                <PartnerProjectCard key={project.href} project={project} />
              ))}
            </div>
            <div className="partner-marquee__group" aria-hidden="true">
              {partnerProjects.map(project => (
                <PartnerProjectCard
                  key={`duplicate-${project.href}`}
                  project={project}
                  duplicate
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
