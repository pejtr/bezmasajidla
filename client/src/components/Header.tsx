// ============================================================
// BEZMASAJIDLA.CZ — Header Component
// "Zelená Metropole" — sticky nav, emerald brand, DM Serif logo
// Includes mega menus for VEG Recepty and Restaurace
// ============================================================

import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu, X, Search, Heart, User, LogOut, ChefHat, BookOpen,
  Star, Shield, ChevronDown, Leaf, MapPin, Utensils, Coffee,
  Salad, Flame, Wheat, Sprout, Globe, Clock, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import SearchOverlay from "@/components/SearchOverlay";
import FavoritesPanel from "@/components/FavoritesPanel";

// ── Mega menu data ──────────────────────────────────────────

const restauraceMegaMenu = {
  types: [
    { href: "/restaurace?type=vegan", label: "Veganské", icon: Leaf, color: "text-emerald-600", desc: "100% rostlinná jídla" },
    { href: "/restaurace?type=vegetarian", label: "Vegetariánské", icon: Salad, color: "text-green-600", desc: "Bez masa, s mlékem/vejci" },
    { href: "/restaurace?type=friendly", label: "Vegan-friendly", icon: Sprout, color: "text-teal-600", desc: "Bohatá veganská nabídka" },
    { href: "/restaurace?type=fastfood", label: "Fast Food", icon: Flame, color: "text-orange-500", desc: "Rychlé bezmasé možnosti" },
  ],
  districts: [
    { href: "/restaurace?district=Praha 1", label: "Praha 1" },
    { href: "/restaurace?district=Praha 2", label: "Praha 2" },
    { href: "/restaurace?district=Praha 3", label: "Praha 3 — Žižkov" },
    { href: "/restaurace?district=Praha 7", label: "Praha 7 — Holešovice" },
    { href: "/restaurace?district=Vinohrady", label: "Vinohrady" },
    { href: "/restaurace?district=Malá Strana", label: "Malá Strana" },
  ],
  quickLinks: [
    { href: "/restaurace?sort=rating", label: "Nejlépe hodnocené", icon: Star },
    { href: "/restaurace?sort=reviews", label: "Nejpopulárnější", icon: TrendingUp },
    { href: "/mapa", label: "Zobrazit na mapě", icon: MapPin },
    { href: "/restaurace?dietary=bezlepkové", label: "Bezlepkové", icon: Wheat },
  ],
  featured: {
    name: "Shromaždiště",
    desc: "Veganský gastropub v Žižkově — česká klasika v rostlinné verzi",
    href: "/restaurace/shromazdistepraha",
    badge: "⭐ 5.0",
  },
};

const receptyMegaMenu = {
  categories: [
    { href: "/recepty?cat=Hlavní jídla", label: "Hlavní jídla", icon: Utensils, desc: "Svíčková, guláš, rizoto..." },
    { href: "/recepty?cat=Polévky", label: "Polévky", icon: Coffee, desc: "Čočková, špenátová, květáková..." },
    { href: "/recepty?cat=Saláty a misky", label: "Saláty & misky", icon: Salad, desc: "Buddha bowl, saláty..." },
    { href: "/recepty?cat=Dezerty", label: "Dezerty", icon: Star, desc: "Brownies, cheesecake, bábovka..." },
    { href: "/recepty?cat=Snídaně", label: "Snídaně", icon: Clock, desc: "Smoothie bowl, palačinky..." },
    { href: "/recepty?cat=Pečení", label: "Pečení", icon: Flame, desc: "Chačapuri, lobiani, štrůdl..." },
  ],
  dietary: [
    { href: "/recepty?dietary=vegan", label: "Veganské", color: "bg-emerald-100 text-emerald-700" },
    { href: "/recepty?dietary=vegetarian", label: "Vegetariánské", color: "bg-green-100 text-green-700" },
    { href: "/recepty?dietary=bezlepkove", label: "Bezlepkové", color: "bg-amber-100 text-amber-700" },
    { href: "/recepty?dietary=keto", label: "Keto", color: "bg-purple-100 text-purple-700" },
  ],
  cuisines: [
    { href: "/recepty?cuisine=česká", label: "Česká kuchyně" },
    { href: "/recepty?cuisine=italská", label: "Italská" },
    { href: "/recepty?cuisine=asijská", label: "Asijská" },
    { href: "/recepty?cuisine=gruzínská", label: "Gruzínská" },
    { href: "/recepty?cuisine=mexická", label: "Mexická" },
    { href: "/recepty?cuisine=indická", label: "Indická" },
  ],
  featured: {
    name: "Adžarský chačapuri",
    desc: "Gruzínský chlebový člun se sýrem a žloutkem — trendy recept roku 2026",
    href: "/recepty/adzarsky-khachapuri",
    badge: "🔥 Trending",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/khachapuri-adjarsky-1-NvBcPLYARE4yt6W5ZF6pmt.webp",
  },
};

