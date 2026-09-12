import { useMemo, useState } from "react";
import {
  AlertCircle,
  Bot,
  Calendar,
  Check,
  Copy,
  Eye,
  Facebook,
  Instagram,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { recipes } from "@/lib/data";

const STATUS_LABELS = {
  scheduled: "Přijato OMNIFORGE",
  publishing: "OMNIFORGE publikuje",
  published: "Publikováno",
  failed: "Chyba",
  uncertain: "Vyžaduje kontrolu",
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
  const [selectedSlug, setSelectedSlug] = useState(
    recipes[0]?.slug || "svickova-bez-masa"
  );
  const [previewPlatform, setPreviewPlatform] = useState<
    "facebook" | "instagram"
  >("instagram");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "scheduled" | "published" | "failed"
  >("all");
  const [copied, setCopied] = useState(false);

  const postsQuery = trpc.admin.socialPosts.useQuery(undefined, {
    refetchInterval: 30_000,
  });
  const configQuery = trpc.admin.socialPublisherStatus.useQuery();
  const previewQuery = trpc.admin.previewSocialPost.useQuery(
    { recipeSlug: selectedSlug, platform: previewPlatform },
    { enabled: Boolean(selectedSlug) }
  );

  const refresh = async () => {
    await Promise.all([
      postsQuery.refetch(),
      configQuery.refetch(),
      previewQuery.refetch(),
    ]);
  };

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Text příspěvku zkopírován do schránky.");
    setTimeout(() => setCopied(false), 2_000);
  };

  const posts = postsQuery.data ?? [];
  const filteredPosts = useMemo(() => {
    if (statusFilter === "all") return posts;
    return posts.filter(post => post.status === statusFilter);
  }, [posts, statusFilter]);
  const config = configQuery.data;

  if (postsQuery.isLoading || configQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">
                BezmasáJídla → OMNI FORGE
              </h1>
              <Badge className="border-0 bg-emerald-700 text-white">
                Producent obsahu
              </Badge>
            </div>
            <p className="mt-1 text-sm text-gray-700">
              BezmasáJídla připraví schválený obsah a předá jej centrálnímu
              publikačnímu systému. OAuth, plánování, retry a Meta API zůstávají
              výhradně v OMNI FORGE.
            </p>
          </div>
        </div>
      </div>

      {!config?.publishEndpointObserved && (
        <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Adaptér používá existující OMNI FORGE kontrakt, ale na auditovaném
            commitu není endpoint <code>/api/v1/publish-jobs</code> připojený k
            API. Skutečný publikační job proto zatím nelze vytvořit ani označit
            jako live.
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <StatusCard label="Vlastník publikace" value="OMNI FORGE" />
        <StatusCard
          label="Producent nakonfigurován"
          value={config?.configured ? "Ano" : "Ne"}
        />
        <StatusCard
          label="Facebook cíl"
          value={config?.facebookConfigured ? "Nastaven" : "Chybí"}
        />
        <StatusCard
          label="Instagram cíl"
          value={config?.instagramConfigured ? "Nastaven" : "Chybí"}
        />
      </div>

      <Card className="border-emerald-200">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 border-b pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="flex items-center gap-2 font-bold text-gray-900">
                <Eye className="h-5 w-5 text-emerald-700" />
                Náhled social obsahu
              </h2>
              <p className="text-sm text-gray-500">
                Náhled je pouze editorský. Samotné publikování provádí OMNI
                FORGE.
              </p>
            </div>
            <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
              {(["instagram", "facebook"] as const).map(platform => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => setPreviewPlatform(platform)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold ${
                    previewPlatform === platform
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  {platform === "facebook" ? (
                    <Facebook className="h-3.5 w-3.5 text-blue-600" />
                  ) : (
                    <Instagram className="h-3.5 w-3.5 text-pink-600" />
                  )}
                  {platform === "facebook" ? "Facebook" : "Instagram"}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-5 lg:grid-cols-[300px_1fr]">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700">
                Recept z katalogu
              </label>
              <select
                value={selectedSlug}
                onChange={event => setSelectedSlug(event.target.value)}
                className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
              >
                {recipes.map(recipe => (
                  <option key={recipe.slug} value={recipe.slug}>
                    {recipe.title}
                  </option>
                ))}
              </select>
              {previewQuery.data && (
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => copyToClipboard(previewQuery.data.caption)}
                >
                  {copied ? (
                    <Check className="mr-2 h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {copied ? "Zkopírováno" : "Kopírovat text"}
                </Button>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              {previewQuery.isLoading ? (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                </div>
              ) : previewQuery.data ? (
                <div className="space-y-3 rounded-lg border bg-white p-4 shadow-sm">
                  {previewQuery.data.imageUrl && (
                    <img
                      src={previewQuery.data.imageUrl}
                      alt={previewQuery.data.recipeTitle}
                      className="aspect-video w-full rounded-lg object-cover"
                    />
                  )}
                  <div className="whitespace-pre-line rounded-lg bg-gray-50 p-3 text-sm leading-relaxed text-gray-800">
                    {previewQuery.data.caption}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <Calendar className="h-5 w-5 text-emerald-700" />
              Stavové zrcadlo OMNI FORGE
            </h2>
            <p className="text-sm text-gray-500">
              Lokálně se ukládá pouze job ID, výsledek a vzdálené ID příspěvku.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(["all", "scheduled", "published", "failed"] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                  statusFilter === tab
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab === "all" ? "Vše" : STATUS_LABELS[tab]}
              </button>
            ))}
            <Button variant="outline" size="sm" onClick={() => void refresh()}>
              <RefreshCw className="mr-1 h-3.5 w-3.5" /> Obnovit
            </Button>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <Bot className="mx-auto mb-2 h-8 w-8" />
              Zatím není uložen žádný odpovídající stav.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map(post => (
              <Card key={post.id} className="border-gray-200">
                <CardContent className="flex gap-4 p-4">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt=""
                      className="h-20 w-20 shrink-0 rounded-lg object-cover"
                    />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {post.platform === "facebook" ? (
                        <Facebook className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Instagram className="h-4 w-4 text-pink-600" />
                      )}
                      <strong>{post.recipeTitle}</strong>
                      <Badge className={STATUS_STYLES[post.status]}>
                        {STATUS_LABELS[post.status]}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Plán: {formatDate(post.scheduledFor)}
                      {post.publicationId &&
                        ` · OMNI job: ${post.publicationId}`}
                      {post.externalPostId &&
                        ` · Remote post: ${post.externalPostId}`}
                    </p>
                    {post.lastError && (
                      <p className="mt-2 rounded bg-red-50 px-2 py-1 text-xs text-red-700">
                        {post.lastError}
                      </p>
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

function StatusCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
          {label}
        </div>
        <div className="mt-1 font-bold text-gray-900">{value}</div>
      </CardContent>
    </Card>
  );
}
