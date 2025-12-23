import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const Pagination = ({ page, total, limit = 12, onPageChange }) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const pages = [];

  // Responsive page window calculation
  const getPageWindow = () => {
    if (window.innerWidth < 640) { // Mobile
      return { start: Math.max(1, page - 1), end: Math.min(totalPages, page + 1) };
    } else if (window.innerWidth < 1024) { // Tablet
      return { start: Math.max(1, page - 2), end: Math.min(totalPages, page + 2) };
    } else { // Desktop
      return { start: Math.max(1, page - 2), end: Math.min(totalPages, page + 2) };
    }
  };

  const { start, end } = getPageWindow();

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3 mt-10 sm:mt-12 md:mt-16 flex-wrap">
      {/* FIRST PAGE (Desktop only) */}
      <button
        disabled={page === 1}
        onClick={() => onPageChange(1)}
        className={`
          hidden md:flex items-center gap-1 px-3 py-2 rounded-lg
          text-yellow-400 text-sm md:text-base
          transition
          ${
            page === 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-yellow-400 hover:text-black"
          }
        `}
      >
        <ChevronsLeft size={16} />
        <span className="hidden lg:inline">First</span>
      </button>

      {/* PREVIOUS */}
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className={`
          flex items-center gap-1 px-3 py-2 rounded-lg
          text-yellow-400 text-sm md:text-base
          transition
          ${
            page === 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-yellow-400 hover:text-black"
          }
        `}
      >
        <ChevronLeft size={14} md:size={16} />
        <span className="hidden xs:inline">Prev</span>
      </button>

      {/* NUMBERS */}
      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="hidden sm:block px-2 sm:px-3 py-2 rounded-lg text-yellow-400 hover:bg-yellow-400 hover:text-black transition text-sm md:text-base"
          >
            1
          </button>
          {start > 2 && <span className="hidden sm:inline text-yellow-400/50 text-sm md:text-base">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`
            px-3 sm:px-4 py-2 rounded-lg font-semibold transition text-sm md:text-base
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

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="hidden sm:inline text-yellow-400/50 text-sm md:text-base">…</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="hidden sm:block px-2 sm:px-3 py-2 rounded-lg text-yellow-400 hover:bg-yellow-400 hover:text-black transition text-sm md:text-base"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Mobile ellipsis for more pages */}
      {end < totalPages && (
        <span className="sm:hidden text-yellow-400/50 text-sm px-2">…</span>
      )}

      {/* NEXT */}
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`
          flex items-center gap-1 px-3 py-2 rounded-lg
          text-yellow-400 text-sm md:text-base
          transition
          ${
            page === totalPages
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-yellow-400 hover:text-black"
          }
        `}
      >
        <span className="hidden xs:inline">Next</span>
        <ChevronRight size={14} md:size={16} />
      </button>

      {/* LAST PAGE (Desktop only) */}
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(totalPages)}
        className={`
          hidden md:flex items-center gap-1 px-3 py-2 rounded-lg
          text-yellow-400 text-sm md:text-base
          transition
          ${
            page === totalPages
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-yellow-400 hover:text-black"
          }
        `}
      >
        <span className="hidden lg:inline">Last</span>
        <ChevronsRight size={16} />
      </button>

      {/* Mobile Page Info */}
      <div className="sm:hidden text-yellow-400/70 text-xs px-3 py-2">
        {page} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;