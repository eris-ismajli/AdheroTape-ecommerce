import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Heart,
  ShoppingCart,
  Sparkles,
  UserRound,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import Header from "../components/Header";
import { addToCart } from "../store/cart/actions";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../store/wishlist/actions";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [hasAdded, setHasAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // The indexes in the array of details. Default to the first element
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedWidth, setSelectedWidth] = useState(0);
  const [selectedLength, setSelectedLength] = useState(0);

  const wishlistItems = useSelector((state) => state.wishlist.items);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axiosInstance.get(`/shop/${id}`);
        const data = res.data;
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setActiveImage(data.images[0]);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Could not load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="flex items-center gap-3 text-sm tracking-widest">
          <Sparkles className="animate-spin" size={20} />
          <span>Loading product...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <p className="mb-4 text-red-400">{error || "Product not found."}</p>
        <button
          onClick={() => navigate("/shop")}
          className="px-4 py-2 rounded-full border border-yellow-400/60 text-yellow-300 text-sm hover:bg-yellow-400/10 transition"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const {
    title,
    price_raw,
    description,
    images = [],
    category,
    adhesive,
    carrier,
    color,
    total_thickness,
    sizes = [],
    sku,
  } = product;

  const isWishlisted = wishlistItems.some(
    (item) => Number(item.id) === Number(product.id)
  );

  const unitPrice = price_raw ? Number(price_raw.replace(/[^0-9.]/g, "")) : 0;
  const totalPrice = unitPrice * quantity;

  const colorsArray =
    typeof color === "string"
      ? color
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [];

  const uniqueWidths = [...new Set(sizes.map((size) => size.width))];
  const uniqueLengths = [...new Set(sizes.map((size) => size.length))];

  const safeDescription =
    description ||
    "Premium professional-grade tape engineered for clean removal, strong adhesion, and reliable performance in demanding environments.";

  const navLinks = [{ name: "About", endpoint: "/" }];
  const navButtons = [
    { name: "Wishlist", icon: Heart, endpoint: "/wishlist" },
    { name: "Cart", icon: ShoppingCart, endpoint: "/cart" },
    { name: "Profile", icon: UserRound, endpoint: "/" },
  ];

  const handleAddToCart = () => {
    const chosenColor = colorsArray[selectedColor];
    const chosenWidth = uniqueWidths[selectedWidth];
    const chosenLength = uniqueLengths[selectedLength];
    dispatch(
      addToCart(product, quantity, chosenColor, chosenWidth, chosenLength)
    );
    setHasAdded(true);

    setTimeout(() => {
      setHasAdded(false);
    }, 2000);
  };

  const colorMap = {
    beige: "#f5f5dc",
    black: "#ffffff",
    brown: "#8b4513",
    gray: "#6b7280",
    green: "#22c55e",
    navy: "#1e3a8a",
    "navy blue": "#1e3a8a",
    blue: "#3b82f6",
    purple: "#a855f7",
    red: "#ef4444",
    teal: "#14b8a6",
    white: "#ffffff",
    yellow: "#eab308",
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-zinc-950 via-[#050816] to-gray-950 text-white overflow-hidden pt-20">
      <Header navLinks={navLinks} navButtons={navButtons} showShop={true} />{" "}
      {/* Glowing blobs / midnight sky */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 -right-40 w-[650px] h-[650px] bg-blue-400/5 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 mx-0 sm:mx-14 px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/shop")}
            className="inline-flex items-center gap-2 text-lg text-zinc-300 hover:text-white transition group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span>Back to shop</span>
          </button>

          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="hidden md:inline">AdheroTape</span>
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            <span className="uppercase tracking-[0.2em] text-[10px] text-blue-300/80">
              PREMIUM INDUSTRIAL TAPE
            </span>
          </div>
        </div>

        {/* Main content */}
        <div
          className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]
 gap-10 lg:gap-12 items-start"
        >
          {/* Left: Image gallery + zoom */}
          <div className="space-y-5">
            {/* MAIN IMAGE — CLICK TO ZOOM */}
            <div
              className="relative w-full cursor-zoom-in overflow-hidden rounded-3xl"
              onClick={() => setZoomActive(!zoomActive)}
              onMouseMove={(e) => {
                if (!zoomActive) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setZoomPosition({ x, y });
              }}
            >
              <img
                src={activeImage}
                alt={title}
                className={`
      w-full h-auto object-contain transition-transform duration-300 ease-out
      ${zoomActive ? "scale-[2.4] cursor-zoom-out" : "scale-100"}
    `}
                style={{
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(toggleWishlist(product));
                }}
                className="absolute flex justify-end top-1 right-1 p-3 cursor-pointer w-16 h-16"
              >
                <Heart
                  size={35}
                  fill={isWishlisted ? "currentColor" : "rgba(0, 0, 0, 0.15)"}
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
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`relative shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl border transition-all duration-200 ${
                      img === activeImage
                        ? "border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.25)]"
                        : "border-white/10 hover:border-yellow-300/70 hover:shadow-[0_0_18px_rgba(250,204,21,0.20)]"
                    } bg-black/60 flex items-center justify-center`}
                  >
                    <img
                      src={img}
                      alt={`${title} ${index + 1}`}
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="space-y-8">
            <div>
              <p
                style={{ color: "rgb(1, 160, 242)" }}
                className="
    inline-flex items-center rounded-full 
    bg-gray-950/40 
    border border-blue-400/15
    px-4 py-2 text-[12px] uppercase tracking-[0.2em]
    mb-6
  "
              >
                {category || "Premium Tape"}
              </p>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-3 leading-tight">
                {title}
              </h1>
              {sku && (
                <p className="text-xs text-zinc-400 mb-1">
                  <span className="text-zinc-500">SKU:</span> {sku}
                </p>
              )}
              <p className="text-lg text-zinc-400 max-w-xl">
                {safeDescription}
              </p>
            </div>

            {/* Price + CTA */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-zinc-500 mb-1">
                  From
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold text-yellow-300">
                    {price_raw || "$—"}
                  </span>
                  <span className="text-xs text-zinc-400">per roll</span>
                </div>
                <div className="inline-flex items-center gap-2 mt-4 bg-gray-900/75 rounded-md px-2">
                  <button
                    // onClick={() => dispatch(removeOneFromCart(item.id))}
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="p-1 rounded-full text-xs font-semibold"
                  >
                    <ChevronDown color="white" size={24} />
                  </button>

                  <p>
                    <span className="text-gray-200 text-xl">{quantity}</span>
                  </p>
                  <button
                    // onClick={() => dispatch(addToCart(item))}
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 rounded-full text-xs font-semibol"
                  >
                    <ChevronUp color="white" size={24} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={hasAdded}
                  className={`
    flex items-center justify-center gap-2 relative

    ${
      hasAdded
        ? "bg-gradient-to-r from-green-400 to-green-500 animate-success-pulse"
        : "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400"
    }

    text-black font-semibold py-3 px-8 rounded-full
    transition-all duration-300 ease-out
    ${
      hasAdded
        ? "shadow-[0_0_22px_rgba(34,197,94,0.55)] hover:shadow-[0_0_34px_rgba(34,197,94,0.7)]"
        : "shadow-[0_0_20px_rgba(250,204,21,0.55)] hover:shadow-[0_0_30px_rgba(250,204,21,0.75)] hover:scale-[1.02]"
    }
    ${hasAdded && "cursor-default"}
    overflow-hidden
  `}
                >
                  {/* Background shine effect on hover */}
                  {!hasAdded && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  )}

                  {/* Button content */}
                  <div
                    className={`flex items-center justify-center gap-2 transition-all duration-300
                    ${hasAdded ? "opacity-0" : "opacity-100"}
                  `}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </div>
                  <div
                    className={`absolute flex items-center justify-center gap-2 transition-all duration-300 
                    ${hasAdded ? "opacity-100" : "opacity-0"}
                  `}
                  >
                    <Check className="w-5 h-5" />
                    Added to Cart!
                  </div>
                </button>
                <p className="mt-4 ml-2 text-lg">
                  Total{" "}
                  <span className="text-yellow-300 font-semibold">
                    ${totalPrice.toFixed(2)}
                  </span>
                </p>
              </div>

              {/* <button
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium bg-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.5)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] transition-transform duration-200 hover:-translate-y-0.5"
                // TODO: wire to your Redux addToCart if needed
                onClick={() => {
                  dispatch(addToCart(product));
                  console.log("Add to cart:", product.id);
                }}
              >
                <ShoppingCart size={16} />
                <span>Add to cart</span>
              </button> */}
            </div>

            <div className="flex gap-6 items-center text-sm">
              {colorsArray && colorsArray[selectedColor] && (
                <div className="flex gap-2 bg-gray-900/40 p-4 rounded-xl">
                  <span className="text-zinc-500 font-light">
                    SELECTED COLOR
                  </span>
                  <span className="text-blue-300">
                    {colorsArray[selectedColor].toUpperCase()}
                  </span>
                </div>
              )}

              {uniqueWidths && uniqueWidths[selectedWidth] && (
                <div className="flex gap-2 bg-gray-900/40 p-4 rounded-xl">
                  <span className="text-zinc-500 font-light">
                    SELECTED WIDTH
                  </span>
                  <span className="text-blue-300">
                    {uniqueWidths[selectedWidth].toUpperCase()}
                  </span>
                </div>
              )}

              {uniqueLengths && uniqueLengths[selectedLength] && (
                <div className="flex gap-2 bg-gray-900/40 p-4 rounded-xl">
                  <span className="text-zinc-500 font-light">
                    SELECTED LENGTH
                  </span>
                  <span className="text-blue-300">
                    {uniqueLengths[selectedLength].toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Specs */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div
                className="rounded-2xl border-t border-gray-800 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_0_12px_rgba(255,255,255,0.06)]
 bg-gradient-to-b from-black/0 to-black/30"
              >
                <p className="text-[13px] uppercase tracking-[0.2em] text-blue-300 mb-3">
                  Technical Specs
                </p>
                <dl className="space-y-2 text-sm">
                  {adhesive && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-zinc-500">Adhesive</dt>
                      <dd className="text-zinc-200">{adhesive}</dd>
                    </div>
                  )}
                  {carrier && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-zinc-500">Carrier</dt>
                      <dd className="text-zinc-200">{carrier}</dd>
                    </div>
                  )}
                  {total_thickness && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-zinc-500 whitespace-nowrap">
                        Total Thickness
                      </dt>
                      <dd className="text-zinc-200">{total_thickness}</dd>
                    </div>
                  )}

                  <div
                    style={{ marginBlock: "1rem" }}
                    className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
                  />

                  <p className="text-[13px] uppercase tracking-[0.2em] text-blue-300 mb-3">
                    Available Colors
                  </p>
                  {colorsArray && colorsArray.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {colorsArray.map((colour, idx) => {
                        const cssColor =
                          colorMap[colour.toLowerCase()] || "#3b82f6"; // fallback blue

                        const isSelected = selectedColor === idx;

                        return (
                          <div
                            key={idx}
                            onClick={() => setSelectedColor(idx)}
                            style={
                              isSelected
                                ? {
                                    borderColor: cssColor,
                                    boxShadow: `0 0 14px ${cssColor}88`,
                                  }
                                : undefined
                            }
                            className={`
            cursor-pointer text-zinc-100/90 rounded-xl bg-black/50 border
            ${isSelected ? "" : "border-white/5"}
            px-3 py-1.5 text-center
            transition-all duration-200 ease-out
            hover:-translate-y-0.5
            hover:bg-white/5
            ${!isSelected ? "hover:shadow-[0_6px_18px_rgba(0,0,0,0.35)]" : ""}
          `}
                          >
                            {colour}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400">
                      No information around the colors.
                    </p>
                  )}
                </dl>
              </div>

              <div
                className="rounded-2xl border-t border-gray-800 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_0_12px_rgba(255,255,255,0.06)]
 bg-gradient-to-b from-black/0 to-black/30"
              >
                <p className="flex items-center gap-1 text-[13px] uppercase tracking-[0.2em] text-blue-300 mb-3">
                  <Sparkles size={13} />
                  Available Sizes
                </p>

                {sizes && sizes.length > 0 ? (
                  <div className="space-y-1 text-xs">
                    <div className="flex gap-6 text-zinc-400 mb-1">
                      {/* Widths */}
                      <div className="flex-1">
                        <span className="block mb-1">Widths</span>
                        {uniqueWidths.map((width, idx) => (
                          <div key={idx} className="mb-1 cursor-pointer">
                            <div
                              onClick={() => setSelectedWidth(idx)}
                              className={`cursor-pointer text-zinc-100/90 rounded-xl bg-black/50 border 
${
  selectedWidth === idx
    ? "border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.45)]"
    : "border-white/5"
}
px-3 py-1.5 text-center
transition-all duration-200 ease-out
hover:-translate-y-0.5
hover:bg-white/5
hover:border-blue-400/60
hover:shadow-[0_6px_18px_rgba(0,0,0,0.35)]
`}
                            >
                              {width}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Lengths */}
                      <div className="flex-1">
                        <span className="block mb-1">Lengths</span>
                        {uniqueLengths.map((length, idx) => (
                          <div key={idx} className="mb-1 cursor-pointer">
                            <div
                              onClick={() => setSelectedLength(idx)}
                              className={`cursor-pointer text-zinc-100/90 rounded-xl bg-black/50 border 
${
  selectedLength === idx
    ? "border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.45)]"
    : "border-white/5"
}
px-3 py-1.5 text-center
transition-all duration-200 ease-out
hover:-translate-y-0.5
hover:bg-white/5
hover:border-blue-400/60
hover:shadow-[0_6px_18px_rgba(0,0,0,0.35)]
`}
                            >
                              {length}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400">
                    No information around the sizes.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
