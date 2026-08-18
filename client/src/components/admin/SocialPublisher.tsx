import { useMemo, useState } from "react";
import {
  AlertCircle,
  Bot,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  Facebook,
  Flame,
  Instagram,
  Loader2,
  Play,
  RefreshCw,
  Settings2,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { recipes } from "@/lib/data";

const STATUS_LABELS = {
  scheduled: "Naplánováno",
  publishing: "Publikuje se",
  published: "Publikováno",
  failed: "Chyba",
  uncertain: "Nejednoznačné (timeout)",
} as const;

const STATUS_STYLES = {
  scheduled: "bg-blue-100 text-blue-700 border-blue-200",
  publishing: "bg-amber-100 text-amber-700 border-amber-200",
  published: "bg-emerald-100 text-emerald-700 border-emerald-200",
  failed: "bg-red-100 text-red-700 border-red-200",
  uncertain: "bg-purple-100 text-purple-700 border-purple-200",
} as const;

function formatDate(value: Date | string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("cs-CZ", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function SocialPublisher() {
  const [selectedSlug, setSelectedSlug] = useState(recipes[0]?.slug || "svickova-bez-masa");
  const [previewPlatform, setPreviewPlatform] = useState<"facebook" | "instagram">("instagram");
  const [statusFilter, setStatusFilter] = useState<"all" | "scheduled" | "published" | "failed">("all");
  const [copied, setCopied] = useState(false);

  const postsQuery = trpc.admin.socialPosts.useQuery(undefined, {
    refetchInterval: 10_000,
  });
  const configQuery = trpc.admin.socialPublisherStatus.useQuery();
  const previewQuery = trpc.admin.previewSocialPost.useQuery(
    { recipeSlug: selectedSlug, platform: previewPlatform },
    { enabled: Boolean(selectedSlug) },
  );

  const refresh = async () => {
    await Promise.all([postsQuery.refetch(), configQuery.refetch(), previewQuery.refetch()]);
  };

  const refillMutation = trpc.admin.refillSocialQueue.useMutation({
    onSuccess: async result => {
      toast.success(
        `Auto-Pilot doplnil frontu: +${result.scheduledCount} nových příspěvků (celkem ve frontě: ${result.existingCount}).`,
      );
      await refresh();
    },
    onError: error => toast.error(error.message),
  });

  const retryMutation = trpc.admin.retrySocialPost.useMutation({
    onSuccess: async () => {
      toast.success("Příspěvek byl vrácen do fronty.");
      await refresh();
    },
    onError: error => toast.error(error.message),
  });

  const runMutation = trpc.admin.runSocialPublisher.useMutation({
    onSuccess: async result => {
      if (result.processed === 0) {
        toast.info("V této chvíli není ve frontě žádný příspěvek k okamžitému odeslání.");
      } else {
        toast.success(`Úspěšně publikováno: ${result.processed} příspěvků.`);
      }
      await refresh();
    },
    onError: error => toast.error(error.message),
  });

  const exportCsv = async () => {
    try {
      const res = await fetch("/api/trpc/admin.exportSocialCsv?batch=1&input=%7B%220%22%3A%7B%22limit%22%3A100%7D%7D");
      const json = await res.json();
      const csvContent = json[0]?.result?.data || "";
      if (!csvContent) {
        toast.error("Nepodařilo se vygenerovat CSV");
        return;
      }
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `bezmasajidla-social-calendar-${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV export stažen do počítače.");
    } catch {
      toast.error("Chyba při stahování CSV.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Text příspěvku zkopírován do schránky!");
    setTimeout(() => setCopied(false), 2000);
  };

  const posts = postsQuery.data ?? [];
  const counts = {
    scheduled: posts.filter(post => post.status === "scheduled").length,
    published: posts.filter(post => post.status === "published").length,
    failed: posts.filter(post => post.status === "failed").length,
  };
  const filteredPosts = useMemo(() => {
    if (statusFilter === "all") return posts;
    return posts.filter(p => p.status === statusFilter);
  }, [posts, statusFilter]);

  const config = configQuery.data;
  const isLoading = postsQuery.isLoading || configQuery.isLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">
                  100% Autonomní Social Media Engine
                </h1>
                <Badge className="bg-emerald-600 text-white border-0">
                  <Zap className="mr-1 h-3 w-3 fill-current" /> Auto-Pilot Aktivní
                </Badge>
              </div>
              <p className="mt-0.5 text-sm text-gray-600">
                Server automaticky rotuje 72+ kurátorských receptů, generuje české virální texty a udržuje stálou 14denní frontu (2 sloty denně: 11:30 & 17:30).
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-gray-300 hover:bg-gray-50"
              onClick={exportCsv}
            >
              <Download className="mr-1.5 h-4 w-4 text-gray-700" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-50"
              disabled={refillMutation.isPending}
              onClick={() => refillMutation.mutate({ days: 14 })}
            >
              {refillMutation.isPending ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-1.5 h-4 w-4 text-emerald-600" />
              )}
              Doplnit 14 dní
            </Button>
            <Button
              size="sm"
              className="bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm"
              disabled={runMutation.isPending}
              onClick={() => runMutation.mutate()}
            >
              {runMutation.isPending ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-1.5 h-4 w-4 fill-current" />
              )}
              Publikovat nyní
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Režim publikace</div>
            <div className="mt-1 flex items-center gap-2 font-bold text-gray-900">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              100% Autonomní
            </div>
            <div className="mt-1 text-xs text-gray-500">Perpetual 14-day Loop</div>
          </CardContent>
        </Card>
        <Card className="border-blue-100 bg-blue-50/30">
          <CardContent className="p-4">
            <div className="text-xs font-medium text-blue-700 uppercase tracking-wider">Ve frontě (14 dní)</div>
            <div className="mt-1 text-2xl font-bold text-blue-800">{counts.scheduled}</div>
            <div className="mt-1 text-xs text-blue-600">Facebook & Instagram sloty</div>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 bg-emerald-50/30">
          <CardContent className="p-4">
            <div className="text-xs font-medium text-emerald-700 uppercase tracking-wider">Publikováno</div>
            <div className="mt-1 text-2xl font-bold text-emerald-800">{counts.published}</div>
            <div className="mt-1 text-xs text-emerald-600">Úspěšně odeslané příspěvky</div>
          </CardContent>
        </Card>
        <Card className="border-purple-100 bg-purple-50/30">
          <CardContent className="p-4">
            <div className="text-xs font-medium text-purple-700 uppercase tracking-wider">Aktivní katalog</div>
            <div className="mt-1 text-2xl font-bold text-purple-800">{recipes.length} receptů</div>
            <div className="mt-1 text-xs text-purple-600">Anti-spam rotace (min 30 dní)</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 font-bold text-gray-900">
                <Settings2 className="h-5 w-5 text-emerald-700" />
                Integrace a kanály (Meta & Webhook)
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Auto-Pilot publikuje přímo přes Meta Graph API nebo odesílá události na externí webhooky (Make.com, Zapier, Buffer).
              </p>
            </div>
            <Badge variant="outline">Graph API {config?.graphApiVersion}</Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ConnectionStatus platform="facebook" configured={Boolean(config?.facebookConfigured)} />
            <ConnectionStatus platform="instagram" configured={Boolean(config?.instagramConfigured)} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-emerald-200 shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-4">
            <div>
              <h2 className="flex items-center gap-2 font-bold text-gray-900">
                <Flame className="h-5 w-5 text-amber-500" />
                Interaktivní Social Content Studio & Náhled
              </h2>
              <p className="text-sm text-gray-500">
                Vyberte libovolný z 72 receptů a prohlédněte si, jak Auto-Pilot vygeneruje virální příspěvek.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setPreviewPlatform("instagram")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    previewPlatform === "instagram"
                      ? "bg-white text-pink-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Instagram className="h-3.5 w-3.5 text-pink-600" /> Instagram
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewPlatform("facebook")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    previewPlatform === "facebook"
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Facebook className="h-3.5 w-3.5 text-blue-600" /> Facebook
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-5 lg:grid-cols-[300px_1fr]">
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 block">
                Výběr receptu z katalogu ({recipes.length})
              </label>
              <select
                value={selectedSlug}
                onChange={e => setSelectedSlug(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-emerald-500 focus:outline-none"
              >
                {recipes.map(r => (
                  <option key={r.slug} value={r.slug}>
                    {r.title} ({r.category})
                  </option>
                ))}
              </select>

              {previewQuery.data && (
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg border border-gray-200 p-3 bg-gray-50 text-xs space-y-1.5">
                    <div className="text-gray-500">Zvolený styl copy:</div>
                    <Badge variant="secondary" className="font-mono text-xs capitalize">
                      {previewQuery.data.style.replace("_", " ")}
                    </Badge>
                    <div className="text-gray-500 pt-1">Cílový UTM odkaz:</div>
                    <div className="truncate font-mono text-[11px] text-emerald-700">
                      {previewQuery.data.linkUrl}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => copyToClipboard(previewQuery.data.caption)}
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4 text-emerald-600" /> Zkopírováno!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4 text-gray-600" /> Kopírovat text
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" /> Živý náhled generovaného příspěvku
              </div>
              {previewQuery.isLoading ? (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                </div>
              ) : previewQuery.data ? (
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                      BJ
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-900">Bezmasá Jídla</div>
                      <div className="text-xs text-gray-500">
                        {previewPlatform === "instagram" ? "@bezmasajidla.cz" : "Bezmasá Jídla CZ"} · Právě teď
                      </div>
                    </div>
                  </div>

                  {previewQuery.data.imageUrl && (
                    <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={previewQuery.data.imageUrl}
                        alt={previewQuery.data.recipeTitle}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="whitespace-pre-line text-sm text-gray-800 font-sans leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                    {previewQuery.data.caption}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-700" />
              Autonomní publikační fronta ({filteredPosts.length})
            </h2>
            <p className="text-sm text-gray-500">
              Přehled naplánovaných a publikovaných příspěvků. Obnovuje se automaticky každých 10 sekund.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 text-xs">
              {(["all", "scheduled", "published", "failed"] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                    statusFilter === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab === "all" ? "Vše" : STATUS_LABELS[tab]}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => void refresh()}>
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Obnovit
            </Button>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <Bot className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              Žádné příspěvky neodpovídají zvolenému filtru.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map(post => (
              <Card key={post.id} className="border-gray-200 hover:border-gray-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt=""
                        className="h-20 w-20 rounded-lg object-cover flex-shrink-0 border"
                      />
                    ) : (
                      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                        {post.platform === "facebook" ? (
                          <Facebook className="h-6 w-6" />
                        ) : (
                          <Instagram className="h-6 w-6" />
                        )}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {post.platform === "facebook" ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            <Facebook className="h-3.5 w-3.5 text-blue-600" /> Facebook
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-semibold text-pink-700 bg-pink-50 px-2 py-0.5 rounded">
                            <Instagram className="h-3.5 w-3.5 text-pink-600" /> Instagram
                          </span>
                        )}
                        <span className="font-bold text-gray-900">
                          {post.recipeTitle || post.recipeSlug || `Příspěvek #${post.id}`}
                        </span>
                        <Badge className={STATUS_STYLES[post.status]}>
                          {STATUS_LABELS[post.status]}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        🗓️ Čas slotu: <strong className="text-gray-700">{formatDate(post.scheduledFor)}</strong>
                        {post.publishedAt && ` · Publikováno: ${formatDate(post.publishedAt)}`}
                        {post.externalPostId && ` · ID: ${post.externalPostId}`}
                      </p>
                      <p className="mt-2 line-clamp-2 whitespace-pre-line text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                        {post.caption}
                      </p>
                      {post.lastError && (
                        <p className="mt-2 rounded bg-red-50 px-2 py-1 text-xs text-red-700">
                          {post.lastError}
                        </p>
                      )}
                    </div>
                    {post.status === "failed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={retryMutation.isPending}
                        onClick={() => retryMutation.mutate({ id: post.id })}
                      >
                        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                        Zkusit znovu
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ConnectionStatus({
  platform,
  configured,
}: {
  platform: "facebook" | "instagram";
  configured: boolean;
}) {
  const isFacebook = platform === "facebook";
  return (
    <div className="flex items-center justify-between rounded-lg border p-3 bg-gray-50/50">
      <span className="flex items-center gap-2 font-medium text-sm">
        {isFacebook ? (
          <Facebook className="h-4 w-4 text-blue-600" />
        ) : (
          <Instagram className="h-4 w-4 text-pink-600" />
        )}
        {isFacebook ? "Facebook Stránka" : "Instagram Business"}
      </span>
      <Badge
        className={
          configured
            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
            : "bg-amber-100 text-amber-700 border-amber-200"
        }
      >
        {configured ? "Připojeno (Meta API)" : "Auto-Pilot Simulation"}
      </Badge>
    </div>
  );
}
