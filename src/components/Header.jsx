import React from "react";

import { useSelector } from "react-redux";
import { selectCartCount } from "../store/cart/selectors";
import { ShoppingCart } from "lucide-react";

import logoNoText from "../assets/logo-notext.png";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const Header = ({
  navLinks,
  navButtons,
  showShop = false,
  showSearch = false,
  isAsideSticky,
}) => {
  const navigate = useNavigate();

  const cartCount = useSelector(selectCartCount);

  return (
    <header
      className={`
    fixed top-2 ${
      isAsideSticky ? "left-[60.7%]" : "left-[50%]"
    } -translate-x-1/2
    z-40 bg-black/55 backdrop-blur-md rounded-full
    transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
    w-[75%] shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_0_12px_rgba(255,255,255,0.06)]
  `}
      style={{ borderTop: "1px solid rgba(255, 255, 255, 0.18)" }}
    >
      <nav
        className="md:flex gap-8 mx-4 my-3"
        style={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <div className="flex items-center gap-2">
          <img src={logoNoText} className="w-10" alt="AdheroTape logo" />
          <h1 className="text-2xl font-bold">
            <span className="text-yellow-400">Adhero</span>
            <span className="text-gray-300">Tape</span>
          </h1>
        </div>

        <div className="flex items-center gap-10">
          {navLinks && navLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => {
                if (link.endpoint.startsWith("#")) {
                  // SCROLL behavior only for in-page anchors
                  const el = document.querySelector(link.endpoint);
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                } else {
                  // NORMAL NAVIGATION when endpoint is a route
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
          {/* SEARCH BAR */}
          {showSearch && (
            <div
              style={{ borderTop: "1px solid rgba(255, 255, 255, 0.18)" }}
              className="
    relative
    flex items-center
    bg-black/30
   
    rounded-full
    px-4 py-2
    shadow-[inset_0_0_8px_rgba(255,255,255,0.08)]
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
                  <button
                    onClick={() => navigate(button.endpoint)}
                    style={{ borderTop: "1px solid rgba(255, 255, 255, 0.18)" }}
                    className="
                flex items-center gap-2 p-2.5
                bg-black/30 rounded-full scale-105
                transition-shadow duration-300 ease-out
                
                shadow-[0_0_0_rgba(80,140,255,0),inset_0_0_8px_rgba(255,255,255,0.08)]
                hover:shadow-[0_0_18px_rgba(80,140,255,0.45),inset_0_0_8px_rgba(255,255,255,0.08)]
                "
                  >
                    <Icon size={18} color="white" />
                  </button>
                  {button.name === "Cart" && cartCount > 0 && (
                    <span
                      className="
        absolute -top-1 -right-1
        bg-yellow-400 text-black
        text-xs font-bold
        rounded-full
        h-5 min-w-5 px-1
        flex items-center justify-center
        shadow-[0_0_10px_rgba(255,215,0,0.6)] pointer-events-none
      "
                    >
                      {cartCount}
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
