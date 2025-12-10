import React from "react";

import logoNoText from "../assets/logo-notext.png";
import { useNavigate } from "react-router-dom";

const Header = ({ navLinks, navButtons, showShop = false }) => {
  const navigate = useNavigate();

  const navigateTo = (endpoint) => {
    navigate(endpoint);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  
  return (
    <header
      className="fixed top-0 w-full z-40 transition-colors duration-300 bg-black/55 backdrop-blur-md"
      style={{ borderBottom: "1px solid rgba(128, 128, 128, 0.142)" }}
    >
      <nav
        className="md:flex gap-8 mx-16 my-3"
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
          {navLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => {
                if (link.endpoint.startsWith("#")) {
                  // SCROLL behavior only for in-page anchors
                  const el = document.querySelector(link.endpoint);
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                } else {
                  // NORMAL NAVIGATION when endpoint is a route
                  navigateTo(link.endpoint);
                }
              }}
              className="relative text-white hover:text-yellow-400 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full hover:-translate-y-0.5 inline-block"
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
          {navButtons &&
            navButtons.map((button, index) => {
              const Icon = button.icon;
              return (
                <button
                  key={index}
                  className="
    flex items-center gap-2 p-2.5
    transition-all duration-300 ease-in-out
    bg-black/30
    scale-105 shadow-lg
    border border-white/30 rounded-full
    hover:border-yellow-100 hover:shadow-[0_0_6px_rgba(255,255,0,0.6)]
  "
                >
                  <Icon size={18} color="white" />
                </button>
              );
            })}

          {showShop && (
            <button
              onClick={() => navigateTo("/shop")}
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
