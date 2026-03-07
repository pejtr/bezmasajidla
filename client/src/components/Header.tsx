// ============================================================
// BEZMASAJIDLA.CZ — Header Component
// "Zelená Metropole" — sticky nav, emerald brand, DM Serif logo
// ============================================================

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Search, Leaf, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-emerald-600 transition-colors">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-xl font-bold text-emerald-800 leading-none"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              bezmasá<span className="text-emerald-600">jídla</span>
            </span>
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
          <div className="hidden md:flex items-center gap-3">
            <button className="p-2 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <Button
              size="sm"
              className="bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-medium"
            >
              + Přidat restauraci
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-emerald-700 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
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