// ── Component ───────────────────────────────────────────────

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<"restaurace" | "recepty" | null>(null);
  const [location] = useLocation();
  const { favoriteRestaurants, favoriteRecipes } = useFavorites();
  const totalFavorites = favoriteRestaurants.length + favoriteRecipes.length;
  const { user, isAuthenticated, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setActiveMega(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    window.location.href = "/";
  };

  const handleMegaEnter = (key: "restaurace" | "recepty") => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    setActiveMega(key);
  };

  const handleMegaLeave = () => {
    megaTimerRef.current = setTimeout(() => setActiveMega(null), 150);
  };

  const handleMegaContentEnter = () => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
  };

  const navLinks = [
    { href: "/mapa", label: "Mapa" },
    { href: "/blog", label: "Blog" },
    { href: "/o-nas", label: "O nás" },
    { href: "/kontakt", label: "Kontakt" },
    { href: "/inzerce", label: "Inzerce" },
  ];

  return (
    <>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <FavoritesPanel open={favoritesOpen} onClose={() => setFavoritesOpen(false)} />
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-emerald-100 shadow-sm">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Tagline */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center group">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/logo-cropped_d7cd6ecf.png"
                  alt="bezmasá jídla — průvodce bezmasou Prahou"
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain logo-animated group-hover:opacity-90"
                />
              </Link>
              <p className="hidden sm:block text-sm text-emerald-700/60 font-light italic tracking-wide" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Pro zdraví, pro planetu.
              </p>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1" ref={megaRef}>
              {/* Restaurace mega trigger */}
              <div
                className="relative"
                onMouseEnter={() => handleMegaEnter("restaurace")}
                onMouseLeave={handleMegaLeave}
              >
                <button
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeMega === "restaurace" || location.startsWith("/restaurace")
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  Restaurace
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMega === "restaurace" ? "rotate-180" : ""}`} />
                </button>

                {/* Restaurace Mega Menu */}
                {activeMega === "restaurace" && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-[680px] bg-white rounded-2xl border border-emerald-100 shadow-2xl z-50 overflow-hidden"
                    onMouseEnter={handleMegaContentEnter}
                    onMouseLeave={handleMegaLeave}
                  >
                    <div className="grid grid-cols-3 gap-0">
                      {/* Col 1: Typy */}
                      <div className="p-5 border-r border-emerald-50">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">Typ restaurace</p>
                        <div className="space-y-1">
                          {restauraceMegaMenu.types.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setActiveMega(null)}
                              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50 transition-colors group"
                            >
                              <item.icon className={`w-4 h-4 mt-0.5 ${item.color} shrink-0`} />
                              <div>
                                <div className="text-sm font-semibold text-gray-800 group-hover:text-emerald-700">{item.label}</div>
                                <div className="text-xs text-gray-400">{item.desc}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Col 2: Čtvrti + Rychlé filtry */}
                      <div className="p-5 border-r border-emerald-50">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">Pražské čtvrti</p>
                        <div className="space-y-1 mb-4">
                          {restauraceMegaMenu.districts.map((d) => (
                            <Link
                              key={d.href}
                              href={d.href}
                              onClick={() => setActiveMega(null)}
                              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 text-sm text-gray-600 hover:text-emerald-700 transition-colors"
                            >
                              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                              {d.label}
                            </Link>
                          ))}
                          <Link
                            href="/restaurace"
                            onClick={() => setActiveMega(null)}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                          >
                            Všechny čtvrti →
                          </Link>
                        </div>
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Rychlé filtry</p>
                        <div className="space-y-1">
                          {restauraceMegaMenu.quickLinks.map((q) => (
                            <Link
                              key={q.href}
                              href={q.href}
                              onClick={() => setActiveMega(null)}
                              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 text-sm text-gray-600 hover:text-emerald-700 transition-colors"
                            >
                              <q.icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              {q.label}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Col 3: Featured */}
                      <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">Tip redakce</p>
                        <Link
                          href={restauraceMegaMenu.featured.href}
                          onClick={() => setActiveMega(null)}
                          className="block group"
                        >
                          <div className="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                            <span className="inline-block text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full mb-2">
                              {restauraceMegaMenu.featured.badge}
                            </span>
                            <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-1">
                              {restauraceMegaMenu.featured.name}
                            </h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                              {restauraceMegaMenu.featured.desc}
                            </p>
                          </div>
                        </Link>
                        <div className="mt-4">
                          <Link
                            href="/restaurace"
                            onClick={() => setActiveMega(null)}
                            className="block w-full text-center bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
                          >
                            Všechny restaurace
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* VEG Recepty mega trigger */}
              <div
                className="relative"
                onMouseEnter={() => handleMegaEnter("recepty")}
                onMouseLeave={handleMegaLeave}
              >
                <button
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeMega === "recepty" || location.startsWith("/recepty")
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  VEG Recepty
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMega === "recepty" ? "rotate-180" : ""}`} />
                </button>

                {/* VEG Recepty Mega Menu */}
                {activeMega === "recepty" && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-[680px] bg-white rounded-2xl border border-emerald-100 shadow-2xl z-50 overflow-hidden"
                    onMouseEnter={handleMegaContentEnter}
                    onMouseLeave={handleMegaLeave}
                  >
                    <div className="grid grid-cols-3 gap-0">
                      {/* Col 1: Kategorie */}
                      <div className="p-5 border-r border-emerald-50">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">Kategorie</p>
                        <div className="space-y-1">
                          {receptyMegaMenu.categories.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setActiveMega(null)}
                              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50 transition-colors group"
                            >
                              <item.icon className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                              <div>
                                <div className="text-sm font-semibold text-gray-800 group-hover:text-emerald-700">{item.label}</div>
                                <div className="text-xs text-gray-400">{item.desc}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Col 2: Dietní filtry + Kuchyně */}
                      <div className="p-5 border-r border-emerald-50">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">Dietní preference</p>
                        <div className="flex flex-wrap gap-2 mb-5">
                          {receptyMegaMenu.dietary.map((d) => (
                            <Link
                              key={d.href}
                              href={d.href}
                              onClick={() => setActiveMega(null)}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-opacity hover:opacity-80 ${d.color}`}
                            >
                              {d.label}
                            </Link>
                          ))}
                        </div>
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">Kuchyně světa</p>
                        <div className="space-y-1">
                          {receptyMegaMenu.cuisines.map((c) => (
                            <Link
                              key={c.href}
                              href={c.href}
                              onClick={() => setActiveMega(null)}
                              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 text-sm text-gray-600 hover:text-emerald-700 transition-colors"
                            >
                              <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
                              {c.label}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Col 3: Featured */}
                      <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50">
                        <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3">Recept týdne</p>
                        <Link
                          href={receptyMegaMenu.featured.href}
                          onClick={() => setActiveMega(null)}
                          className="block group"
                        >
                          <div className="bg-white rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            {receptyMegaMenu.featured.image && (
                              <img
                                src={receptyMegaMenu.featured.image}
                                alt={receptyMegaMenu.featured.name}
                                className="w-full h-28 object-cover"
                              />
                            )}
                            <div className="p-3">
                              <span className="inline-block text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full mb-2">
                                {receptyMegaMenu.featured.badge}
                              </span>
                              <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-1">
                                {receptyMegaMenu.featured.name}
                              </h4>
                              <p className="text-xs text-gray-500 leading-relaxed">
                                {receptyMegaMenu.featured.desc}
                              </p>
                            </div>
                          </div>
                        </Link>
                        <div className="mt-4 space-y-2">
                          <Link
                            href="/recepty"
                            onClick={() => setActiveMega(null)}
                            className="block w-full text-center bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
                          >
                            Všechny recepty
                          </Link>
                          <Link
                            href="/pridat-recept"
                            onClick={() => setActiveMega(null)}
                            className="block w-full text-center border border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-sm font-medium py-2 px-4 rounded-xl transition-colors"
                          >
                            + Přidat svůj recept
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Regular nav links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location === link.href
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                aria-label="Otevřít vyhledávání"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFavoritesOpen(true)}
                className="relative p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Zobrazit oblíbené"
              >
                <Heart className={`w-4 h-4 ${totalFavorites > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                {totalFavorites > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalFavorites > 9 ? '9+' : totalFavorites}
                  </span>
                )}
              </button>

              {/* Auth: User menu or Login button */}
              {isAuthenticated && user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`relative flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${
                      userMenuOpen
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-500 hover:text-emerald-700 hover:bg-emerald-50"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-sm font-medium max-w-[100px] truncate hidden lg:block">
                      {user.name || "Profil"}
                    </span>
                    {totalFavorites > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {totalFavorites > 9 ? "9+" : totalFavorites}
                      </span>
                    )}
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl border border-emerald-100 shadow-lg py-1 z-50">
                      <div className="px-4 py-2 border-b border-emerald-50">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name || "Uživatel"}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email || ""}</p>
                      </div>
                      <Link href="/profil" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <User className="w-4 h-4" /> Můj profil
                      </Link>
                      <Link href="/profil?tab=favorites" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <Heart className="w-4 h-4" /> Oblíbené
                        {totalFavorites > 0 && (
                          <span className="ml-auto text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">{totalFavorites}</span>
                        )}
                      </Link>
                      <Link href="/profil?tab=reviews" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <Star className="w-4 h-4" /> Moje recenze
                      </Link>
                      <Link href="/profil?tab=recipes" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <ChefHat className="w-4 h-4" /> Moje recepty
                      </Link>
                      <Link href="/pridat-recept" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <BookOpen className="w-4 h-4" /> Přidat recept
                      </Link>
                      {user.role === "admin" && (
                        <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-amber-700 hover:bg-amber-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <Shield className="w-4 h-4" /> Administrace
                        </Link>
                      )}
                      <div className="border-t border-emerald-50 mt-1">
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                          <LogOut className="w-4 h-4" /> Odhlásit se
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/profil">
                    <button
                      className={`relative p-2 rounded-lg transition-colors ${
                        location === "/profil"
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-gray-500 hover:text-emerald-700 hover:bg-emerald-50"
                      }`}
                      title="Můj profil a oblíbené"
                    >
                      <User className="w-4 h-4" />
                      {totalFavorites > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {totalFavorites > 9 ? "9+" : totalFavorites}
                        </span>
                      )}
                    </button>
                  </Link>
                  <a href={getLoginUrl()}>
                    <Button size="sm" className="bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-medium">
                      Přihlásit se
                    </Button>
                  </a>
                </>
              )}
            </div>

            {/* Mobile Top Bar */}
            <div className="md:hidden flex items-center gap-2">
              {isAuthenticated && user ? (
                <Link href="/profil">
                  <button className="relative p-1.5 rounded-full bg-emerald-100 text-emerald-700">
                    <span className="text-xs font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                    </span>
                  </button>
                </Link>
              ) : (
                <Link href="/profil">
                  <button className="relative p-2 text-gray-600 hover:text-emerald-700 rounded-lg">
                    <User className="w-5 h-5" />
                    {totalFavorites > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {totalFavorites > 9 ? "9+" : totalFavorites}
                      </span>
                    )}
                  </button>
                </Link>
              )}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-emerald-700 rounded-lg"
                aria-label="Hledat"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setFavoritesOpen(true)}
                className="relative p-2 text-gray-600 hover:text-red-500 rounded-lg transition-colors"
                aria-label="Zobrazit oblíbené"
              >
                <Heart className={`w-5 h-5 ${totalFavorites > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                {totalFavorites > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalFavorites > 9 ? '9+' : totalFavorites}
                  </span>
                )}
              </button>
              <button
                className="p-2 text-gray-600 hover:text-emerald-700 rounded-lg"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden border-t border-emerald-100" style={{ maxHeight: 'calc(100dvh - 64px)', overflowY: 'auto' }}>
              <nav className="flex flex-col py-2">
                {/* Search */}
                <button
                  onClick={() => { setMenuOpen(false); setSearchOpen(true); }}
                  className="mx-2 px-3 py-2 text-sm text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-emerald-500 shrink-0" />
                  Hledat…
                </button>

                {/* Restaurace */}
                <div className="mx-2 mt-1">
                  <p className="px-3 py-1 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Restaurace</p>
                  <div className="grid grid-cols-2">
                    {restauraceMegaMenu.types.map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-emerald-50 text-sm text-gray-700">
                        <item.icon className={`w-3.5 h-3.5 shrink-0 ${item.color}`} />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                  <Link href="/restaurace" onClick={() => setMenuOpen(false)}
                    className="px-3 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg block">
                    Všechny restaurace →
                  </Link>
                </div>

                {/* VEG Recepty */}
                <div className="mx-2 mt-1 pt-2 border-t border-emerald-50">
                  <p className="px-3 py-1 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">VEG Recepty</p>
                  <div className="grid grid-cols-2">
                    {receptyMegaMenu.categories.slice(0, 4).map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-emerald-50 text-sm text-gray-700">
                        <item.icon className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                  <Link href="/recepty" onClick={() => setMenuOpen(false)}
                    className="px-3 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg block">
                    Všechny recepty →
                  </Link>
                </div>

                {/* Other links */}
                <div className="mx-2 mt-1 pt-2 border-t border-emerald-50 grid grid-cols-3">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                      className="px-3 py-2 text-sm text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg text-center">
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Oblíbené + Auth */}
                <div className="mx-2 mt-1 pt-2 border-t border-emerald-50">
                  <button onClick={() => { setMenuOpen(false); setFavoritesOpen(true); }}
                    className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 rounded-lg flex items-center gap-2">
                    <Heart className={`w-4 h-4 shrink-0 ${totalFavorites > 0 ? 'fill-red-500 text-red-500' : 'text-red-400'}`} />
                    Oblíbené
                    {totalFavorites > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{totalFavorites}</span>
                    )}
                  </button>
                  {isAuthenticated && user ? (
                    <>
                      <Link href="/pridat-recept" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 rounded-lg">
                        <ChefHat className="w-4 h-4 text-emerald-600 shrink-0" /> Přidat recept
                      </Link>
                      {user.role === "admin" && (
                        <Link href="/admin" onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-amber-700 hover:bg-amber-50 rounded-lg">
                          <Shield className="w-4 h-4 shrink-0" /> Administrace
                        </Link>
                      )}
                      <button onClick={() => { setMenuOpen(false); handleLogout(); }}
                        className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg text-left flex items-center gap-2">
                        <LogOut className="w-4 h-4 shrink-0" /> Odhlásit se
                      </button>
                    </>
                  ) : (
                    <div className="px-2 py-2">
                      <a href={getLoginUrl()}>
                        <Button className="w-full bg-emerald-700 hover:bg-emerald-600 text-white" size="sm">
                          Přihlásit se
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
