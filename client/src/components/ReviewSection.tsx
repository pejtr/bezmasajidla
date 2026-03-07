import { useState } from "react";
import { Star, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

interface ReviewSectionProps {
  restaurantSlug: string;
  restaurantName: string;
}

export default function ReviewSection({ restaurantSlug, restaurantName }: ReviewSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const { data: reviews = [], isLoading } = trpc.reviews.byRestaurant.useQuery({ slug: restaurantSlug });
  const { data: avgData } = trpc.reviews.avgRating.useQuery({ slug: restaurantSlug });

  const createReview = trpc.reviews.create.useMutation({
    onSuccess: () => {
      utils.reviews.byRestaurant.invalidate({ slug: restaurantSlug });
      utils.reviews.avgRating.invalidate({ slug: restaurantSlug });
      setNewRating(0);
      setNewComment("");
      toast.success("Recenze byla přidána!");
    },
    onError: () => toast.error("Nepodařilo se přidat recenzi."),
  });

  const deleteReview = trpc.reviews.delete.useMutation({
    onSuccess: () => {
      utils.reviews.byRestaurant.invalidate({ slug: restaurantSlug });
      utils.reviews.avgRating.invalidate({ slug: restaurantSlug });
      toast.success("Recenze byla smazána.");
    },
  });

  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) {
      toast.error("Prosím vyberte hodnocení (1–5 hvězdiček).");
      return;
    }
    createReview.mutate({
      restaurantSlug,
      rating: newRating,
      comment: newComment.trim() || undefined,
    });
  };

  const displayRating = hoverRating || newRating;

  return (
    <div className="bg-white rounded-xl border border-emerald-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3
          className="text-lg font-semibold text-gray-900"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Recenze
        </h3>
        {avgData && avgData.count > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="text-lg font-bold text-gray-900">{avgData.avg.toFixed(1)}</span>
            </div>
            <span className="text-sm text-gray-500">({avgData.count} recenzí)</span>
          </div>
        )}
      </div>

      {/* Write review form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
          <p className="text-sm font-medium text-gray-900 mb-3">
            Napište recenzi na {restaurantName}
          </p>

          {/* Star picker */}
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setNewRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    star <= displayRating
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300 fill-gray-100"
                  }`}
                />
              </button>
            ))}
            {displayRating > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                {displayRating === 1 && "Špatné"}
                {displayRating === 2 && "Podprůměrné"}
                {displayRating === 3 && "Průměrné"}
                {displayRating === 4 && "Dobré"}
                {displayRating === 5 && "Výborné"}
              </span>
            )}
          </div>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Sdílejte svůj zážitek z restaurace... (volitelné)"
            className="w-full p-3 rounded-lg border border-emerald-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            rows={3}
          />

          <div className="flex justify-end mt-3">
            <Button
              type="submit"
              disabled={createReview.isPending || newRating === 0}
              className="bg-emerald-700 hover:bg-emerald-600 text-white"
            >
              {createReview.isPending ? "Odesílám..." : "Odeslat recenzi"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center">
          <p className="text-sm text-gray-600 mb-3">
            Pro napsání recenze se prosím přihlaste.
          </p>
          <a href={getLoginUrl()}>
            <Button className="bg-emerald-700 hover:bg-emerald-600 text-white">
              Přihlásit se
            </Button>
          </a>
        </div>
      )}

      {/* Reviews list */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">Načítám recenze...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Star className="w-8 h-8 mx-auto mb-2 text-gray-200" />
          <p className="text-sm">Zatím žádné recenze. Buďte první!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {review.userName || "Anonymní uživatel"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("cs-CZ", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-200 fill-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  {user && user.id === review.userId && (
                    <button
                      onClick={() => deleteReview.mutate({ reviewId: review.id })}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Smazat recenzi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
