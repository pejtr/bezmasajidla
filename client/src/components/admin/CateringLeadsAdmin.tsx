// ============================================================
// BEZMASAJIDLA.CZ — Catering Sales Ops & Profit Gate v2 CRM Dashboard
// MATOUŠ MATĚJ × BEZMASÁJÍDLA.CZ
// Layered Contributions, Matouš Economics & Sales Lifecycle Statuses
// ============================================================

import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  AlertTriangle,
  ChevronRight,
  Filter,
  BarChart2,
  Calendar,
  Phone,
  Mail,
  Search,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export type CateringStatus =
  | "NEW"
  | "CONTACTED"
  | "OFFER_SENT"
  | "WON"
  | "CONFIRMED"
  | "COMPLETED"
  | "SETTLED"
  | "LOST";

interface CateringLeadRecord {
  id: number;
  leadCode: string;
  status: CateringStatus;
  lostReason?: string;
  isTest?: boolean;
  name: string;
  email: string;
  phone: string;
  eventDate?: string;
  notes?: string;
  packageId: string;
  packageName: string;
  guestCount: number;
  includeDrinks: boolean;
  includeGlassware: boolean;
  includeStaff: boolean;
  estimatedRevenue: number;
  bookedRevenue?: number;
  realizedRevenue?: number;
  paidRevenue?: number;
  finalRevenue?: number;

  foodCost?: number;
  chefFee?: number;
  chefRoyalty?: number;
  chefTotalCost?: number;
  staffCost?: number;
  transportCost?: number;
  equipmentCost?: number;
  marketingCost?: number;
  otherCost?: number;

  grossContribution?: number;
  acquisitionContribution?: number;
  netEventContribution?: number;
  contribution?: number;
  marginPct?: number;

  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  landingPage?: string;
  firstContactAt?: string;
  offerSentAt?: string;
  wonAt?: string;
  completedAt?: string;
  settledAt?: string;
  createdAt: string;
}

