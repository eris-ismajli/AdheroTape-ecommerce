import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ArrowRight, Heart, ShoppingCart, UserRound, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { removeProduct, clearCart } from "../store/cart/actions";
import Modal from "../components/Modal";
import { selectWishlistCount } from "../store/wishlist/selectors";
import { toggleWishlist } from "../store/wishlist/actions";
import Header from "../components/Header";

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const items = useSelector((state) => state.wishlist.items || []);
  const totalItems = useSelector(selectWishlistCount);

  const navLinks = [{ name: "About", endpoint: "/" }];
  const navButtons = [
    { name: "Cart", icon: ShoppingCart, endpoint: "/cart" },
    { name: "Profile", icon: UserRound, endpoint: "/login" },
  ];

  return (
    <div className="relative bg-gradient-to-b from-zinc-950 via-[#050816] to-gray-950 text-white overflow-auto">
      <Header navLinks={navLinks} navButtons={navButtons} showShop={true} />{" "}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 -right-40 w-[650px] h-[650px] bg-blue-400/5 rounded-full blur-[150px]" />
      </div>
      <div className="max-w-[95vw] mx-auto px-6 flex flex-col min-h-screen z-10">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-4 my-10 mt-36">
          <div className="flex items-center gap-3">
            <Heart className="text-yellow-500" size={40} />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Your <span className="text-yellow-400">Wishlist</span>
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {totalItems === 0
                  ? "You don’t have any tapes in your wishlist yet."
                  : `You have ${totalItems} item${
                      totalItems > 1 ? "s" : ""
                    } wishlisted!`}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/shop")}
            className="inline-flex items-center gap-2 text-lg text-zinc-300 hover:text-white transition group"
          >
            <span>Continue Shopping</span>
            <ArrowRight
              size={18}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
          </button>
        </div>
        {/* EMPTY STATE */}
        {items.length === 0 && (
          <div className="my-auto mx-auto text-center">
            <p className="text-lg text-gray-200 mb-2">
              Your wishlist is empty.
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Save tapes you like so you can easily find them later.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300 hover:scale-[1.03] transition-all duration-200 shadow-[0_0_20px_rgba(250,204,21,0.55)]"
            >
              Browse Tapes
            </button>
          </div>
        )}

        {/* CART CONTENT */}
        {items.length > 0 && (
          <div className="flex">
            {/* LEFT: ITEMS LIST */}

            {items.length > 0 && (
              <div
                className="
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-4
      gap-8
      mb-20
    "
              >
                {items.map((item) => {
                  const mainImage = item.images?.[0] ?? "/placeholder-tape.png";

                  return (
                    <div
                      key={item.id}
                      className="
            group
            rounded-2xl
            border border-white/10
            bg-black/40
            shadow-[0_10px_30px_rgba(0,0,0,0.5)]
            transition-transform duration-300
            hover:-translate-y-2
          "
                    >
                      {/* IMAGE */}
                      <div
                        onClick={() => navigate(`/shop/${item.id}`)}
                        className="
              relative
              h-56
              bg-black/60
              rounded-t-2xl
              border-b border-white/10
              flex items-center justify-center
              overflow-hidden
              cursor-pointer
            "
                      >
                        <img
                          src={mainImage}
                          alt={item.title}
                          className="object-contain transition-transform duration-700 group-hover:scale-105"
                        />
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(toggleWishlist(item));
                          }}
                          className="absolute flex justify-end top-0 right-0 p-3 cursor-pointer w-12 h-12 drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)] text-red-600
                  hover:text-red-400
                  transition-colors"
                        >
                          <X />
                        </div>
                      </div>

                      <div className="p-5 flex flex-col gap-3">
                        {item.category && (
                          <p className="text-xs uppercase tracking-wide text-sky-400/80">
                            {item.category}
                          </p>
                        )}

                        <h2
                          onClick={() => navigate(`/shop/${item.id}`)}
                          className="
                text-lg
                font-normal
                cursor-pointer
                text-white
                hover:text-yellow-400
                transition-colors
                line-clamp-2
              "
                        >
                          {item.title}
                        </h2>

                        {item.price_raw && (
                          <p className="text-yellow-300 font-medium text-lg">
                            {item.price_raw}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
