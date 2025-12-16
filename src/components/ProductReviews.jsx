import { useDispatch, useSelector } from "react-redux";
import Stars from "./Stars";
import {
  deleteReview,
  editReview,
  submitReview,
} from "../store/reviews/actions";
import { useEffect, useState } from "react";
import ReviewModal from "./ReviewModal";
import Modal from "./Modal";

const ProductReviews = ({ reviews = [], loading, productId }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // get current logged-in user
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

              <div className="flex justify-between items-center">
                {review.comment && (
                  <p className="mt-2 text-sm text-zinc-300">{review.comment}</p>
                )}

                {review && user && review.user_id === user.id && (
                  <div className="flex gap-4 mt-4">
                    <button
                      className="text-sm text-blue-400 hover:text-blue-500"
                      onClick={() => {
                        setEditingReviewId(review.id);
                        setEditRating(review.rating);
                        setEditComment(review.comment || "");
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm text-red-400 hover:text-red-500"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete
                    </button>
                  </div>
                )}

                {editingReviewId === review.id && (
                  <ReviewModal
                    submitting={false}
                    onClose={() => setEditingReviewId(null)}
                    onSubmit={({ rating, comment }) => {
                      dispatch(
                        editReview({
                          reviewId: review.id,
                          productId,
                          rating,
                          comment,
                        })
                      );
                      setEditingReviewId(null);
                    }}
                    message={"Edit review"}
                    currentComment={review.comment}
                    currentRating={review.rating}
                    isEditing={true}
                  />
                )}

                {showDeleteModal && (
                  <Modal
                    message={
                      "Are you sure you want to permanently delete this review?"
                    }
                    onConfirm={() => {
                      dispatch(deleteReview(productId));
                      setShowDeleteModal(false);
                    }}
                    onCancel={() => setShowDeleteModal(false)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductReviews;
