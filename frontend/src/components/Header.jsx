import React, { useEffect, useRef, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { selectCartCount } from "../store/cart/selectors";
import { ShoppingCart, UserRound } from "lucide-react";

import logoNoText from "../assets/logo-notext.png";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { selectWishlistCount } from "../store/wishlist/selectors";

import { logoutUser } from "../store/auth/actions";
import EventBus from "../utils/eventBus";

const Header = ({
  navLinks,
  navButtons,
  showShop = false,
  showSearch = false,
  isAsideSticky,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);

  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const user = useSelector((state) => state.auth?.user);

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- SCROLL HIDE / SHOW ---------------- */
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const showHeader = () => setHidden(false);

    EventBus.on("showHeader", showHeader);

    return () => {
      EventBus.off("showHeader", showHeader);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;

      // ignore micro scroll
      if (Math.abs(currentY - lastScrollY.current) < 8) return;

      if (currentY > lastScrollY.current && currentY > 80) {
        setHidden(true); // scrolling down
      } else {
        setHidden(false); // scrolling up
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  /* ---------------------------------------------------- */

  return (
    <header
      className={`
    fixed top-2 ${
      isAsideSticky ? "left-[60.7%]" : "left-[50%]"
    } -translate-x-1/2
    z-40 border border-gray-700/25 bg-gray-950/80 backdrop-blur-md rounded-full
    transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
    w-[75%]
    shadow-[0_4px_20px_rgba(0,0,0,0.45)]
    ${hidden ? "-translate-y-24 opacity-0" : "translate-y-0 opacity-100"}
  `}
    >
      <nav
        className="md:flex gap-8 mx-4 my-3"
        style={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <div
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img src={logoNoText} className="w-10" alt="AdheroTape logo" />
          <h1 className="text-2xl font-bold">
            <span className="text-yellow-400">Adhero</span>
            <span className="text-gray-300">Tape</span>
          </h1>
        </div>

        <div className="flex items-center gap-10">
          {navLinks &&
            navLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => {
                  if (link.endpoint.startsWith("#")) {
                    const el = document.querySelector(link.endpoint);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  } else {
                    navigate(link.endpoint);
                  }
                }}
                className="
  relative text-white/70 transition-all duration-300 
  hover:text-yellow-300 
  hover:-translate-y-0.5
  after:content-[''] after:absolute after:left-1/2 after:-bottom-1
  after:h-[2px] after:w-0 after:bg-yellow-400 after:rounded-full
  after:transition-all after:duration-300 after:-translate-x-1/2
  hover:after:w-full
  hover:after:shadow-[0_0_10px_rgba(255,215,0,0.6)]
"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {link.name}
              </button>
            ))}
        </div>

        <div className="flex items-center gap-7">
          {showSearch && (
            <div
              className="
    relative flex items-center bg-black/30
    border border-gray-700/25 rounded-full px-4 py-2
    transition-all duration-300
    focus-within:border-blue-300
    focus-within:shadow-[0_0_8px_rgba(140,180,255,0.35)]
  "
            >
              <Search color="gray" size={20} />
              <input
                type="text"
                placeholder="Search..."
                className="
      bg-transparent outline-none border-none text-sm text-white ml-2
      placeholder-gray-400
      w-[140px] focus:w-[180px]
      transition-all duration-300
    "
              />
            </div>
          )}

          {navButtons &&
            navButtons.map((button, index) => {
              const Icon = button.icon;
              return (
                <div className="relative" key={index}>
                  {button.name === "Profile" && isAuthenticated ? (
                    <div ref={profileRef} className="relative">
                      <button
                        onClick={() => setProfileOpen((p) => !p)}
                        className="
        flex items-center gap-2 p-2.5
        bg-black/30 rounded-full scale-105
        transition-shadow duration-300 ease-out
        border border-gray-700/25
        hover:shadow-[0_0_18px_rgba(80,140,255,0.45)]
      "
                      >
                        <Icon size={18} color="white" />
                      </button>

                      {/* DROPDOWN */}
                      {profileOpen && (
                        <div
                          className="
      absolute left-1/2 -translate-x-1/2 mt-3 w-44
      rounded-xl bg-gray-950 backdrop-blur-md
      border border-gray-700/30
      shadow-[0_10px_30px_rgba(0,0,0,0.6)]
      overflow-hidden
      z-50
    "
                        >
                          <div className="px-4 py-3 flex items-center gap-2">
                            <UserRound color="gray" size={16}/>
                            <p className=" text-white/50 line-clamp-1 text-sm">{user.name}</p>
                          </div>

                          <div className="h-px bg-white/10" />

                          <button
                            onClick={() => {
                              navigate("/profile");
                              setProfileOpen(false);
                            }}
                            className="
            w-full text-left px-4 py-3 text-sm text-white/80
            hover:bg-white/5 hover:text-yellow-300
            transition
          "
                          >
                            View profile
                          </button>

                          <div className="h-px bg-white/10" />

                          <button
                            onClick={() => {
                              dispatch(logoutUser());
                              setProfileOpen(false);
                              navigate("/shop");
                            }}
                            className="
            w-full text-left px-4 py-3 text-sm
            text-red-400 hover:bg-red-500/10
            transition
          "
                          >
                            Log out
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    // fallback: normal behavior for other buttons
                    <button
                      onClick={() => navigate(button.endpoint)}
                      className="
      flex items-center gap-2 p-2.5
      bg-black/30 rounded-full scale-105
      transition-shadow duration-300 ease-out
      border border-gray-700/25
      hover:shadow-[0_0_18px_rgba(80,140,255,0.45)]
    "
                    >
                      <Icon size={18} color="white" />
                    </button>
                  )}

                  {button.name === "Cart" && cartCount > 0 && (
                    <span
                      className="
        absolute -top-1 -right-1
        bg-red-600 text-white text-xs font-bold
        rounded-full h-5 min-w-5 px-1
        flex items-center justify-center
        shadow-[0_0_10px_rgba(255,0,0,0.6)]
        pointer-events-none
      "
                    >
                      {cartCount}
                    </span>
                  )}

                  {button.name === "Wishlist" && wishlistCount > 0 && (
                    <span
                      className="
        absolute -top-1 -right-1
        bg-red-600 text-white text-xs font-bold
        rounded-full h-5 min-w-5 px-1
        flex items-center justify-center
        shadow-[0_0_10px_rgba(255,0,0,0.6)]
        pointer-events-none
      "
                    >
                      {wishlistCount}
                    </span>
                  )}
                </div>
              );
            })}

          {showShop && (
            <button
              onClick={() => navigate("/shop")}
              className="
    border-2 border-yellow-500 text-white px-6 py-2 rounded-full font-bold
    bg-black/20
    transition-[transform,box-shadow,border-color] duration-300 ease-out
    hover:border-yellow-400 hover:scale-105 hover:shadow-yellow-500/50
    shadow-md
  "
            >
              Shop
            </button>
          )}

          <button
            onClick={() => {
              const el = document.getElementById("contact");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
                history.replaceState(null, "", " ");
              }
            }}
            className="
    bg-yellow-500 text-black px-6 py-2 rounded-full font-bold
    transition-[transform,background-color,box-shadow] duration-300 ease-out
    hover:bg-yellow-400 hover:scale-105 hover:shadow-yellow-500/50
    shadow-md
  "
          >
            Contact
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
