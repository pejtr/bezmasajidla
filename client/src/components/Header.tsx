// ============================================================
// BEZMASAJIDLA.CZ — Header Component
// "Zelená Metropole" — sticky nav, emerald brand, DM Serif logo
// Includes profile icon with favorites count badge
// ============================================================

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Search, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/FavoritesContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const { favoriteRestaurants, favoriteRecipes } = useFavorites();
  const totalFavorites = favoriteRestaurants.length + favoriteRecipes.length;

  const navLinks = [
    { href: "/restaurace", label: "Restaurace" },
    { href: "/recepty", label: "Recepty" },
    { href: "/mapa", label: "Mapa" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-emerald-100 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo — Variant A: fork+leaf wordmark */}
          <Link href="/" className="flex items-center group">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663032296198/Aob2jK5cbkwX7S9ZSrk5FR/logo-cropped_d7cd6ecf.png"
              alt="bezmasá jídla — průvodce bezmasou Prahou"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-opacity group-hover:opacity-80"
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

            {/* Profile / Favorites icon */}
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

            <Button
              size="sm"
              className="bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-medium"
            >
              + Přidat restauraci
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile profile icon */}
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
              <div className="pt-2 border-t border-emerald-100 mt-2">
                <Button className="w-full bg-emerald-700 hover:bg-emerald-600 text-white">
                  + Přidat restauraci
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
