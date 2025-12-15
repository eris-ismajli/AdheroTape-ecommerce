import Stars from "./Stars";

const ProductReviews = ({ reviews = [], loading }) => {
  return (
    <section className="mt-20 w-full bg-black/30 border border-white/5 p-8 rounded-2xl">
      <h3 className="text-xl font-semibold text-white mb-6">
        Customer reviews
      </h3>

      {loading && <p className="text-zinc-400 text-sm">Loading reviews…</p>}

      {!loading && reviews.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-black/40 p-6 text-zinc-400 text-sm">
          No reviews yet. Be the first to leave one.
        </div>
      )}

      <div className="space-y-6">
        {reviews.map((review) => {
          if (!review) return null;

          return (
            <div key={review.id} className="border-b border-white/10 py-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white font-medium">
                  {review.user_name || "Anonymous"}
                </span>
                <span className="text-xs text-zinc-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={
                      i <= review.rating ? "text-yellow-400" : "text-zinc-700"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>

              {review.comment && (
                <p className="mt-2 text-sm text-zinc-300">{review.comment}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductReviews;
