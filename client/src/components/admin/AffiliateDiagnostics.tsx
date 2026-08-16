// ============================================================
// BEZMASAJIDLA.CZ — Admin Affiliate Telemetry & Diagnostics Panel (v1.1)
// ============================================================

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RefreshCw,
  ShoppingBag,
  ChefHat,
  MousePointerClick,
  Eye,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Globe2,
  UtensilsCrossed,
  Layers,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function AffiliateDiagnostics() {
  const [timeframeDays, setTimeframeDays] = useState<number | undefined>(14);

  const { data: stats, isLoading: isStatsLoading, refetch: refetchStats } =
    trpc.affiliate.getDiagnosticStats.useQuery();

  const { data: kpiReport, isLoading: isKpisLoading, refetch: refetchKpis } =
    trpc.affiliate.getDetailedKpis.useQuery({ days: timeframeDays });

  const syncMutation = trpc.affiliate.triggerSync.useMutation({
    onSuccess: () => {
      toast.success("Synchronizace affiliate feedů proběhla úspěšně.");
      refetchStats();
      refetchKpis();
    },
    onError: (err) => {
      toast.error(`Chyba při synchronizaci: ${err.message}`);
    },
  });

  const handleSyncAll = () => {
    toast.info("Spouštím synchronizaci feedů Ekočlověk a Zážitky.cz...");
    syncMutation.mutate({});
  };

  const handleSyncMerchant = (merchant: "ekoclovek" | "zazitky") => {
    toast.info(`Spouštím synchronizaci feedu ${merchant}...`);
    syncMutation.mutate({ merchant });
  };

  const isLoading = isStatsLoading || isKpisLoading;

  return (
    <div className="space-y-6">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            Affiliate Commerce Engine v1.1
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Výkonnostní telemetrie, kontextový matching a monetizační KPI receptů.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe selector */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setTimeframeDays(7)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                timeframeDays === 7
                  ? "bg-white text-stone-900 shadow-xs font-semibold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              7 dní
            </button>
            <button
              onClick={() => setTimeframeDays(14)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                timeframeDays === 14
                  ? "bg-white text-stone-900 shadow-xs font-semibold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              14 dní
            </button>
            <button
              onClick={() => setTimeframeDays(30)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                timeframeDays === 30
                  ? "bg-white text-stone-900 shadow-xs font-semibold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              30 dní
            </button>
            <button
              onClick={() => setTimeframeDays(undefined)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                timeframeDays === undefined
                  ? "bg-white text-stone-900 shadow-xs font-semibold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Vše
            </button>
          </div>

          <Button
            onClick={handleSyncAll}
            disabled={syncMutation.isPending}
            className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncMutation.isPending ? "animate-spin" : ""}`} />
            {syncMutation.isPending ? "Synchronizuji..." : "Sync feedů"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-sm text-stone-500">Načítám telemetrická data...</p>
        </div>
      ) : (
        <>
          {/* Main KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-blue-100 shadow-sm bg-blue-50/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Zobrazení (Impressions)
                </CardTitle>
                <Eye className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-stone-900">
                  {(kpiReport?.totalImpressions ?? 0).toLocaleString("cs-CZ")}
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  Reálné imprese v zorném poli (min. 50 % po 1 s)
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 shadow-sm bg-purple-50/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Prokliky (Clicks)
                </CardTitle>
                <MousePointerClick className="w-4 h-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-stone-900">
                  {(kpiReport?.totalClicks ?? 0).toLocaleString("cs-CZ")}
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  Měřeno přes bezpečný redirect endpoint
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-100 shadow-sm bg-emerald-50/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Globální CTR
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-emerald-700">
                  {kpiReport?.overallCtr ?? 0} %
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  {kpiReport && kpiReport.totalImpressions > 0
                    ? `Z ${kpiReport.totalImpressions.toLocaleString("cs-CZ")} zobrazení`
                    : "Zatím žádné imprese v období"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-stone-200/80 shadow-sm bg-stone-50/40">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Aktivní katalog
                </CardTitle>
                <Sparkles className="w-4 h-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-stone-900">
                  {stats?.totalProducts ?? 0}
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  {stats?.activeCounts?.ekoclovek ?? 0} Ekočlověk · {stats?.activeCounts?.zazitky ?? 0} Zážitky.cz
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Table 1: CTR by Merchant */}
          <Card className="border-stone-200/80 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-700" />
                CTR podle Affiliate Partnera
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-500 uppercase font-semibold tracking-wider">
                      <th className="py-2.5 px-3">Partner</th>
                      <th className="py-2.5 px-3 text-right">Aktivní produkty</th>
                      <th className="py-2.5 px-3 text-right">Imprese</th>
                      <th className="py-2.5 px-3 text-right">Kliky</th>
                      <th className="py-2.5 px-3 text-right font-bold">CTR</th>
                      <th className="py-2.5 px-3 text-right">Akce</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {kpiReport?.byMerchant.map((m) => (
                      <tr key={m.merchant} className="hover:bg-stone-50/50">
                        <td className="py-2.5 px-3 font-semibold text-stone-900">
                          {m.displayName}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-stone-600">
                          {m.activeProducts.toLocaleString("cs-CZ")}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-stone-600">
                          {m.impressions.toLocaleString("cs-CZ")}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-purple-700">
                          {m.clicks.toLocaleString("cs-CZ")}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                          {m.ctr} %
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSyncMerchant(m.merchant)}
                            disabled={syncMutation.isPending}
                            className="h-7 px-2 text-xs text-stone-600 hover:text-emerald-700"
                          >
                            Sync
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Table 2: CTR by Placement */}
          <Card className="border-stone-200/80 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                CTR podle Umístění (Placement)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-500 uppercase font-semibold tracking-wider">
                      <th className="py-2.5 px-3">Umístění</th>
                      <th className="py-2.5 px-3 text-right">Imprese</th>
                      <th className="py-2.5 px-3 text-right">Kliky</th>
                      <th className="py-2.5 px-3 text-right font-bold">CTR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {kpiReport?.byPlacement.map((pl) => (
                      <tr key={pl.placement} className="hover:bg-stone-50/50">
                        <td className="py-2.5 px-3 font-semibold text-stone-900">
                          {pl.displayName}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-stone-600">
                          {pl.impressions.toLocaleString("cs-CZ")}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-purple-700">
                          {pl.clicks.toLocaleString("cs-CZ")}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                          {pl.ctr} %
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Two-Column Grid: CTR by Cuisine vs CTR by Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table 3: CTR by Cuisine */}
            <Card className="border-stone-200/80 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-emerald-700" />
                  CTR podle Kuchyně (Cuisine)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!kpiReport?.byCuisine || kpiReport.byCuisine.length === 0 ? (
                  <div className="py-6 text-center text-xs text-stone-400">
                    Zatím žádné imprese v daném období.
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-72">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-500 uppercase font-semibold tracking-wider sticky top-0">
                          <th className="py-2.5 px-3">Kuchyně</th>
                          <th className="py-2.5 px-3 text-right">Imprese</th>
                          <th className="py-2.5 px-3 text-right">Kliky</th>
                          <th className="py-2.5 px-3 text-right font-bold">CTR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {kpiReport.byCuisine.map((c) => (
                          <tr key={c.cuisine} className="hover:bg-stone-50/50">
                            <td className="py-2 px-3 font-semibold text-stone-900">
                              {c.cuisine}
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-stone-600">
                              {c.impressions}
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-semibold text-purple-700">
                              {c.clicks}
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">
                              {c.ctr} %
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Table 4: CTR by Category */}
            <Card className="border-stone-200/80 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-emerald-700" />
                  CTR podle Kategorie Receptu
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!kpiReport?.byCategory || kpiReport.byCategory.length === 0 ? (
                  <div className="py-6 text-center text-xs text-stone-400">
                    Zatím žádné imprese v daném období.
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-72">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-500 uppercase font-semibold tracking-wider sticky top-0">
                          <th className="py-2.5 px-3">Kategorie</th>
                          <th className="py-2.5 px-3 text-right">Imprese</th>
                          <th className="py-2.5 px-3 text-right">Kliky</th>
                          <th className="py-2.5 px-3 text-right font-bold">CTR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {kpiReport.byCategory.map((cat) => (
                          <tr key={cat.category} className="hover:bg-stone-50/50">
                            <td className="py-2 px-3 font-semibold text-stone-900">
                              {cat.category}
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-stone-600">
                              {cat.impressions}
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-semibold text-purple-700">
                              {cat.clicks}
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">
                              {cat.ctr} %
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Table 5: Top Performing Recipes */}
          <Card className="border-stone-200/80 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-emerald-700" />
                Nejvýkonnější recepty podle prokliků a CTR
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!kpiReport?.topRecipes || kpiReport.topRecipes.length === 0 ? (
                <div className="py-6 text-center text-xs text-stone-400">
                  Zatím žádné recepty s impresí v daném období.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-500 uppercase font-semibold tracking-wider">
                        <th className="py-2.5 px-3">Recept</th>
                        <th className="py-2.5 px-3">Kategorie</th>
                        <th className="py-2.5 px-3">Kuchyně</th>
                        <th className="py-2.5 px-3 text-right">Imprese</th>
                        <th className="py-2.5 px-3 text-right">Kliky</th>
                        <th className="py-2.5 px-3 text-right font-bold">CTR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {kpiReport.topRecipes.map((r) => (
                        <tr key={r.recipeSlug} className="hover:bg-stone-50/50">
                          <td className="py-2.5 px-3 font-semibold text-stone-900 max-w-xs truncate">
                            <a
                              href={`/recepty/${r.recipeSlug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline hover:text-emerald-700"
                            >
                              {r.recipeTitle}
                            </a>
                          </td>
                          <td className="py-2.5 px-3 text-stone-500">
                            {r.category || "—"}
                          </td>
                          <td className="py-2.5 px-3 text-stone-500">
                            {r.cuisine || "—"}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-stone-600">
                            {r.impressions}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-purple-700">
                            {r.clicks}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                            {r.ctr} %
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Sync Audit Log Table */}
          <Card className="border-stone-200/80 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                Historie synchronizací feedů
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!stats?.recentSyncLogs || stats.recentSyncLogs.length === 0 ? (
                <div className="py-6 text-center text-xs text-stone-400">
                  Zatím nebyl zaznamenán žádný sync. Klikněte na „Sync feedů“.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-500 uppercase font-semibold tracking-wider">
                        <th className="py-2.5 px-3">Čas</th>
                        <th className="py-2.5 px-3">Partner</th>
                        <th className="py-2.5 px-3">Stav</th>
                        <th className="py-2.5 px-3 text-right">Načteno</th>
                        <th className="py-2.5 px-3 text-right">Přijato</th>
                        <th className="py-2.5 px-3 text-right">Vloženo</th>
                        <th className="py-2.5 px-3 text-right">Aktualizováno</th>
                        <th className="py-2.5 px-3 text-right">Deaktivováno</th>
                        <th className="py-2.5 px-3 text-right">Doba</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {stats.recentSyncLogs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-stone-50/50">
                          <td className="py-2.5 px-3 font-mono text-stone-600">
                            {new Date(log.createdAt).toLocaleTimeString("cs-CZ", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-stone-800 uppercase">
                            {log.merchant}
                          </td>
                          <td className="py-2.5 px-3">
                            {log.status === "success" ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                                <CheckCircle2 className="w-3 h-3" /> OK
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded-full font-medium">
                                <XCircle className="w-3 h-3" /> Chyba
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono">{log.itemsFetched}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-700">
                            {log.itemsAccepted}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono">{log.itemsInserted}</td>
                          <td className="py-2.5 px-3 text-right font-mono">{log.itemsUpdated}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-stone-400">
                            {log.itemsDeactivated}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-stone-500">
                            {log.durationMs} ms
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
