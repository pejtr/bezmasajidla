// ============================================================
// BEZMASAJIDLA.CZ — Affiliate Transparency Disclosure Badge
// ============================================================

import { Info } from "lucide-react";

interface AffiliateDisclosureProps {
  className?: string;
  short?: boolean;
}

export default function AffiliateDisclosure({ className = "", short = false }: AffiliateDisclosureProps) {
  if (short) {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800/60 bg-emerald-50/80 px-2 py-0.5 rounded-full ${className}`}>
        <Info className="w-3 h-3 text-emerald-600" />
        Partnerský tip
      </span>
    );
  }

  return (
    <div className={`flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-[12px] text-emerald-900/70 leading-relaxed ${className}`}>
      <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
      <p>
        <strong className="text-emerald-950 font-medium">Transparentní partnerství:</strong> Doporučujeme výhradně produkty a zážitky prověřených partnerů. Nákupem přes odkaz podpoříte provoz BezmasáJídla.cz bez jakéhokoliv navýšení vaší ceny.
      </p>
    </div>
  );
}
