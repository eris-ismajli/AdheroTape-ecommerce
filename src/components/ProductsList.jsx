import React, { useEffect, useState, useRef, useContext } from "react";
import {
  ShoppingCart,
  ShoppingBag,
  Search,
  Check,
  Loader2,
} from "lucide-react";
import FilterDropdown from "./FilterDropdown";
import axiosInstance from "../utils/axiosInstance";

import { useDispatch } from "react-redux";
import { addToCart } from "../store/cart/actions";
import { useNavigate } from "react-router-dom";

const ProductsList = ({ setIsAsideSticky }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const asideRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/shop");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();

  }, []);

  useEffect(() => {
    if (!asideRef.current) return;

    const checkStickyState = () => {
      const aside = asideRef.current;
      if (!aside) return;

      // Get the computed style to check if it's actually sticking
      const computedStyle = window.getComputedStyle(aside);
      const position = computedStyle.position;

      // For sticky elements, when they're sticking, they behave like fixed
      // We can check the actual position relative to viewport
      const rect = aside.getBoundingClientRect();

      // Check if the element is sticking:
      // 1. It has position: sticky
      // 2. Its top position is approximately 2px (accounting for rounding)
      // 3. It's visible in the viewport
      const isActuallySticking =
        position === "sticky" &&
        rect.top <= 10 &&
        rect.top >= 0 && // Within stickiness range
        rect.bottom > 0; // Still visible

      setIsAsideSticky(isActuallySticking);
    };

    // Check immediately
    checkStickyState();

    // Create a more reliable observer with rootMargin
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === asideRef.current) {
            if (entry.isIntersecting) {
              // Element is in viewport, check its sticky state
              checkStickyState();
            } else {
              // Element is out of viewport - not sticky
              setIsAsideSticky(false);
            }
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "-2px 0px 0px 0px", // Trigger 2px before it reaches top
      }
    );

    observer.observe(asideRef.current);

    // Use requestAnimationFrame for smoother scroll checks
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkStickyState();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [setIsAsideSticky]);

  const categoryFilters = [
    { name: "All" },
    { name: "Duct Tape" },
    { name: "Masking Tape" },
    { name: "Vinyl Tape" },
  ];

  const [categoryFilter, setCategoryFilter] = useState(() => {
    return localStorage.getItem("categoryFilter") || "All";
  });
  const [tapeNumber, setTapeNumber] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [addingStates, setAddingStates] = useState({});
  const [successStates, setSuccessStates] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("categoryFilter");
    if (saved) setCategoryFilter(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("categoryFilter", categoryFilter);
  }, [categoryFilter]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      categoryFilter === "All" ||
      product.category?.toLowerCase() === categoryFilter.toLowerCase();

    const matchesSearch = product.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    setTapeNumber(filteredProducts.length);
  }, [filteredProducts]);

  const handleAddToCart = (product, index) => {
    // Set loading state
    setAddingStates((prev) => ({ ...prev, [index]: true }));

    // Simulate API call delay if needed
    setTimeout(() => {
      dispatch(addToCart(product));

      // Set success state
      setAddingStates((prev) => ({ ...prev, [index]: false }));
      setSuccessStates((prev) => ({ ...prev, [index]: true }));

      // Reset success state after 2 seconds
      setTimeout(() => {
        setSuccessStates((prev) => ({ ...prev, [index]: false }));
      }, 2500);
    }, 300); // Small delay for better UX
  };

  return (
    <section className="relative py-32 text-white border-b border-white/5">
      {/* TITLE */}
      <div className="text-center transition-all duration-1000 opacity-100 translate-y-0">
        <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-400">
          Find your tape
        </h2>
        <p className="text-gray-400 text-lg mt-4">
          Industrial-grade tapes for every purpose — durable, reliable, and
          built to perform.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mt-16 mx-20 flex gap-6 justify-between">
        <div className="flex gap-6 max-h-10">
          {categoryFilters.map((filter, index) => (
            <button
              onClick={() => setCategoryFilter(filter.name)}
              key={index}
              className={`border border-yellow-400 px-4 py-1 rounded-full font-normal 
           transition-all duration-300 
           hover:bg-yellow-400 hover:text-black ${
             filter.name === categoryFilter
               ? "bg-yellow-400 text-black"
               : "bg-transparent text-white"
           }`}
            >
              {filter.name}
            </button>
          ))}
        </div>
        {/* Search Tapes */}
        <div>
          <div className="relative flex items-center max-w-md transition-all duration-300">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search color="gray" size={18} />
            </div>
            <input
              type="search"
              className="
    w-[15rem]
    pl-10 pr-4 py-2 font-normal rounded-full border border-gray-500
    focus:w-[20rem]
    focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent
    transition-all duration-300 bg-black/25
  "
              placeholder="Search Tapes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <h1
        style={{ borderTop: "1px solid rgba(255, 255, 255, 0.18)" }}
        className="shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_0_12px_rgba(255,255,255,0.04)]
 lg:block w-72 shrink-0 bg-gradient-to-b from-black/0 to-black/20
 rounded-2xl p-3 px-6 ml-6 mt-6"
      >
        {categoryFilter.endsWith("Tape")
          ? `${categoryFilter}s`
          : `${categoryFilter} Tapes`}
        : {tapeNumber}
      </h1>

      {/* LAYOUT: SIDEBAR + PRODUCT GRID */}
      <div
        className="container mx-auto mt-5 px-6 flex gap-10 relative"
        ref={containerRef}
      >
        {/* FILTER SIDEBAR */}
        <aside
          ref={asideRef}
          style={{ borderTop: "1px solid rgba(255, 255, 255, 0.18)" }}
          className="hidden shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_0_12px_rgba(255,255,255,0.04)]
 lg:block w-72 shrink-0 bg-gradient-to-b from-black/0 to-black/70
 rounded-2xl p-6 h-fit sticky top-2 transition-all duration-300"
        >
          <h3 className="text-xl font-semibold mb-6 text-white">Filters</h3>

          {/* PRICE FILTER */}
          <div className="mb-8">
            <p className="text-sm text-gray-300 mb-3">Price Range</p>
            <input
              type="range"
              min="0"
              max="100"
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>$0</span>
              <span>$100</span>
            </div>
          </div>

          {/* COLOR FILTER */}
          <div className="mb-8">
            <p className="text-sm text-gray-300 mb-3">Color</p>
            <div className="flex flex-wrap gap-2">
              {["Yellow", "Black", "Silver", "White"].map((color) => (
                <button
                  key={color}
                  className="px-3 py-1 rounded-full text-xs border border-white/10 text-gray-300 hover:border-blue-400 hover:text-blue-400 transition"
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* CATEGORY DROPDOWN */}
          <FilterDropdown
            label="Category"
            options={[
              "Carton Seal",
              "Double Sided",
              "Duct Tape",
              "Filament Tape",
              "Foam Tape",
              "Gaffers Tape",
              "High Bond Tape",
              "Masking Tape",
              "Poly Tape",
              "Vinyl Tape",
              "3M Safety",
              "GaffGun",
            ]}
            setCategoryFilter={setCategoryFilter}
          />

          {/* WIDTH FILTER */}
          <div className="mb-8">
            <p className="text-sm text-gray-300 mb-3">Width</p>
            <div className="flex flex-wrap gap-2">
              {["24mm", "36mm", "48mm", "72mm"].map((w) => (
                <button
                  key={w}
                  className="px-3 py-1 rounded-full text-xs border border-white/10 text-gray-300 hover:border-blue-400 hover:text-blue-400 transition"
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* LENGTH FILTER */}
          <div className="mb-4">
            <p className="text-sm text-gray-300 mb-3">Length</p>
            <div className="flex flex-wrap gap-2">
              {["5m", "10m", "25m", "50m", "100m"].map((l) => (
                <button
                  key={l}
                  className="px-3 py-1 rounded-full text-xs border border-white/10 text-gray-300 hover:border-blue-400 hover:text-blue-400 transition"
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {filteredProducts.length === 0 && (
          <h1 className="w-[50vw] text-xl">No results found.</h1>
        )}

        {/* PRODUCT GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 flex-1">
          {filteredProducts.map((product, i) => {
            const mainImage = product.images?.[0] ?? "/placeholder-tape.png";
            const isAdding = addingStates[i];
            const isSuccess = successStates[i];

            return (
              <div
                key={product.id ?? i}
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.18)" }}
                className="group min-h-[600px]  shadow-[0_4px_20px_rgba(0,0,0,0.35),inset_0_0_12px_rgba(255,255,255,0.04)]
bg-gradient-to-b from-black/100 to-black/0  rounded-2xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2"
              >
                <div
                  onClick={() => window.open(`/shop/${product.id}`, "_blank")}
                  className="relative w-full h-64 bg-black flex items-center justify-center overflow-hidden cursor-pointer"
                >
                  <img
                    src={mainImage}
                    alt={product.title}
                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div
                  onClick={() => window.open(`/shop/${product.id}`, "_blank")}
                  className="p-6 cursor-pointer"
                >
                  {product.category && (
                    <p
                      className="text-xs uppercase tracking-wide mb-1"
                      style={{ color: "rgb(1, 160, 242)" }}
                    >
                      {product.category}
                    </p>
                  )}

                  <h3 className="text-lg font-semibold text-white line-clamp-2">
                    {product.title}
                  </h3>

                  <p className="text-yellow-400 font-bold text-xl mt-3">
                    {product.price_raw}
                  </p>

                  {/* ⭐ REVIEW STARS */}
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, idx) => (
                      <svg
                        key={idx}
                        className="w-4 h-4 text-gray-500 group-hover:text-yellow-300 transition-colors duration-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.177c.969 0 1.371 1.24.588 1.81l-3.383 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.538 1.118l-3.383-2.46a1 1 0 00-1.175 0l-3.383 2.46c-.783.57-1.838-.196-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.048 9.394c-.783-.57-.38-1.81.588-1.81h4.177a1 1 0 00.95-.69l1.286-3.967z" />
                      </svg>
                    ))}

                    {/* rating text or number */}
                    <span className="text-gray-400 text-sm ml-1 group-hover:text-gray-200 transition-colors">
                      4.8 / 5
                    </span>
                  </div>
                </div>
                <div className="w-[92%] absolute bottom-4 self-center justify-self-center flex flex-col items-center justify-center gap-3">
                  <button className="w-full bg-black/15 flex items-center justify-center gap-2 text-yellow-200 border border-zinc-800 hover:text-yellow-200 hover:border-yellow-200 font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-yellow-400/30 transition-all duration-300">
                    <ShoppingBag className="w-5 h-5 text-yellow-200" />
                    Add to Wishlist
                  </button>

                  {/* Refined Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product, i)}
                    disabled={isAdding || isSuccess}
                    className={`
                    w-full flex items-center justify-center gap-2 relative
                    ${
                      isAdding
                        ? "bg-gradient-to-r from-blue-400 to-blue-500"
                        : isSuccess
                        ? "bg-gradient-to-r from-green-400 to-green-500 animate-success-pulse"
                        : "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400"
                    }
                    text-black font-semibold py-3 rounded-xl 
                    transition-all duration-300 ease-out
                    ${
                      !(isAdding || isSuccess) &&
                      "hover:shadow-lg hover:shadow-yellow-400/30 hover:scale-[1.02]"
                    }
                    ${isAdding && "cursor-not-allowed"}
                    ${isSuccess && "cursor-default"}
                    overflow-hidden
                  `}
                  >
                    {/* Background shine effect on hover */}
                    {!(isAdding || isSuccess) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    )}

                    {/* Button content */}
                    <div
                      className={`flex items-center justify-center gap-2 transition-all duration-300
                    ${isAdding || isSuccess ? "opacity-0" : "opacity-100"}
                  `}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </div>

                    {/* Button text that changes */}
                    <div
                      className={`absolute flex items-center justify-center gap-2 transition-all duration-300
                    ${isAdding ? "opacity-100" : "opacity-0"}
                  `}
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Adding...
                    </div>

                    <div
                      className={`absolute flex items-center justify-center gap-2 transition-all duration-300
                    ${isSuccess ? "opacity-100" : "opacity-0"}
                  `}
                    >
                      <Check className="w-5 h-5" />
                      Added to Cart!
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductsList;
