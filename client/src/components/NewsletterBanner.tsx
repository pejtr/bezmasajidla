// ============================================================
// BEZMASAJIDLA.CZ — Newsletter Banner Component
// "Zelená Metropole" — shown only once per session
// Prague skyline silhouette (Pražský hrad + Karlův most) at top
// ============================================================

import { useState, useEffect } from "react";
import { X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/** Prague skyline silhouette — Pražský hrad, Karlův most, věže */
function PragueSkyline() {
  return (
    <svg
      viewBox="0 0 500 60"
      preserveAspectRatio="none"
      className="w-full h-10 block"
      aria-hidden="true"
    >
      {/* Sky / transparent top */}
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#065f46" stopOpacity="0" />
          <stop offset="100%" stopColor="#065f46" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect width="500" height="60" fill="url(#skyGrad)" />

      {/* Silhouette path — Prague Castle, St. Vitus, Charles Bridge towers, Old Town */}
      <path
        d="
          M0,60
          L0,48
          L15,48 L15,44 L20,44 L20,42 L25,42 L25,44 L30,44 L30,48
          L50,48 L50,45 L55,45 L55,42 L58,42 L58,38 L60,38 L60,35
          L62,35 L62,30 L64,28 L66,30 L68,30 L68,35 L70,35 L70,38
          L72,38 L72,42 L75,42 L75,45 L80,45 L80,48
          L95,48
          L95,40 L97,40 L97,36 L99,36 L99,32 L100,30 L101,28
          L102,20 L103,15 L104,12 L105,10 L106,8 L107,10 L108,12
          L109,15 L110,20 L111,28 L112,30 L113,32 L113,36 L115,36
          L115,40 L117,40 L117,48
          L130,48
          L130,42 L132,42 L132,38 L134,36 L135,34 L136,30 L137,26
          L138,22 L138.5,18 L139,14 L139.5,10 L140,7 L140.5,5
          L141,7 L141.5,10 L142,14 L142.5,18 L143,22 L143.5,26
          L144,30 L145,34 L146,36 L148,38 L148,42 L150,42 L150,48
          L165,48
          L165,44 L167,44 L167,40 L169,38 L170,36 L171,34
          L172,30 L172.5,26 L173,22 L173.5,18 L174,15 L174.5,12
          L175,10 L175.5,8 L176,6 L176.5,4 L177,3
          L177.5,4 L178,6 L178.5,8 L179,10 L179.5,12
          L180,15 L180.5,18 L181,22 L181.5,26 L182,30
          L183,34 L184,36 L185,38 L187,40 L187,44 L189,44 L189,48
          L210,48
          L210,44 L212,44 L212,40 L214,40 L214,36 L215,34 L216,32
          L217,28 L218,24 L218.5,20 L219,18 L219,24 L220,28
          L220,32 L221,34 L222,36 L224,40 L224,44 L226,44 L226,48
          L240,48
          L240,46 L242,46 L244,44 L246,44 L248,46 L250,46
          L252,44 L254,44 L256,46 L258,46 L260,44 L262,44
          L264,46 L266,46 L268,44 L270,44 L272,46 L274,46
          L276,44 L278,44 L280,46 L282,46 L284,44 L286,44
          L288,46 L290,46 L292,44 L294,44 L296,46 L298,46
          L300,48
          L300,42 L302,42 L302,38 L303,36 L304,34 L305,30
          L306,26 L306.5,22 L307,18 L307,22 L308,26 L308,30
          L309,34 L310,36 L311,38 L311,42 L313,42 L313,48
          L330,48
          L330,44 L332,44 L332,40 L334,38 L335,36 L336,32
          L337,28 L337.5,24 L338,20 L338.5,16 L339,14
          L339.5,16 L340,20 L340.5,24 L341,28 L342,32
          L343,36 L344,38 L346,40 L346,44 L348,44 L348,48
          L365,48
          L365,44 L367,44 L367,42 L369,42 L369,40 L371,40
          L371,38 L373,36 L374,34 L375,30 L375.5,26 L376,22
          L376.5,18 L377,16 L377.5,18 L378,22 L378.5,26
          L379,30 L380,34 L381,36 L383,38 L383,40 L385,40
          L385,42 L387,42 L387,44 L389,44 L389,48
          L405,48
          L405,46 L408,46 L408,44 L410,44 L410,42 L412,42
          L412,44 L414,44 L414,46 L417,46 L417,48
          L435,48
          L435,46 L437,46 L437,44 L439,44 L439,42 L441,42
          L441,40 L443,38 L444,36 L445,38 L447,40 L447,42
          L449,42 L449,44 L451,44 L451,46 L453,46 L453,48
          L470,48 L470,46 L472,46 L472,44 L474,44 L474,46
          L476,46 L476,48
          L500,48 L500,60 Z
        "
        fill="#065f46"
        opacity="0.5"
      />

      {/* Foreground silhouette — closer buildings */}
      <path
        d="
          M0,60 L0,52
          L30,52 L30,50 L35,50 L35,48 L40,48 L40,50 L45,50 L45,52
          L80,52 L80,50 L85,50 L85,48 L90,48 L90,50 L95,50 L95,52
          L140,52 L140,50 L145,50 L145,52
          L200,52 L200,50 L205,50 L205,48 L210,48 L210,50 L215,50 L215,52
          L260,52 L260,50 L265,50 L265,52
          L320,52 L320,50 L325,50 L325,48 L330,48 L330,50 L335,50 L335,52
          L380,52 L380,50 L385,50 L385,52
          L430,52 L430,50 L435,50 L435,48 L440,48 L440,50 L445,50 L445,52
          L500,52 L500,60 Z
        "
        fill="#065f46"
        opacity="0.25"
      />
    </svg>
  );
}

export default function NewsletterBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show only once per session
    const seen = sessionStorage.getItem("newsletter_seen");
    if (!seen) {
      const timer = setTimeout(() => setVisible(true), 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem("newsletter_seen", "1");
  };

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Děkujeme za přihlášení k odběru novinek!");
    handleDismiss();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4">
      <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-emerald-700">
        {/* Prague skyline silhouette at the top */}
        <div className="bg-emerald-900">
          <PragueSkyline />
        </div>

        {/* Banner content */}
        <div className="bg-emerald-800 p-5 pt-3 relative">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-emerald-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-amber-900" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Novinky ze světa bezmasé Prahy
              </h3>
              <p className="text-emerald-300 text-xs mt-0.5">
                Nové restaurace, recepty a tipy každý týden.
              </p>
            </div>
          </div>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              placeholder="Tvůj e-mail..."
              required
              className="flex-1 bg-emerald-700 border border-emerald-600 text-white placeholder-emerald-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <Button
              type="submit"
              className="bg-amber-400 hover:bg-amber-300 text-amber-900 font-semibold text-sm px-4 rounded-lg"
            >
              Přihlásit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
