import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import {
  ShoppingCart,
  ShoppingBag,
  Search,
  Check,
  Loader2,
  Heart,
  ChevronUp,
  ChevronDown,
  X,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import FilterDropdown from "./FilterDropdown";
import axiosInstance from "../utils/axiosInstance";

import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cart/actions";
import { toggleWishlist } from "../store/wishlist/actions";

import Pagination from "./Pagination";
import ProductCard from "./ProductCard";

const ITEMS_PER_PAGE = 12;

const CATEGORY_FILTERS = [
  "All Tapes",
  "Duct Tape",
  "Masking Tape",
  "Vinyl Tape",
];

const SIDEBAR_CATEGORIES = [
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
];

const ProductsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") ?? "All Tapes";
  const page = Number(searchParams.get("page") ?? 1);
  const search = searchParams.get("search") ?? "";

  const [products, setProducts] = useState([]);
  const [tapeNumber, setTapeNumber] = useState(0);

  const maxPriceFromUrl = Number(searchParams.get("maxPrice") ?? 100);
  const [priceRange, setPriceRange] = useState(maxPriceFromUrl);

  useEffect(() => {
    setPriceRange(maxPriceFromUrl);
  }, [maxPriceFromUrl]);

  useEffect(() => {
    return () => {
      if (priceDebounceRef.current) {
        clearTimeout(priceDebounceRef.current);
      }
    };
  }, []);

  const requestIdRef = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const reqId = ++requestIdRef.current;

    const fetchProducts = async () => {
      try {
        const params = {
          category: category !== "All Tapes" ? category : undefined,
          search: search || undefined,
          maxPrice: maxPriceFromUrl < 100 ? maxPriceFromUrl : undefined,
          page,
          limit: ITEMS_PER_PAGE,
        };

        const res = await axiosInstance.get("/shop", {
          params,
          signal: controller.signal,
        });

        // ignore stale responses
        if (reqId !== requestIdRef.current) return;

        setProducts(res.data.data || []);
        setTapeNumber(Number(res.data.total ?? 0));
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("GET /shop error:", err);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [category, search, page, maxPriceFromUrl]);

  const changeCategory = useCallback(
    (cat) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        next.set("category", cat);
        next.set("page", "1"); // reset page on category change

        return next;
      });
    },
    [setSearchParams]
  );

  const clearAllFilters = useCallback(() => {
    setSearchParams({
      category: "All Tapes",
      page: "1",
    });

    setShowSidebar(false); // optional but recommended
  }, [setSearchParams]);

  const goToPage = useCallback(
    (p) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", String(p));
        return next;
      });
    },
    [setSearchParams]
  );

  const totalPages = useMemo(() => {
    const tp = Math.ceil(tapeNumber / ITEMS_PER_PAGE);
    return Number.isFinite(tp) && tp > 0 ? tp : 1;
  }, [tapeNumber]);

  const [searchDraft, setSearchDraft] = useState(search);
  const debounceRef = useRef(null);
  const priceDebounceRef = useRef(null);

  // keep input synced if URL changes (back/forward, manual URL edits, etc.)
  useEffect(() => {
    setSearchDraft(search);
  }, [search]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const onSearchChange = useCallback(
    (e) => {
      if (category !== "All Tapes") changeCategory("All Tapes");
      const value = e.target.value;
      setSearchDraft(value);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.set("search", value);
          next.set("page", "1");
          return next;
        });
      }, 300);
    },
    [setSearchParams]
  );

  const [categoryDropdownOpened, setCategoryDropdownOpened] = useState(true);

  const wishlistItems = useSelector((state) => state.wishlist.items);

  const wishlistIdSet = useMemo(() => {
    const set = new Set();
    for (const item of wishlistItems || []) {
      set.add(Number(item.id));
    }
    return set;
  }, [wishlistItems]);

  const [showSidebar, setShowSidebar] = useState(false);

  // success state keyed by product.id for correctness + less weirdness on pagination
  const [successStates, setSuccessStates] = useState({});
  const successTimeoutsRef = useRef({});

  useEffect(() => {
    return () => {
      const timeouts = successTimeoutsRef.current;
      Object.keys(timeouts).forEach((k) => clearTimeout(timeouts[k]));
    };
  }, []);

  const handleAddToCart = useCallback(
    (product) => {
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

      const defaultColor = colorsArray[0] ?? null;
      const defaultWidth = uniqueWidths[0] ?? null;
      const defaultLength = uniqueLengths[0] ?? null;

      dispatch(
        addToCart({
          product,
          quantity: 1,
          chosenColor: defaultColor,
          chosenWidth: defaultWidth,
          chosenLength: defaultLength,
        })
      );

      const key = String(product.id ?? "");
      if (!key) return;

      setSuccessStates((prev) => ({ ...prev, [key]: true }));

      if (successTimeoutsRef.current[key]) {
        clearTimeout(successTimeoutsRef.current[key]);
      }

      successTimeoutsRef.current[key] = setTimeout(() => {
        setSuccessStates((prev) => {
          if (!prev[key]) return prev;
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }, 2000);
    },
    [dispatch]
  );

  const onToggleWishlist = useCallback(
    (product) => {
      dispatch(toggleWishlist(product));
    },
    [dispatch]
  );

  const onNavigate = useCallback(
    (id) => {
      navigate(`${id}`);
    },
    [navigate]
  );

  useEffect(() => {
    if (!showSidebar) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // prevent layout shift caused by scrollbar disappearance
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [showSidebar]);

  const headerTitle = useMemo(() => {
    if (search) return "Search Results";
    if (category.endsWith("Tape")) return `${category}s`;

    if (category === "All Tapes") return "All Tapes";
    return `${category} Tapes`;
  }, [category, search]);

  return (
    <section className="relative py-32 text-white border-b border-white/5 px-20">
      {/* TITLE */}
      <div className="text-center transition-all duration-1000 opacity-100 translate-y-0">
        <h2 className="text-3xl font-light bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-400">
          Find your tape
        </h2>
        <p className="text-gray-400 mt-4">
          Industrial-grade tapes for every purpose — durable, reliable, and
          built to perform.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mt-14 flex gap-8 justify-between items-center bg-gray-900 rounded-full p-3 px-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSidebar((p) => !p)}
            className="border border-blue-300 p-3 rounded-full bg-black/25 text-white/70 hover:text-black hover:bg-blue-300"
          >
            <SlidersHorizontal size={17} />
          </button>
          <h1 className="text-white/60 flex">
            {headerTitle}
            <span className="ml-2 text-xs font-semibold w-6 h-6 flex items-center justify-center rounded bg-red-600 text-white shadow-[0_0_10px_rgba(255,0,0,0.6)]">
              {tapeNumber}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-6">
            {CATEGORY_FILTERS.map((filter, index) => (
              <button
                onClick={() => {
                  if (filter !== category) {
                    changeCategory(filter);
                  } else {
                    changeCategory("All Tapes");
                  }
                }}
                key={index}
                className={`border border-blue-300 px-4 py-2 rounded-full
           transition-all duration-300 text-[11px] uppercase tracking-[0.2em] scale-105
           hover:bg-blue-300 hover:text-black ${
             filter === category
               ? "bg-blue-500 text-black border-none"
               : "bg-black/25 text-white/70"
           }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <div className="relative flex items-center max-w-md transition-all duration-300">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search color="gray" size={18} />
              </div>
              <input
                type="search"
                className="
          w-[15rem]
          pl-10 pr-4 py-1.5 font-normal rounded-full border border-gray-500/50 scale-105
          focus:w-[20rem]
          focus:outline-none focus:border-blue-400
          transition-all duration-300 bg-black/25 placeholder-zinc-600
        "
                placeholder="Search Tapes..."
                value={searchDraft}
                onChange={onSearchChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* LAYOUT: SIDEBAR + PRODUCT GRID */}
      <div className="mx-auto mt-5 flex gap-4 relative">
        {/* FILTER SIDEBAR */}
        <div
          className={`
    fixed inset-0 z-50
 bg-black/40
    transition-opacity duration-300
    ${showSidebar ? "opacity-100" : "opacity-0 pointer-events-none"}
  `}
          onClick={() => setShowSidebar(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className={`
    fixed top-0 left-0 h-full w-[400px]
    bg-black border-r border-white/10
    shadow-[0_20px_60px_rgba(0,0,0,0.6)]
    p-6 overflow-y-auto z-50
    transform transition-transform duration-300 ease-out
    ${showSidebar ? "translate-x-0" : "-translate-x-full"}
  `}
          >
            {" "}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold text-yellow-500">
                  FILTERS
                </h3>
                <button
                  onClick={clearAllFilters}
                  className="
      text-xs uppercase tracking-widest
      px-3 py-1.5 rounded-full
      border border-red-500/30
      text-red-400
      hover:bg-red-500 hover:text-white
      transition-all duration-200
    "
                >
                  Clear all
                </button>
              </div>
              <button onClick={() => setShowSidebar(false)}>
                <X />
              </button>
            </div>
            {/* CATEGORY DROPDOWN */}
            <section className="mb-10">
              <p
                className="
  text-[10px]
  uppercase
  tracking-[0.25em]
  text-white/40
  mb-3
"
              >
                Category
              </p>

              {/* PARENT */}
              <button
                onClick={() => {
                  setCategoryDropdownOpened((p) => !p);
                }}
                className={`
      w-full flex items-center justify-between
      text-sm text-gray-200
       rounded-lg py-3 px-5
      transition-all duration-200 ease-out
      hover:-translate-y-[1px] active:translate-y-0
      hover:bg-gray-900/80 bg-black/20
      ${categoryDropdownOpened ? "border-none" : "border border-gray-800/50"}
    `}
              >
                <div className="flex items-center gap-2 justify-between w-full pr-2">
                  <span
                    className={`
          transition-colors duration-200
        `}
                  >
                    {category}
                  </span>

                  {/* optional count badge */}
                  <span className="ml-2 text-[10px] w-6 h-6  flex items-center justify-center rounded bg-red-500 text-white transition-transform duration-200 ease-out group-hover:scale-[1.03]">
                    {tapeNumber}
                  </span>
                </div>

                <span
                  className={`
        text-gray-500 text-sm
        transition-transform duration-200 ease-out
        ${categoryDropdownOpened ? "rotate-180" : "rotate-0"}
      `}
                >
                  {categoryDropdownOpened ? <ChevronUp /> : <ChevronDown />}
                </span>
              </button>

              {/* CHILDREN (animated open/close wrapper) */}
              <div
                className={`
      transition-all duration-250 ease-out
      ${
        categoryDropdownOpened
          ? "max-h-[600px] opacity-100"
          : "max-h-0 opacity-0"
      }
      overflow-hidden
    `}
              >
                {categoryDropdownOpened && (
                  <div className="relative ml-4 pl-4">
                    {/* vertical guide line */}
                    <div
                      className="
            absolute left-0 top-[6px] bottom-[6px] w-4
            border-l-2 border-b-2 border-gray-700 rounded-bl-xl
            pointer-events-none
            transition-opacity duration-200
          "
                    />

                    <div className="space-y-3">
                      {SIDEBAR_CATEGORIES.map((cat, index) => (
                        <button
                          onClick={() => {
                            if (cat !== category) {
                              changeCategory(cat);
                            } else {
                              changeCategory("All Tapes");
                            }
                          }}
                          key={index}
                          className="
                relative w-full text-left text-sm pl-1
                transition-transform duration-200 ease-out
                hover:translate-x-[3px]
                active:translate-x-[1px]
              "
                        >
                          {/* horizontal connector */}
                          {index !== SIDEBAR_CATEGORIES.length - 1 && (
                            <span className="absolute -left-4 top-[40%] w-4 h-[1.5px] bg-gray-700 transition-opacity duration-200 group-hover:opacity-90" />
                          )}

                          <div className="flex items-center gap-2">
                            <span
                              className={`
                    transition-colors duration-200 ease-out
                    ${
                      category === cat
                        ? "text-yellow-400"
                        : "text-gray-400 hover:text-gray-200"
                    }
                  `}
                            >
                              {cat}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
            {/* PRICE FILTER */}
            <div className="mb-10">
              <p
                className="
  text-[10px]
  uppercase
  tracking-[0.25em]
  text-white/40
  mb-3
"
              >
                {" "}
                Max Price
              </p>

              <input
                type="range"
                min={0}
                max={1500}
                step={5}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                onMouseUp={() => {
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.set("maxPrice", priceRange);
                    next.set("page", "1");
                    return next;
                  });
                }}
                className="w-full accent-yellow-500"
              />
              <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                <span>$0</span>

                <div className="flex items-center gap-1">
                  <span className="text-lg">$</span>

                  <input
                    type="text"
                    min={0}
                    max={1500}
                    step={5}
                    value={priceRange}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (Number.isNaN(value)) return;

                      const clamped = Math.min(Math.max(value, 0), 1500);
                      setPriceRange(clamped);

                      if (priceDebounceRef.current) {
                        clearTimeout(priceDebounceRef.current);
                      }

                      priceDebounceRef.current = setTimeout(() => {
                        setSearchParams((prev) => {
                          const next = new URLSearchParams(prev);
                          next.set("maxPrice", clamped);
                          next.set("page", "1");
                          return next;
                        });
                      }, 300);
                    }}
                    className="
        w-14 text-right
        bg-transparent
        text-yellow-400 font-medium
        border-b border-white/20
        focus:outline-none focus:border-yellow-400
        transition text-lg mr-2
      "
                  />

                  {/* Custom steppers */}
                  <div className="flex flex-col -ml-1">
                    <button
                      type="button"
                      onClick={() => setPriceRange((p) => Math.min(p + 5, 300))}
                      className="text-white/40 hover:text-yellow-400 transition"
                    >
                      <ChevronUp size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setPriceRange((p) => Math.max(p - 5, 0))}
                      className="text-white/40 hover:text-yellow-400 transition"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* COLOR FILTER */}
            <div className="mb-10">
              <p
                className="
  text-[10px]
  uppercase
  tracking-[0.25em]
  text-white/40
  mb-3
"
              >
                {" "}
                Color
              </p>
              <div className="flex flex-wrap gap-2">
                {["Yellow", "Black", "Silver", "White"].map((color, i) => (
                  <button
                    key={i}
                    className="
  px-3 py-1.5
  rounded-full
  text-xs
  bg-black/40
  border border-white/10
  hover:border-yellow-400/40
  hover:text-yellow-400
  transition-all
"
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            {/* WIDTH FILTER */}
            <div className="mb-10">
              <p
                className="
  text-[10px]
  uppercase
  tracking-[0.25em]
  text-white/40
  mb-3
"
              >
                {" "}
                Width
              </p>
              <div className="flex flex-wrap gap-2">
                {["24mm", "36mm", "48mm", "72mm"].map((width, i) => (
                  <button
                    key={i}
                    className="px-3 py-1 rounded-full text-xs border border-white/10 text-gray-300 hover:border-blue-400 hover:text-blue-400 transition"
                  >
                    {width}
                  </button>
                ))}
              </div>
            </div>
            {/* LENGTH FILTER */}
            <div className="mb-10">
              <p
                className="
  text-[10px]
  uppercase
  tracking-[0.25em]
  text-white/40
  mb-3
"
              >
                {" "}
                Length
              </p>
              <div className="flex flex-wrap gap-2">
                {["5m", "10m", "25m", "50m", "100m"].map((length, i) => (
                  <button
                    key={i}
                    className="px-3 py-1 rounded-full text-xs border border-white/10 text-gray-300 hover:border-blue-400 hover:text-blue-400 transition"
                  >
                    {length}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {products.length === 0 && (
          <h1 className="w-[50vw] text-xl">No results found.</h1>
        )}

        {/* PRODUCT GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 flex-1 items-start">
          {products.map((product, i) => {
            const key = product.id ?? i;

            const isSuccess = !!successStates[String(product.id ?? "")];
            const isWishlisted = wishlistIdSet.has(Number(product.id));

            return (
              <ProductCard
                key={key}
                product={product}
                isSuccess={isSuccess}
                isWishlisted={isWishlisted}
                onNavigate={onNavigate}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={handleAddToCart}
              />
            );
          })}
        </div>
      </div>

      <Pagination
        page={page}
        total={tapeNumber}
        limit={ITEMS_PER_PAGE}
        onPageChange={goToPage}
      />
    </section>
  );
};

export default ProductsList;
