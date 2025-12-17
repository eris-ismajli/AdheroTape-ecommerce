import { Check, Heart, ShoppingCart } from "lucide-react";
import React from "react";
import EventBus from "../utils/eventBus";

const ProductCard = React.memo(function ProductCard({
  product,
  isSuccess,
  isWishlisted,
  onNavigate,
  onToggleWishlist,
  onAddToCart,
}) {
  const mainImage = product.images?.[0] ?? "/placeholder-tape.png";

  return (
    <div
      onClick={() => onNavigate(product.id)}
      className="
                shadow-[0_8px_24px_rgba(0,0,0,0.2)] rounded-2xl overflow-hidden bg-black
  "
    >
      <div
        className="
      group
      relative
      w-full
      cursor-pointer
      duration-500
      ease-[cubic-bezier(0.4,0,0.2,1)]
    "
      >
        {/* IMAGE */}
        <img
          src={mainImage}
          alt={product.title}
          className="
        object-contain
        duration-700
        ease-out
        group-hover:scale-110
      "
        />

        {/* VIGNETTE */}
        <div
          className="
        pointer-events-none
        absolute inset-0
        bg-gradient-to-t
        from-black/60 via-black/10 to-transparent
        opacity-0
        transition-opacity
        duration-500
        group-hover:opacity-100
      "
        />

        {/* WISHLIST */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
            EventBus.emit("showHeader")
          }}
          className="absolute top-3 right-3 z-10"
        >
          <Heart
            size={28}
            fill={isWishlisted ? "currentColor" : "rgba(0,0,0,0.15)"}
            className={`
          transition-colors duration-150
          drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]
          ${
            isWishlisted
              ? "text-yellow-300"
              : "text-white/70 hover:text-yellow-300"
          }
        `}
          />
        </div>

        <div
          className="
        absolute
        bottom-2
        left-1/2
        -translate-x-1/2
        w-[95%]

        bg-gray-950/70
        backdrop-blur-[7px]
        rounded-xl
        p-5

        duration-500
        ease-out
      "
        >
          {product.category && (
            <p className="text-xs uppercase tracking-wide mb-1 absolute top-4 right-4 text-blue-400">
              {product.category}
            </p>
          )}

          <p
            className="
    text-yellow-400 font-bold text-2xl
    transition-all duration-300 ease-out mb-3
    group-hover:text-yellow-200
    group-hover:drop-shadow-[0_0_14px_rgba(250,204,21,0.85)]
  "
          >
            {product.price_raw}
          </p>

          <h3 className="text-lg font-semibold text-white line-clamp-1">
            {product.title}
          </h3>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
            EventBus.emit("showHeader")
          }}
          disabled={isSuccess}
          className={`
    px-6 py-2 flex items-center justify-center gap-1.5 absolute top-2 left-2 shadow-[0_4px_11px_rgba(0,0,0,0.25)]

    ${
      isSuccess
        ? "bg-gradient-to-r from-green-400 to-green-500 animate-success-pulse"
        : "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400"
    }
    text-black text-sm font-semibold
 rounded-[10px]
    transition-all duration-300 ease-out
    ${
      !isSuccess &&
      "hover:shadow-md hover:shadow-yellow-400/25 hover:scale-[1.015]"
    }
    ${isSuccess && "cursor-default"}
    overflow-hidden
  `}
        >
          {/* Background shine */}
          {!isSuccess && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          )}

          {/* Default */}
          <div
            className={`flex items-center justify-center gap-1.5 transition-all duration-300
      ${isSuccess ? "opacity-0" : "opacity-100"}
    `}
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </div>

          {/* Success */}
          <div
            className={`absolute flex items-center justify-center gap-1.5 transition-all duration-300
      ${isSuccess ? "opacity-100" : "opacity-0"}
    `}
          >
            <Check className="w-4 h-4" />
            Added
          </div>
        </button>
      </div>
    </div>
  );
});

export default ProductCard