export default function CateringLeadsAdmin() {
  const [leads, setLeads] = useState<CateringLeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLead, setEditingLead] = useState<CateringLeadRecord | null>(null);

  // Financial Entry Form State
  const [editStatus, setEditStatus] = useState<CateringStatus>("NEW");
  const [editLostReason, setEditLostReason] = useState("");
  const [editFinalRevenue, setEditFinalRevenue] = useState<number>(0);
  const [editFoodCost, setEditFoodCost] = useState<number>(0);
  const [editChefFee, setEditChefFee] = useState<number>(0);
  const [editChefRoyalty, setEditChefRoyalty] = useState<number>(0);
  const [editStaffCost, setEditStaffCost] = useState<number>(0);
  const [editTransportCost, setEditTransportCost] = useState<number>(0);
  const [editEquipmentCost, setEditEquipmentCost] = useState<number>(0);
  const [editMarketingCost, setEditMarketingCost] = useState<number>(0);
  const [editOtherCost, setEditOtherCost] = useState<number>(0);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/catering-leads");
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error("Failed to fetch catering leads", err);
      toast.error("Nepodařilo se načíst poptávky cateringu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleOpenEdit = (lead: CateringLeadRecord) => {
    setEditingLead(lead);
    setEditStatus(lead.status);
    setEditLostReason(lead.lostReason || "");
    setEditFinalRevenue(lead.finalRevenue || lead.estimatedRevenue);
    setEditFoodCost(lead.foodCost || 0);
    setEditChefFee(lead.chefFee || 0);
    setEditChefRoyalty(lead.chefRoyalty || 0);
    setEditStaffCost(lead.staffCost || 0);
    setEditTransportCost(lead.transportCost || 0);
    setEditEquipmentCost(lead.equipmentCost || 0);
    setEditMarketingCost(lead.marketingCost || 0);
    setEditOtherCost(lead.otherCost || 0);
  };

  const handleSaveFinancials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;

    try {
      const payload = {
        leadCode: editingLead.leadCode,
        status: editStatus,
        lostReason: editLostReason,
        finalRevenue: editFinalRevenue,
        foodCost: editFoodCost,
        chefFee: editChefFee,
        chefRoyalty: editChefRoyalty,
        staffCost: editStaffCost,
        transportCost: editTransportCost,
        equipmentCost: editEquipmentCost,
        marketingCost: editMarketingCost,
        otherCost: editOtherCost,
      };

      const res = await fetch("/api/admin/catering-leads/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Finanční rozpad uložen. Čistá marže: ${data.marginPct}%`);
        setEditingLead(null);
        fetchLeads();
      } else {
        toast.error(data.error || "Chyba při ukládání.");
      }
    } catch (err) {
      toast.error("Nepodařilo se připojit k serveru.");
    }
  };

  // Exclude synthetic test leads from business KPIs
  const realLeads = leads.filter((l) => !l.isTest);
  const totalLeads = realLeads.length;
  const wonLeads = realLeads.filter((l) => ["WON", "CONFIRMED", "COMPLETED", "SETTLED"].includes(l.status));
  const totalEstimatedRev = realLeads.reduce((sum, l) => sum + (l.estimatedRevenue || 0), 0);
  const totalWonRev = wonLeads.reduce((sum, l) => sum + (l.finalRevenue || l.estimatedRevenue || 0), 0);
  const totalWonNetContribution = wonLeads.reduce((sum, l) => sum + (l.netEventContribution || l.contribution || 0), 0);
  const avgWonMarginPct = totalWonRev > 0 ? ((totalWonNetContribution / totalWonRev) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-8">
      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Reálné Poptávky
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-gray-900">{totalLeads}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {wonLeads.length} uzavřeno
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Pipeline Potenciál (CZK)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-gray-900">
              {totalEstimatedRev.toLocaleString("cs-CZ")} Kč
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Uzavřené Tržby (WON/SETTLED)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">
              {totalWonRev.toLocaleString("cs-CZ")} Kč
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Čistá Marže (Net Contribution %)
          </span>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-black ${Number(avgWonMarginPct) >= 25 ? "text-emerald-600" : "text-amber-600"}`}>
              {avgWonMarginPct}%
            </span>
            <span className="text-[10px] text-gray-400">Target ≥ 25%</span>
          </div>
        </div>
      </div>

      {/* Catering Leads List Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Catering Sales Ops & Profit Gate v2 CRM</h3>
            <p className="text-xs text-gray-500">
              Matouš Matěj × BezmasáJídla.cz — Řízení obchodního cyklu, Matouš-ekonomika & vrstvené marže
            </p>
          </div>
          <button
            onClick={fetchLeads}
            className="text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold px-3 py-1.5 rounded-xl transition-colors"
          >
            Obnovit
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-gray-400">Načítám poptávky cateringu...</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500">
            Zatím nebyly zaznamenány žádné poptávky. Vyzkoušejte kalkulačku na <a href="/catering" target="_blank" className="text-emerald-600 underline">/catering</a>.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th className="p-4">Kód & Stav</th>
                  <th className="p-4">Zákazník & Kontakt</th>
                  <th className="p-4">Balíček & Hosté</th>
                  <th className="p-4">Odhad Tržeb</th>
                  <th className="p-4">Čistá Marže (Net)</th>
                  <th className="p-4">UTM Zdroj</th>
                  <th className="p-4 text-right font-bold">Akce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead) => {
                  const hasProfitData = lead.finalRevenue !== undefined && lead.finalRevenue > 0;
                  const marginPct = lead.marginPct || 0;
                  const isMarginOk = marginPct >= 25;

                  return (
                    <tr key={lead.leadCode} className={`hover:bg-gray-50/60 transition-colors ${lead.isTest ? "bg-amber-50/30" : ""}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-mono text-[11px] font-bold text-gray-800">
                            {lead.leadCode}
                          </span>
                          {lead.isTest && (
                            <span className="bg-amber-200 text-amber-900 text-[9px] font-black px-1.5 py-0.5 rounded-sm">
                              CANARY TEST
                            </span>
                          )}
                        </div>
                        <span
                          className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                            ["WON", "CONFIRMED", "COMPLETED", "SETTLED"].includes(lead.status)
                              ? "bg-emerald-100 text-emerald-800"
                              : lead.status === "OFFER_SENT" || lead.status === "CONTACTED"
                              ? "bg-blue-100 text-blue-800"
                              : lead.status === "LOST"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-gray-900 block">{lead.name}</span>
                        <span className="text-gray-500 block">{lead.email}</span>
                        <span className="text-gray-500">{lead.phone}</span>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-emerald-800 block">{lead.packageName}</span>
                        <span className="text-gray-500">{lead.guestCount} osob</span>
                        {lead.eventDate && <span className="text-gray-400 block text-[10px]">Termín: {lead.eventDate}</span>}
                      </td>

                      <td className="p-4 font-bold text-gray-900">
                        {lead.estimatedRevenue.toLocaleString("cs-CZ")} Kč
                      </td>

                      <td className="p-4">
                        {hasProfitData ? (
                          <div>
                            <span className="font-bold text-gray-900 block">
                              {(lead.finalRevenue || 0).toLocaleString("cs-CZ")} Kč
                            </span>
                            <span
                              className={`text-[11px] font-extrabold inline-flex items-center gap-1 ${
                                isMarginOk ? "text-emerald-700" : "text-red-600"
                              }`}
                            >
                              <span>Čistá marže: {marginPct}%</span>
                              {isMarginOk ? "🟢" : "⚠️"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Čeká na zadání rozpadu</span>
                        )}
                      </td>

                      <td className="p-4 text-gray-500 text-[11px]">
                        <span>{lead.utmSource || "Direct"}</span>
                        {lead.utmMedium && <span className="text-gray-400 block">/ {lead.utmMedium}</span>}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleOpenEdit(lead)}
                          className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs px-3 py-1.5 rounded-xl transition-colors"
                        >
                          Spravovat Obchod & Náklady
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Financial Entry Modal */}
      {editingLead && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Profit Gate v2 Engine Entry</span>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingLead.leadCode} — {editingLead.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingLead(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFinancials} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stav Obchodního Cyklu (Sales Ops) *</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-semibold"
                  >
                    <option value="NEW">NEW (Nová Poptávka)</option>
                    <option value="CONTACTED">CONTACTED (Kontaktováno)</option>
                    <option value="OFFER_SENT">OFFER_SENT (Nabídka Odeslána)</option>
                    <option value="WON">WON (Vyhráno / Potvrzeno)</option>
                    <option value="CONFIRMED">CONFIRMED (Záloha Zaplacena)</option>
                    <option value="COMPLETED">COMPLETED (Akce Odservírována)</option>
                    <option value="SETTLED">SETTLED (Vyúčtováno & Zaplaceno)</option>
                    <option value="LOST">LOST (Stornováno / Ztraceno)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Finální Realizovaná Cena (Kč) *</label>
                  <input
                    type="number"
                    value={editFinalRevenue}
                    onChange={(e) => setEditFinalRevenue(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-bold text-emerald-700"
                  />
                </div>
              </div>

              {editStatus === "LOST" && (
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Důvod Ztráty Zakázky (Lost Reason)</label>
                  <input
                    type="text"
                    placeholder="Např. vysoká cena, plný termín, jiný dodavatel..."
                    value={editLostReason}
                    onChange={(e) => setEditLostReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300"
                  />
                </div>
              )}

              {/* Matouš Economics */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                <span className="block font-bold text-amber-900 mb-2 uppercase tracking-wider text-[11px]">
                  👨‍🍳 Matouš Matěj Ekonomika
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 mb-0.5">Matouš Fixní Fee (Kč)</label>
                    <input
                      type="number"
                      value={editChefFee}
                      onChange={(e) => setEditChefFee(parseInt(e.target.value) || 0)}
                      className="w-full p-2 rounded-lg border border-gray-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-0.5">Matouš Royalty (% z tržby)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={editChefRoyalty}
                      onChange={(e) => setEditChefRoyalty(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 rounded-lg border border-gray-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Direct Costs Breakdown */}
              <div className="pt-2 border-t border-gray-100">
                <span className="block font-bold text-gray-900 mb-2 uppercase tracking-wider text-[11px]">
                  Rozpad Přímých Nákladů Akce (Kč)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-600 mb-0.5">Suroviny (Food cost)</label>
                    <input
                      type="number"
                      value={editFoodCost}
                      onChange={(e) => setEditFoodCost(parseInt(e.target.value) || 0)}
                      className="w-full p-2 rounded-lg border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-0.5">Obsluha & Servis</label>
                    <input
                      type="number"
                      value={editStaffCost}
                      onChange={(e) => setEditStaffCost(parseInt(e.target.value) || 0)}
                      className="w-full p-2 rounded-lg border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-0.5">Doprava & Logistika</label>
                    <input
                      type="number"
                      value={editTransportCost}
                      onChange={(e) => setEditTransportCost(parseInt(e.target.value) || 0)}
                      className="w-full p-2 rounded-lg border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-0.5">Inventář & Porcelán</label>
                    <input
                      type="number"
                      value={editEquipmentCost}
                      onChange={(e) => setEditEquipmentCost(parseInt(e.target.value) || 0)}
                      className="w-full p-2 rounded-lg border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-0.5">Marketing (Acquisition)</label>
                    <input
                      type="number"
                      value={editMarketingCost}
                      onChange={(e) => setEditMarketingCost(parseInt(e.target.value) || 0)}
                      className="w-full p-2 rounded-lg border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-0.5">Ostatní náklady</label>
                    <input
                      type="number"
                      value={editOtherCost}
                      onChange={(e) => setEditOtherCost(parseInt(e.target.value) || 0)}
                      className="w-full p-2 rounded-lg border border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Calculated Preview Box */}
              {(() => {
                const chefTot = editChefFee + Math.round(editFinalRevenue * (editChefRoyalty / 100));
                const direct = editFoodCost + chefTot + editStaffCost + editTransportCost + editEquipmentCost;
                const grossContr = editFinalRevenue - direct;
                const acqContr = grossContr - editMarketingCost;
                const netContr = acqContr - editOtherCost;
                const margin = editFinalRevenue > 0 ? Number(((netContr / editFinalRevenue) * 100).toFixed(2)) : 0;
                const isTarget = margin >= 25;

                return (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Gross Contribution (Před marketingem):</span>
                      <span className="font-bold">{grossContr.toLocaleString("cs-CZ")} Kč</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Acquisition Contribution (Po marketingu):</span>
                      <span className="font-bold">{acqContr.toLocaleString("cs-CZ")} Kč</span>
                    </div>
                    <div className="flex justify-between text-gray-900 pt-1 border-t border-gray-200 font-bold">
                      <span>Net Event Contribution (Čistý Zisk):</span>
                      <span className="text-emerald-700">{netContr.toLocaleString("cs-CZ")} Kč</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-gray-500">Čistá marže eventu:</span>
                      <span className={`text-base font-black ${isTarget ? "text-emerald-700" : "text-amber-600"}`}>
                        {margin}% {isTarget ? "🟢 (Target ≥25% splněn)" : "⚠️ (Pod cílovou marží)"}
                      </span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                >
                  Zrušit
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm"
                >
                  Uložit Výsledky Akce
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
