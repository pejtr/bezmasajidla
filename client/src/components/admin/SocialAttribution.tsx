import { useState } from "react";
import {
  BarChart3,
  Calendar,
  Clock,
  ExternalLink,
  Facebook,
  Flame,
  Globe,
  Instagram,
  Layers,
  Loader2,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TIMEFRAME_OPTIONS = [
  { label: "Posledních 7 dní", value: 7 },
  { label: "Posledních 14 dní", value: 14 },
  { label: "Posledních 30 dní", value: 30 },
  { label: "Celá historie", value: undefined },
];

export default function SocialAttribution() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<number | undefined>(30);

  const { data: report, isLoading, refetch, isRefetching } =
    trpc.affiliate.getSocialAttributionReport.useQuery(
      { days: selectedTimeframe },
      { refetchInterval: 30_000 },
    );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const data = report || {
    totalLandings: 0,
    totalAffiliateImpressions: 0,
    totalAffiliateClicks: 0,
    overallAffiliateCtr: 0,
    overallClicksPer100Landings: 0,
    byChannel: [],
    bySlot: [],
    byCopyStyle: [],
    byPost: [],
    byRecipeYield: [],
  };

  return (
    <div className="space-y-6">
      {/* Header with Timeframe Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-700" />
            Social → Revenue Attribution (Profit Loop)
          </h2>
          <p className="text-sm text-gray-500">
            Měří přesnou návštěvnost a monetizační výkon jednotlivých příspěvků, kanálů a časových slotů.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-xs font-medium">
            {TIMEFRAME_OPTIONS.map(opt => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setSelectedTimeframe(opt.value)}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  selectedTimeframe === opt.value
                    ? "bg-white text-emerald-800 shadow-sm font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            disabled={isRefetching}
            className="h-9 px-3"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-white">
          <CardContent className="p-4">
            <div className="text-xs font-medium text-emerald-800 uppercase tracking-wider">
              Attributed Landings
            </div>
            <div className="mt-1 text-2xl font-bold text-emerald-950">
              {data.totalLandings.toLocaleString("cs-CZ")}
            </div>
            <div className="mt-1 text-xs text-emerald-700">Příchody ze sociálních odkazů</div>
          </CardContent>
        </Card>

        <Card className="border-blue-100 bg-blue-50/30">
          <CardContent className="p-4">
            <div className="text-xs font-medium text-blue-800 uppercase tracking-wider">
              Affiliate Impressions
            </div>
            <div className="mt-1 text-2xl font-bold text-blue-950">
              {data.totalAffiliateImpressions.toLocaleString("cs-CZ")}
            </div>
            <div className="mt-1 text-xs text-blue-700">Zobrazení produktů a kurzů</div>
          </CardContent>
        </Card>

        <Card className="border-amber-100 bg-amber-50/30">
          <CardContent className="p-4">
            <div className="text-xs font-medium text-amber-800 uppercase tracking-wider">
              Affiliate Clicks
            </div>
            <div className="mt-1 text-2xl font-bold text-amber-950">
              {data.totalAffiliateClicks.toLocaleString("cs-CZ")}
            </div>
            <div className="mt-1 text-xs text-amber-700">Prokliky do e-shopů partnerů</div>
          </CardContent>
        </Card>

        <Card className="border-purple-100 bg-purple-50/30">
          <CardContent className="p-4">
            <div className="text-xs font-medium text-purple-800 uppercase tracking-wider">
              Affiliate CTR
            </div>
            <div className="mt-1 text-2xl font-bold text-purple-950">
              {data.overallAffiliateCtr.toFixed(2)} %
            </div>
            <div className="mt-1 text-xs text-purple-700">Míra prokliku z impresí</div>
          </CardContent>
        </Card>

        <Card className="border-stone-200 bg-stone-50/50">
          <CardContent className="p-4">
            <div className="text-xs font-medium text-stone-700 uppercase tracking-wider">
              Clicks / 100 Landings
            </div>
            <div className="mt-1 text-2xl font-bold text-stone-900">
              {data.overallClicksPer100Landings.toFixed(2)}
            </div>
            <div className="mt-1 text-xs text-stone-600">Ekonomická výtěžnost trafficu</div>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Channels & Slots */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* By Channel */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-700" />
              Výkon distribučních kanálů (Facebook vs Instagram)
            </h3>
            {data.byChannel.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">Zatím žádná data o kanálech</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500">
                      <th className="pb-2 font-medium">Kanál</th>
                      <th className="pb-2 font-medium text-right">Landings</th>
                      <th className="pb-2 font-medium text-right">Aff. Impr</th>
                      <th className="pb-2 font-medium text-right">Aff. Clicks</th>
                      <th className="pb-2 font-medium text-right">Aff. CTR</th>
                      <th className="pb-2 font-medium text-right">Clicks / 100 L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.byChannel.map(c => (
                      <tr key={c.channel} className="hover:bg-gray-50/50">
                        <td className="py-2.5 font-semibold text-gray-900 flex items-center gap-1.5">
                          {c.channel === "facebook" ? (
                            <Facebook className="h-3.5 w-3.5 text-blue-600" />
                          ) : c.channel === "instagram" ? (
                            <Instagram className="h-3.5 w-3.5 text-pink-600" />
                          ) : (
                            <Globe className="h-3.5 w-3.5 text-gray-400" />
                          )}
                          <span className="capitalize">{c.channel}</span>
                        </td>
                        <td className="py-2.5 text-right font-mono">{c.landings}</td>
                        <td className="py-2.5 text-right font-mono">{c.impressions}</td>
                        <td className="py-2.5 text-right font-mono font-bold text-emerald-700">{c.clicks}</td>
                        <td className="py-2.5 text-right font-mono">{c.affiliateCtr.toFixed(1)} %</td>
                        <td className="py-2.5 text-right font-mono font-semibold">{c.clicksPer100Landings.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* By Slot */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-700" />
              Výkon publikačních slotů (11:30 Oběd vs 17:30 Večeře)
            </h3>
            {data.bySlot.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">Zatím žádná data o slotech</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500">
                      <th className="pb-2 font-medium">Čas slotu</th>
                      <th className="pb-2 font-medium text-right">Landings</th>
                      <th className="pb-2 font-medium text-right">Aff. Impr</th>
                      <th className="pb-2 font-medium text-right">Aff. Clicks</th>
                      <th className="pb-2 font-medium text-right">Aff. CTR</th>
                      <th className="pb-2 font-medium text-right">Clicks / 100 L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.bySlot.map(s => (
                      <tr key={s.slot} className="hover:bg-gray-50/50">
                        <td className="py-2.5 font-semibold text-gray-900">
                          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono text-[11px]">
                            {s.slot}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-mono">{s.landings}</td>
                        <td className="py-2.5 text-right font-mono">{s.impressions}</td>
                        <td className="py-2.5 text-right font-mono font-bold text-emerald-700">{s.clicks}</td>
                        <td className="py-2.5 text-right font-mono">{s.affiliateCtr.toFixed(1)} %</td>
                        <td className="py-2.5 text-right font-mono font-semibold">{s.clicksPer100Landings.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Copywriting Styles */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-5">
          <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-700" />
            Výkon stylů copywritingu (5 virálních háčků)
          </h3>
          {data.byCopyStyle.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">Zatím žádná data o stylech textů</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500">
                    <th className="pb-2 font-medium">Styl textu</th>
                    <th className="pb-2 font-medium text-right">Landings</th>
                    <th className="pb-2 font-medium text-right">Aff. Impr</th>
                    <th className="pb-2 font-medium text-right">Aff. Clicks</th>
                    <th className="pb-2 font-medium text-right">Aff. CTR</th>
                    <th className="pb-2 font-medium text-right">Clicks / 100 L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.byCopyStyle.map(st => (
                    <tr key={st.style} className="hover:bg-gray-50/50">
                      <td className="py-2.5 font-semibold text-gray-900">
                        <Badge variant="outline" className="font-mono capitalize text-[11px]">
                          {st.style.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="py-2.5 text-right font-mono">{st.landings}</td>
                      <td className="py-2.5 text-right font-mono">{st.impressions}</td>
                      <td className="py-2.5 text-right font-mono font-bold text-emerald-700">{st.clicks}</td>
                      <td className="py-2.5 text-right font-mono">{st.affiliateCtr.toFixed(1)} %</td>
                      <td className="py-2.5 text-right font-mono font-semibold">{st.clicksPer100Landings.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Post-Level Performance Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-5">
          <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-700" />
            Žebříček jednotlivých příspěvků (Post-Level Performance)
          </h3>
          {data.byPost.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">Zatím žádné publikované příspěvky s evidovanou návštěvností</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500">
                    <th className="pb-2 font-medium">Post ID</th>
                    <th className="pb-2 font-medium">Recept</th>
                    <th className="pb-2 font-medium">Kanál</th>
                    <th className="pb-2 font-medium">Slot</th>
                    <th className="pb-2 font-medium">Styl</th>
                    <th className="pb-2 font-medium text-right">Landings</th>
                    <th className="pb-2 font-medium text-right">Aff. Impr</th>
                    <th className="pb-2 font-medium text-right">Aff. Clicks</th>
                    <th className="pb-2 font-medium text-right">Aff. CTR</th>
                    <th className="pb-2 font-medium text-right">Clicks / 100 L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.byPost.map(p => (
                    <tr key={p.postId} className="hover:bg-gray-50/50">
                      <td className="py-2.5 font-mono text-[11px] text-gray-500">#{p.postId}</td>
                      <td className="py-2.5 font-semibold text-gray-900 max-w-[200px] truncate">
                        {p.recipeTitle}
                      </td>
                      <td className="py-2.5">
                        {p.channel === "facebook" ? (
                          <span className="flex items-center gap-1 text-blue-700">
                            <Facebook className="h-3 w-3" /> FB
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-pink-700">
                            <Instagram className="h-3 w-3" /> IG
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 font-mono text-[11px]">{p.slot}</td>
                      <td className="py-2.5 capitalize text-gray-600 text-[11px] truncate max-w-[120px]">
                        {p.copyStyle.replace(/_/g, " ")}
                      </td>
                      <td className="py-2.5 text-right font-mono">{p.landings}</td>
                      <td className="py-2.5 text-right font-mono">{p.impressions}</td>
                      <td className="py-2.5 text-right font-mono font-bold text-emerald-700">{p.clicks}</td>
                      <td className="py-2.5 text-right font-mono">{p.affiliateCtr.toFixed(1)} %</td>
                      <td className="py-2.5 text-right font-mono font-semibold">{p.clicksPer100Landings.toFixed(1)}</td>
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
