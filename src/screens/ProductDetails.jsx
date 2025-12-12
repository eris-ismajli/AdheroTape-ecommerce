import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Sparkles, UserRound } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import Header from "../components/Header";
import { addToCart } from "../store/cart/actions";
import { useDispatch } from "react-redux";

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

  const safeDescription =
    description ||
    "Premium professional-grade tape engineered for clean removal, strong adhesion, and reliable performance in demanding environments.";

  const navLinks = [
    { name: "About", endpoint: "/" },
  ];
  const navButtons = [
    { name: "Profile", icon: UserRound, endpoint: "/" },
    { name: "Cart", icon: ShoppingCart, endpoint: "/cart" },
  ];

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
                {category || "Premium Tape"} • {color || "Natural"}
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
              </div>

              <button
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium bg-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.5)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] transition-transform duration-200 hover:-translate-y-0.5"
                // TODO: wire to your Redux addToCart if needed
                onClick={() => {
                  dispatch(addToCart(product));
                  console.log("Add to cart:", product.id);
                }}
              >
                <ShoppingCart size={16} />
                <span>Add to cart</span>
              </button>
            </div>

            {/* Specs */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div
                style={{ borderTop: "1px solid rgba(255, 255, 255, 0.18)" }}
                className="rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_0_12px_rgba(255,255,255,0.1)]
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
                  {color && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-zinc-500">Color</dt>
                      <dd className="text-zinc-200">{color}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div
                style={{ borderTop: "1px solid rgba(255, 255, 255, 0.18)" }}
                className="rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_0_12px_rgba(255,255,255,0.1)]
 bg-gradient-to-b from-black/0 to-black/30"
              >
                <p className="flex items-center gap-1 text-[13px] uppercase tracking-[0.2em] text-blue-300 mb-3">
                  <Sparkles size={13} />
                  Available Sizes
                </p>

                {sizes && sizes.length > 0 ? (
                  <div className="space-y-1 text-xs">
                    <div className="flex text-zinc-400 mb-1">
                      <span className="w-1/2">Width</span>
                      <span className="w-1/2">Length</span>
                    </div>
                    {sizes.map((size, idx) => (
                      <div
                        key={idx}
                        className="flex text-zinc-100/90 rounded-xl bg-black/50 border border-white/5 px-3 py-1.5 mb-1"
                      >
                        <span className="w-1/2">{size.width}</span>
                        <span className="w-1/2">{size.length}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400">
                    Size information will be available soon.
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
