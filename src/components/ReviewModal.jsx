import { X } from "lucide-react";
import { useState } from "react";

const ReviewModal = ({ onClose, onSubmit, submitting }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-zinc-950 border border-white/10 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X />
        </button>

        <h3 className="text-lg font-semibold text-white mb-4">
          Leave a review
        </h3>

        {/* Stars */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              onClick={() => setRating(i)}
              className={`text-2xl transition ${
                i <= rating ? "text-yellow-400" : "text-zinc-600"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        {/* Comment */}
        <textarea
          rows={4}
          placeholder="Write a comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="
            w-full rounded-xl bg-black/40 border border-white/10
            p-3 text-sm text-white placeholder-zinc-500
            focus:outline-none focus:border-yellow-400
          "
        />

        <button
          disabled={rating === 0 || submitting}
          onClick={() => onSubmit({ rating, comment })}
          className={`
            mt-5 w-full py-3 rounded-full font-semibold
            ${
              rating === 0
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                : "bg-yellow-400 text-black hover:bg-yellow-300"
            }
          `}
        >
          {submitting ? "Submitting…" : "Submit review"}
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
