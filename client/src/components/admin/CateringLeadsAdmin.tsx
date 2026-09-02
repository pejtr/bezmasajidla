// ============================================================
// BEZMASAJIDLA.CZ — Catering Leads & Profit Gate CRM Dashboard
// MATOUŠ MATĚJ × BEZMASÁJÍDLA.CZ
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
} from "lucide-react";
import { toast } from "sonner";

interface CateringLeadRecord {
  id: number;
  leadCode: string;
  status: "NEW" | "OFFER_SENT" | "WON" | "LOST";
  lostReason?: string;
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
  finalRevenue?: number;
  foodCost?: number;
  chefCost?: number;
  staffCost?: number;
  transportCost?: number;
  equipmentCost?: number;
  marketingCost?: number;
  otherCost?: number;
  contribution?: number;
  marginPct?: number;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  landingPage?: string;
  createdAt: string;
}

export default function CateringLeadsAdmin() {
  const [leads, setLeads] = useState<CateringLeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLead, setEditingLead] = useState<CateringLeadRecord | null>(null);

  // Financial Entry Form State
  const [editStatus, setEditStatus] = useState<"NEW" | "OFFER_SENT" | "WON" | "LOST">("NEW");
  const [editLostReason, setEditLostReason] = useState("");
  const [editFinalRevenue, setEditFinalRevenue] = useState<number>(0);
  const [editFoodCost, setEditFoodCost] = useState<number>(0);
  const [editChefCost, setEditChefCost] = useState<number>(0);
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
    setEditChefCost(lead.chefCost || 0);
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
        chefCost: editChefCost,
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
        toast.success(`Finanční korigace uložena. Marže: ${data.marginPct}%`);
        setEditingLead(null);
        fetchLeads();
      } else {
        toast.error(data.error || "Chyba při ukládání.");
      }
    } catch (err) {
      toast.error("Nepodařilo se připojit k serveru.");
    }
  };

  // Metrics
  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.status === "WON");
  const totalEstimatedRev = leads.reduce((sum, l) => sum + (l.estimatedRevenue || 0), 0);
  const totalWonRev = wonLeads.reduce((sum, l) => sum + (l.finalRevenue || l.estimatedRevenue || 0), 0);
  const totalWonContribution = wonLeads.reduce((sum, l) => sum + (l.contribution || 0), 0);
  const avgWonMarginPct = totalWonRev > 0 ? ((totalWonContribution / totalWonRev) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-8">
      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Celkem Poptávek
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-gray-900">{totalLeads}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {wonLeads.length} zrealizováno
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Odhadovaný Pipet (CZK)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-gray-900">
              {totalEstimatedRev.toLocaleString("cs-CZ")} Kč
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Realizované Tržby (WON)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">
              {totalWonRev.toLocaleString("cs-CZ")} Kč
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Průměrná Marže (Contribution)
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
            <h3 className="text-lg font-bold text-gray-900">Catering Leads & Profit Gate CRM</h3>
            <p className="text-xs text-gray-500">
              Matouš Matěj × BezmasáJídla.cz — Poptávky, finanční marže a stav konverze
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
                  <th className="p-4">Skutečná Marže</th>
                  <th className="p-4">Zdroj (UTM)</th>
                  <th className="p-4 text-right font-bold">Akce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead) => {
                  const hasProfitData = lead.finalRevenue !== undefined && lead.finalRevenue > 0;
                  const marginPct = lead.marginPct || 0;
                  const isMarginOk = marginPct >= 25;

                  return (
                    <tr key={lead.leadCode} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-[11px] font-bold text-gray-800 block mb-1">
                          {lead.leadCode}
                        </span>
                        <span
                          className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                            lead.status === "WON"
                              ? "bg-emerald-100 text-emerald-800"
                              : lead.status === "OFFER_SENT"
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
                              <span>Marže: {marginPct}%</span>
                              {isMarginOk ? "🟢" : "⚠️"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Čeká na zadání nákladů</span>
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
                          Zadat Finanční Náklady & Stav
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
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Profit Gate CRM Entry</span>
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
                  <label className="block font-bold text-gray-700 mb-1">Stav Zakázky *</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 font-semibold"
                  >
                    <option value="NEW">NEW (Nová Poptávka)</option>
                    <option value="OFFER_SENT">OFFER_SENT (Nabídka Odeslána)</option>
                    <option value="WON">WON (Zrealizováno & Zaplaceno)</option>
                    <option value="LOST">LOST (Stornováno / Ztraceno)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Finální Tržba / Cena (Kč) *</label>
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

              <div className="pt-2 border-t border-gray-100">
                <span className="block font-bold text-gray-900 mb-2 uppercase tracking-wider text-[11px]">
                  Rozpad Skutečných Nákladů Akce (Kč)
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
                    <label className="block text-gray-600 mb-0.5">Šéfkuchař (Matouš)</label>
                    <input
                      type="number"
                      value={editChefCost}
                      onChange={(e) => setEditChefCost(parseInt(e.target.value) || 0)}
                      className="w-full p-2 rounded-lg border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-0.5">Personál (Obsluha)</label>
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
                    <label className="block text-gray-600 mb-0.5">Inventář & Sklo</label>
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
                </div>
              </div>

              {/* Calculated Preview Box */}
              {(() => {
                const totalC = editFoodCost + editChefCost + editStaffCost + editTransportCost + editEquipmentCost + editMarketingCost + editOtherCost;
                const contrib = editFinalRevenue - totalC;
                const margin = editFinalRevenue > 0 ? Number(((contrib / editFinalRevenue) * 100).toFixed(2)) : 0;
                const isTarget = margin >= 25;

                return (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-gray-500 block">Celkové Náklady: {totalC.toLocaleString("cs-CZ")} Kč</span>
                      <span className="font-bold text-gray-900 block">Čistý Zisk (Contribution): {contrib.toLocaleString("cs-CZ")} Kč</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xl font-black ${isTarget ? "text-emerald-700" : "text-amber-600"}`}>
                        {margin}% Marže
                      </span>
                      <span className="block text-[10px] text-gray-500">
                        {isTarget ? "🟢 Cíl Profit Gate Splněn (≥25%)" : "⚠️ Pod Cílovou Marží"}
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
                  Uložit Finanční Výsledky
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
