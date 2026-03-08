// ============================================================
// BEZMASAJIDLA.CZ — Header Component
// "Zelená Metropole" — sticky nav, emerald brand, DM Serif logo
// Includes auth (login/logout) and profile icon with favorites count
// ============================================================

import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Search, Heart, User, LogOut, ChefHat, BookOpen, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [location] = useLocation();
  const { favoriteRestaurants, favoriteRecipes } = useFavorites();
  const totalFavorites = favoriteRestaurants.length + favoriteRecipes.length;
  const { user, isAuthenticated, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/restaurace", label: "Restaurace" },
    { href: "/recepty", label: "Recepty" },
    { href: "/mapa", label: "Mapa" },
    { href: "/o-nas", label: "O nás" },
  ];

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-emerald-100 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo — Variant A: fork+leaf wordmark */}
          <Link href="/" className="flex items-center group">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/logo-cropped_d7cd6ecf.png"
              alt="bezmasá jídla — průvodce bezmasou Prahou"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain logo-animated group-hover:opacity-90"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
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
            <button className="p-2 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors">
              <Search className="w-4 h-4" />
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

                {/* Dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl border border-emerald-100 shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-emerald-50">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name || "Uživatel"}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email || ""}</p>
                    </div>
                    <Link
                      href="/profil"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Můj profil
                    </Link>
                    <Link
                      href="/profil?tab=favorites"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Heart className="w-4 h-4" />
                      Oblíbené
                      {totalFavorites > 0 && (
                        <span className="ml-auto text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">
                          {totalFavorites}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/profil?tab=reviews"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Star className="w-4 h-4" />
                      Moje recenze
                    </Link>
                    <Link
                      href="/profil?tab=recipes"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <ChefHat className="w-4 h-4" />
                      Moje recepty
                    </Link>
                    <Link
                      href="/pridat-recept"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <BookOpen className="w-4 h-4" />
                      Přidat recept
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Shield className="w-4 h-4" />
                        Administrace
                      </Link>
                    )}
                    <div className="border-t border-emerald-50 mt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Odhlásit se
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Profile / Favorites icon (for non-logged in users with localStorage favorites) */}
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
                  <Button
                    size="sm"
                    className="bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-medium"
                  >
                    Přihlásit se
                  </Button>
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile profile icon */}
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
              className="p-2 text-gray-600 hover:text-emerald-700 rounded-lg"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-emerald-100">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/profil"
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <Heart className="w-4 h-4 text-red-400" />
                Moje oblíbené
                {totalFavorites > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {totalFavorites}
                  </span>
                )}
              </Link>
              {isAuthenticated && user ? (
                <>
                  <Link
                    href="/pridat-recept"
                    className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <ChefHat className="w-4 h-4 text-emerald-600" />
                    Přidat recept
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="px-4 py-3 text-sm font-medium text-amber-700 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors flex items-center gap-2"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4" />
                      Administrace
                    </Link>
                  )}
                  <div className="pt-2 border-t border-emerald-100 mt-2">
                    <button
                      onClick={() => { setMenuOpen(false); handleLogout(); }}
                      className="w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Odhlásit se ({user.name || "Uživatel"})
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-2 border-t border-emerald-100 mt-2">
                  <a href={getLoginUrl()}>
                    <Button className="w-full bg-emerald-700 hover:bg-emerald-600 text-white">
                      Přihlásit se
                    </Button>
                  </a>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
