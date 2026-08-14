// ============================================================
// BEZMASAJIDLA.CZ — Admin Affiliate Diagnostics & Sync Panel
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
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function AffiliateDiagnostics() {
  const { data: stats, isLoading, refetch } = trpc.affiliate.getDiagnosticStats.useQuery();
  const syncMutation = trpc.affiliate.triggerSync.useMutation({
    onSuccess: (data) => {
      toast.success("Synchronizace affiliate feedů proběhla úspěšně.");
      refetch();
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

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
        <p className="text-sm text-stone-500">Načítám affiliate statistiky...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            Affiliate Commerce Engine v1
          </h2>
          <p className="text-xs text-stone-500">
            Správa produktových XML feedů, kontextového matchingu a monetizačních metrik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSyncAll}
            disabled={syncMutation.isPending}
            className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncMutation.isPending ? "animate-spin" : ""}`} />
            {syncMutation.isPending ? "Synchronizuji..." : "Spustit Sync všech feedů"}
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-emerald-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Ekočlověk (Aktivní)
            </CardTitle>
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-stone-900">
              {stats?.activeCounts?.ekoclovek ?? 0}
            </div>
            <p className="text-xs text-stone-400 mt-1">Bylinky, semínka, bio ochrana</p>
            <Button
              variant="link"
              size="sm"
              onClick={() => handleSyncMerchant("ekoclovek")}
              disabled={syncMutation.isPending}
              className="p-0 h-auto text-xs text-emerald-700 hover:text-emerald-800 mt-2 font-medium"
            >
              Re-sync Ekočlověk
            </Button>
          </CardContent>
        </Card>

        <Card className="border-amber-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Zážitky.cz (Aktivní)
            </CardTitle>
            <ChefHat className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-stone-900">
              {stats?.activeCounts?.zazitky ?? 0}
            </div>
            <p className="text-xs text-stone-400 mt-1">Kurzy vaření, degustace</p>
            <Button
              variant="link"
              size="sm"
              onClick={() => handleSyncMerchant("zazitky")}
              disabled={syncMutation.isPending}
              className="p-0 h-auto text-xs text-amber-700 hover:text-amber-800 mt-2 font-medium"
            >
              Re-sync Zážitky.cz
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Zobrazení (Impressions)
            </CardTitle>
            <Eye className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-stone-900">
              {stats?.impressionsCount ?? 0}
            </div>
            <p className="text-xs text-stone-400 mt-1">Skutečně zobrazeno v prohlížeči</p>
          </CardContent>
        </Card>

        <Card className="border-purple-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Prokliky & CTR
            </CardTitle>
            <MousePointerClick className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-stone-900">
              {stats?.clicksCount ?? 0}{" "}
              <span className="text-sm font-semibold text-purple-700 ml-1">
                ({stats?.ctr ?? "0.00%"})
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1">Měřeno před bezpečným redirectem</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sync Audit Log Table */}
      <Card className="border-stone-200/80 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-stone-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            Historie synchronizací feedů
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!stats?.recentSyncLogs || stats.recentSyncLogs.length === 0 ? (
            <div className="py-6 text-center text-sm text-stone-400">
              Zatím nebyl zaznamenán žádný sync. Klikněte na „Spustit Sync všech feedů“.
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
                    <th className="py-2.5 px-3 text-right">Čas</th>
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
    </div>
  );
}
