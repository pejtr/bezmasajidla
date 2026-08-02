// ============================================================
// BEZMASAJIDLA.CZ — Search Overlay Component
// Full-text search across restaurants and recipes
// Triggered by magnifier icon in header
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { Search, X, MapPin, Clock, ChefHat, ArrowRight } from "lucide-react";
import { restaurants, recipes } from "@/lib/data";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search input
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedQuery(query), 200);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [query]);

  // Focus input when overlay opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery("");
      setDebouncedQuery("");
    }
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const q = debouncedQuery.toLowerCase().trim();

  const matchedRestaurants = q.length >= 2
    ? restaurants
        .filter((r) =>
          r.name.toLowerCase().includes(q) ||
          r.address.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
        )
        .slice(0, 5)
    : [];

  const matchedRecipes = q.length >= 2
    ? recipes
        .filter((r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
        )
        .slice(0, 5)
    : [];

  const hasResults = matchedRestaurants.length > 0 || matchedRecipes.length > 0;
  const showEmpty = q.length >= 2 && !hasResults;

  const handleLinkClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Search panel — slides down from top */}
      <div className="relative z-10 bg-white shadow-2xl max-h-[85vh] flex flex-col">
        {/* Search input row */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-emerald-100">
          <Search className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hledat restauraci nebo recept..."
            className="flex-1 text-base text-gray-900 placeholder-gray-400 bg-transparent outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Zavřít vyhledávání"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1">
          {/* Placeholder when no query */}
          {q.length < 2 && (
            <div className="px-6 py-10 text-center text-gray-400 text-sm">
              Začněte psát pro vyhledávání restaurací a receptů…
            </div>
          )}

          {/* Empty state */}
          {showEmpty && (
            <div className="px-6 py-10 text-center">
              <div className="text-3xl mb-3">🔍</div>
              <p className="text-gray-500 text-sm">
                Nic nenalezeno pro <strong className="text-gray-700">„{query}"</strong>
              </p>
              <p className="text-gray-400 text-xs mt-1">Zkuste jiné klíčové slovo</p>
            </div>
          )}

          {/* Restaurants */}
          {matchedRestaurants.length > 0 && (
            <div className="px-4 sm:px-6 py-4">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Restaurace
              </p>
              <div className="space-y-1">
                {matchedRestaurants.map((r) => (
                  <Link key={r.id} href={`/restaurace/${r.slug}`} onClick={handleLinkClick}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer group">
                      <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={r.image}
                          alt={r.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-emerald-700 truncate">{r.name}</p>
                        <p className="text-xs text-gray-400 truncate">{r.address}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 flex-shrink-0 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
              {matchedRestaurants.length === 5 && (
                <Link href={`/restaurace?q=${encodeURIComponent(query)}`} onClick={handleLinkClick}>
                  <p className="text-xs text-emerald-600 hover:text-emerald-800 mt-2 px-3 cursor-pointer">
                    Zobrazit všechny výsledky →
                  </p>
                </Link>
              )}
            </div>
          )}

          {/* Recipes */}
          {matchedRecipes.length > 0 && (
            <div className="px-4 sm:px-6 py-4 border-t border-gray-50">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5" />
                Recepty
              </p>
              <div className="space-y-1">
                {matchedRecipes.map((r) => (
                  <Link key={r.id} href={`/recepty/${r.slug}`} onClick={handleLinkClick}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-50 transition-colors cursor-pointer group">
                      <img
                        src={r.images?.[0]?.url || r.image}
                        alt={r.title}
                        className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-amber-700 truncate">{r.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {r.prepTime + r.cookTime} min
                          </span>
                          <span>{r.category}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 flex-shrink-0 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
              {matchedRecipes.length === 5 && (
                <Link href={`/recepty?q=${encodeURIComponent(query)}`} onClick={handleLinkClick}>
                  <p className="text-xs text-amber-600 hover:text-amber-800 mt-2 px-3 cursor-pointer">
                    Zobrazit všechny recepty →
                  </p>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
