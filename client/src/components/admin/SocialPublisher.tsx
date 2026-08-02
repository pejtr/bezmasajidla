import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Facebook,
  Instagram,
  Loader2,
  Play,
  RefreshCw,
  Send,
  Settings2,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const STATUS_LABELS = {
  scheduled: "Naplánováno",
  publishing: "Publikuje se",
  published: "Publikováno",
  failed: "Chyba",
} as const;

const STATUS_STYLES = {
  scheduled: "bg-blue-100 text-blue-700",
  publishing: "bg-amber-100 text-amber-700",
  published: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
} as const;

function formatDate(value: Date | string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("cs-CZ", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function SocialPublisher() {
  const [recipeId, setRecipeId] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const postsQuery = trpc.admin.socialPosts.useQuery(undefined, {
    refetchInterval: 10_000,
  });
  const configQuery = trpc.admin.socialPublisherStatus.useQuery();
  const recipesQuery = trpc.admin.allRecipes.useQuery();

  const refresh = async () => {
    await Promise.all([postsQuery.refetch(), configQuery.refetch()]);
  };

  const scheduleMutation = trpc.admin.scheduleRecipeSocial.useMutation({
    onSuccess: async () => {
      toast.success("Příspěvky pro Facebook a Instagram jsou ve frontě.");
      setRecipeId("");
      setScheduledFor("");
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
      if (result.disabled) {
        toast.error("Automatické publikování je v konfiguraci vypnuté.");
      } else if (result.processed === 0) {
        toast.info("Ve frontě nyní není žádný příspěvek k publikování.");
      } else {
        toast.success(`Zpracováno příspěvků: ${result.processed}`);
      }
      await refresh();
    },
    onError: error => toast.error(error.message),
  });

  const approvedRecipes = useMemo(
    () => recipesQuery.data?.filter(recipe => recipe.isApproved) ?? [],
    [recipesQuery.data],
  );
  const posts = postsQuery.data ?? [];
  const counts = {
    scheduled: posts.filter(post => post.status === "scheduled").length,
    published: posts.filter(post => post.status === "published").length,
    failed: posts.filter(post => post.status === "failed").length,
  };
  const config = configQuery.data;
  const isLoading =
    postsQuery.isLoading || configQuery.isLoading || recipesQuery.isLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-500">Automatizace</div>
            <div className="mt-1 flex items-center gap-2 font-semibold">
              {config?.enabled ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Aktivní
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Vypnutá
                </>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-500">Ve frontě</div>
            <div className="mt-1 text-2xl font-bold text-blue-700">
              {counts.scheduled}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-500">Publikováno</div>
            <div className="mt-1 text-2xl font-bold text-emerald-700">
              {counts.published}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-gray-500">Vyžaduje pozornost</div>
            <div className="mt-1 text-2xl font-bold text-red-700">
              {counts.failed}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 font-bold text-gray-900">
                <Settings2 className="h-5 w-5 text-emerald-700" />
                Připojení k Meta
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Citlivé údaje zůstávají pouze na serveru a v administraci se
                nikdy nezobrazují.
              </p>
            </div>
            <Badge variant="outline">
              Graph API {config?.graphApiVersion}
            </Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ConnectionStatus
              platform="facebook"
              configured={Boolean(config?.facebookConfigured)}
            />
            <ConnectionStatus
              platform="instagram"
              configured={Boolean(config?.instagramConfigured)}
            />
          </div>
          {!config?.enabled && (
            <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
              Pro spuštění nastavte na serveru{" "}
              <code>META_AUTO_PUBLISH_ENABLED=true</code> a doplňte Meta ID a
              token podle souboru <code>.env.example</code>.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-emerald-100">
        <CardContent className="p-5">
          <h2 className="mb-1 flex items-center gap-2 font-bold text-gray-900">
            <Clock3 className="h-5 w-5 text-emerald-700" />
            Naplánovat schválený recept
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            Při novém schválení se oba příspěvky vytvoří automaticky. Zde můžete
            doplnit starší recept nebo určit vlastní čas.
          </p>
          <div className="grid gap-3 md:grid-cols-[1fr_240px_auto]">
            <select
              value={recipeId}
              onChange={event => setRecipeId(event.target.value)}
              className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm"
              aria-label="Schválený recept"
            >
              <option value="">Vyberte schválený recept</option>
              {approvedRecipes.map(recipe => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.title}
                </option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={event => setScheduledFor(event.target.value)}
              className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm"
              aria-label="Čas publikování"
            />
            <Button
              className="bg-emerald-700 text-white hover:bg-emerald-600"
              disabled={!recipeId || scheduleMutation.isPending}
              onClick={() =>
                scheduleMutation.mutate({
                  recipeId: Number(recipeId),
                  scheduledFor: scheduledFor
                    ? new Date(scheduledFor)
                    : undefined,
                })
              }
            >
              {scheduleMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Naplánovat oba
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Publikační fronta
            </h2>
            <p className="text-sm text-gray-500">
              Stav se obnovuje automaticky každých 10 sekund.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => void refresh()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Obnovit
            </Button>
            <Button
              className="bg-gray-900 text-white hover:bg-gray-800"
              disabled={runMutation.isPending}
              onClick={() => runMutation.mutate()}
            >
              {runMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Zpracovat nyní
            </Button>
          </div>
        </div>

        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-gray-500">
              Fronta je zatím prázdná. Schvalte nový recept nebo naplánujte
              některý ze starších.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <Card key={post.id} className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt=""
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
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
                          <Facebook className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Instagram className="h-4 w-4 text-pink-600" />
                        )}
                        <span className="font-semibold text-gray-900">
                          {post.recipeTitle || `Recept #${post.recipeId}`}
                        </span>
                        <Badge className={STATUS_STYLES[post.status]}>
                          {STATUS_LABELS[post.status]}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Naplánováno: {formatDate(post.scheduledFor)}
                        {post.publishedAt &&
                          ` · Publikováno: ${formatDate(post.publishedAt)}`}
                        {` · Pokusů: ${post.attempts}`}
                      </p>
                      <p className="mt-2 line-clamp-2 whitespace-pre-line text-sm text-gray-600">
                        {post.caption}
                      </p>
                      {post.lastError && (
                        <p className="mt-2 rounded bg-red-50 px-2 py-1 text-xs text-red-700">
                          {post.lastError}
                        </p>
                      )}
                      {post.externalPostId && (
                        <p className="mt-1 text-xs text-gray-400">
                          Meta ID: {post.externalPostId}
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
                        <RefreshCw className="mr-2 h-3.5 w-3.5" />
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
    <div className="flex items-center justify-between rounded-lg border p-3">
      <span className="flex items-center gap-2 font-medium">
        {isFacebook ? (
          <Facebook className="h-4 w-4 text-blue-600" />
        ) : (
          <Instagram className="h-4 w-4 text-pink-600" />
        )}
        {isFacebook ? "Facebook stránka" : "Instagram účet"}
      </span>
      <Badge
        className={
          configured
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700"
        }
      >
        {configured ? "Připojeno" : "Chybí konfigurace"}
      </Badge>
    </div>
  );
}
