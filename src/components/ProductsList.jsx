import React, { useEffect, useState, useRef } from "react";
import { ArrowRight, ShoppingCart } from "lucide-react";

const ProductsList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // 🔥 Call YOUR backend instead of fakestoreapi
    fetch("http://localhost:4000/shop") // change port if needed
      .then((res) => res.json())
      .then((data) => {
        console.log("SHOP PRODUCTS:", data); // sanity check
        setProducts(data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  return (
    <section className="relative py-32 bg-gradient-to-br from-[#0B0B0D] via-[#0F0F12] to-[#0B0B0D] text-white border-b border-white/5 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary blobs - spread to corners */}
        <div className="absolute -top-80 -right-40 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-[800px] h-[800px] bg-purple-400/5 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      {/* TITLE */}
      <div
        className={`text-center transition-all duration-1000 ${"opacity-100 translate-y-0"}`}
      >
        <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-400">
          Our Product Range
        </h2>
        <p className="text-gray-400 text-lg mt-4">
          Industrial-grade tapes for every purpose — durable, reliable, and
          built to perform.
        </p>
      </div>

      {/* PRODUCT GRID */}
      <div
        className={`container mx-auto mt-20 px-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 transition-all duration-1000 ${"opacity-100 translate-y-0"}`}
      >
        {products.map((product, i) => {
          const mainImage =
            product.images && product.images.length > 0
              ? product.images[0]
              : "/placeholder-tape.png"; // optional fallback

          const sizesLabel =
            product.sizes && product.sizes.length > 0
              ? product.sizes
                  .map(
                    (s) =>
                      `${s.width || ""}${s.width && s.length ? " x " : ""}${
                        s.length || ""
                      }`
                  )
                  .join(", ")
              : null;

          return (
            <div
              key={product.id ?? i}
              className="group bg-black/30 border border-white/10 rounded-2xl overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-yellow-400/10"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div className="relative w-full h-64 bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={mainImage}
                  alt={product.title}
                  className="object-contain transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-6">
                {/* Category */}
                {product.category && (
                  <p
                    className="text-xs uppercase tracking-wide mb-1"
                    style={{ color: "rgb(1, 160, 242)" }}
                  >
                    {product.category}
                  </p>
                )}

                {/* Title */}
                <h3 className="text-lg font-semibold text-white line-clamp-2">
                  {product.title}
                </h3>

                {/* Price – already formatted in price_raw */}
                <p className="text-yellow-400 font-bold text-xl mt-3">
                  {product.price_raw}
                </p>

                {/* Sizes */}
                {sizesLabel && (
                  <p className="mt-2 text-xs text-gray-400">
                    Sizes: {sizesLabel}
                  </p>
                )}

                <button className="mt-5 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-yellow-400/30 transition-all duration-300">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CUSTOM ANIMATIONS */}
      <style>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
};

export default ProductsList;
