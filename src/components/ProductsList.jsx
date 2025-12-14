import React, { useEffect, useState, useRef, useContext } from "react";
import {
  ShoppingCart,
  ShoppingBag,
  Search,
  Check,
  Loader2,
  Heart,
} from "lucide-react";
import FilterDropdown from "./FilterDropdown";
import axiosInstance from "../utils/axiosInstance";

import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cart/actions";
import { useNavigate } from "react-router-dom";
import { toggleWishlist } from "../store/wishlist/actions";

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

  const [successStates, setSuccessStates] = useState({});

  useEffect(() => {
    const savedFilters = localStorage.getItem("categoryFilter");
    if (savedFilters) setCategoryFilter(savedFilters);
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
    const { color, sizes = [] } = product;

    const colorsArray =
      typeof color === "string"
        ? color
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [];

    const uniqueWidths = [...new Set(sizes.map((size) => size.width))];
    const uniqueLengths = [...new Set(sizes.map((size) => size.length))];

    const defaultColor = colorsArray[0];
    const defaultWidth = uniqueWidths[0];
    const defaultLength = uniqueLengths[0];

    dispatch(addToCart(product, 1, defaultColor, defaultWidth, defaultLength));

    setSuccessStates((prev) => ({ ...prev, [index]: true }));

    setTimeout(() => {
      setSuccessStates((prev) => ({ ...prev, [index]: false }));
    }, 2000);
  };

  const wishlistItems = useSelector((state) => state.wishlist.items);

  return (
    <section className="relative py-32 text-white border-b border-white/5">
      {/* TITLE */}
      <div className="text-center transition-all duration-1000 opacity-100 translate-y-0">
        <h2 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-400">
          Find your tape
        </h2>
        <p className="text-gray-400 text-lg mt-4">
          Industrial-grade tapes for every purpose — durable, reliable, and
          built to perform.
        </p>
      </div>

      {/* Category Filter */}
      <div className="my-16 mx-8 flex gap-8 justify-center">
        <div className="flex gap-6 max-h-10">
          {categoryFilters.map((filter, index) => (
            <button
              onClick={() => setCategoryFilter(filter.name)}
              key={index}
              className={`border border-yellow-300/50 px-4 rounded-full
           transition-all duration-300 text-[12px] uppercase tracking-[0.2em] scale-105
           hover:bg-yellow-400 hover:text-black ${
             filter.name === categoryFilter
               ? "bg-yellow-500 text-black"
               : "bg-transparent text-white/70"
           }`}
            >
              {filter.name}
            </button>
          ))}
        </div>

        {/* Search Tapes */}
        <div className="flex items-center gap-6">
          {/* <h1
            className="
 text-white/60"
          >
            {searchQuery.trim() === ""
              ? categoryFilter.endsWith("Tape")
                ? `${categoryFilter}s`
                : `${categoryFilter} Tapes`
              : "Search Results"}
            <span className="text-yellow-400/60"> {tapeNumber}</span>
          </h1> */}
          <div className="relative flex items-center max-w-md transition-all duration-300">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search color="gray" size={18} />
            </div>
            <input
              type="search"
              className="
    w-[15rem]
    pl-10 pr-4 py-2 font-normal rounded-full border border-gray-500/50 scale-105
    focus:w-[20rem]
    focus:outline-none focus:border-yellow-400 focus:border-transparent
    transition-all duration-300 bg-black/25 placeholder-zinc-600
  "
              placeholder="Search Tapes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* <h1
        className="
 lg:block w-72 shrink-0 bg-transparent
 rounded-2xl ml-8 mt-6 text-white/60"
      >
        {searchQuery.trim() === ""
          ? categoryFilter.endsWith("Tape")
            ? `${categoryFilter}s`
            : `${categoryFilter} Tapes`
          : "Search Results"}
        <span className="text-yellow-400/60"> {tapeNumber}</span>
      </h1> */}

      {/* LAYOUT: SIDEBAR + PRODUCT GRID */}
      <div
        className="mx-auto mt-5 px-6 flex gap-10 relative"
        ref={containerRef}
      >
        {/* FILTER SIDEBAR */}
        <aside
          ref={asideRef}
          className="w-[300px] p-6 h-fit sticky top-2 transition-all duration-300"
        >
          <div className="w-[2px] bg-yellow-400/70 rounded-l-full h-full absolute left-0"/>
          <h3 className="text-xl font-semibold mb-6 text-white">Filters</h3>

          {/* PRICE FILTER */}
          <div className="mb-8">
            <p className="text-sm text-gray-300 mb-3">Price Range</p>
            <input
              type="range"
              min="0"
              max="100"
              className="w-full accent-yellow-500"
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 flex-1 items-start">
          {filteredProducts.map((product, i) => {
            const mainImage = product.images?.[0] ?? "/placeholder-tape.png";

            const isSuccess = successStates[i];

            const isWishlisted = wishlistItems.some(
              (item) => Number(item.id) === Number(product.id)
            );

            return (
              <div
                onClick={() => navigate(`${product.id}`)}
                className="
    rounded-2xl
    overflow-hidden
    bg-black
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
                      dispatch(toggleWishlist(product));
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
                      handleAddToCart(product, i);
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
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductsList;
