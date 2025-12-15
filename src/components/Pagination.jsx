import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, total, limit = 12, onPageChange }) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const pages = [];

  // show max 5 page buttons
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-3 mt-16">
      {/* PREVIOUS */}
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className={`
          flex items-center gap-1 px-4 py-2 rounded-lg
          text-yellow-400
          transition
          ${
            page === 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-yellow-400 hover:text-black"
          }
        `}
      >
        <ChevronLeft size={16} />
        Prev
      </button>

      {/* NUMBERS */}
      {start > 1 && (
        <button
          onClick={() => onPageChange(1)}
          className="px-3 py-2 rounded-lg text-yellow-400 hover:bg-yellow-400 hover:text-black transition"
        >
          1
        </button>
      )}

      {start > 2 && <span className="text-yellow-400/50">…</span>}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`
            px-4 py-2 rounded-lg font-semibold transition
            ${
              p === page
                ? "bg-yellow-400 text-black shadow-[0_0_14px_rgba(250,204,21,0.6)]"
                : "text-yellow-400 hover:bg-yellow-400 hover:text-black"
            }
          `}
        >
          {p}
        </button>
      ))}

      {end < totalPages - 1 && <span className="text-yellow-400/50">…</span>}

      {end < totalPages && (
        <button
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-2 rounded-lg text-yellow-400 hover:bg-yellow-400 hover:text-black transition"
        >
          {totalPages}
        </button>
      )}

      {/* NEXT */}
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`
          flex items-center gap-1 px-4 py-2 rounded-lg
          text-yellow-400
          transition
          ${
            page === totalPages
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-yellow-400 hover:text-black"
          }
        `}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
