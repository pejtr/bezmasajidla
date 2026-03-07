// ============================================================
// BEZMASAJIDLA.CZ — 404 Not Found Page
// "Zelená Metropole" design system
// ============================================================

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF6]">
      <Header />
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="text-center max-w-md px-4">
          <div className="text-7xl mb-6">🌿</div>
          <h1
            className="text-4xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Stránka nenalezena
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Tato stránka neexistuje nebo byla přesunuta. Zkus se vrátit na hlavní stránku nebo prohledat naši databázi restaurací.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button className="bg-emerald-700 hover:bg-emerald-600 text-white px-8">
                Zpět na hlavní stránku
              </Button>
            </Link>
            <Link href="/restaurace">
              <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-8">
                Procházet restaurace
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
