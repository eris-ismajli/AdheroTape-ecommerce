import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  removeOneFromCart,
  removeProduct,
  clearCart,
  addToCart,
} from "../store/cart/actions";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const items = useSelector((state) => state.cart.items || []);

  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const subtotal = items.reduce((sum, item) => {
    if (!item.price_raw) return sum;
    const numeric = parseFloat(String(item.price_raw).replace(/[^0-9.]/g, ""));
    if (isNaN(numeric)) return sum;
    return sum + numeric * (item.quantity || 1);
  }, 0);

  return (
    <div className="relative bg-gradient-to-b from-black to-zinc-900 text-white overflow-auto">
      {/* BACKGROUND BLOBS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 -right-20 w-[900px] h-[1000px] bg-purple-400/5 rounded-full blur-[100px] animate-pulse delay-300" />
        <div className="absolute bottom-1/3 -left-20 w-[900px] h-[1000px] bg-cyan-400/5 rounded-full blur-[100px] animate-pulse delay-500" />
      </div>

      <div className="max-w-[90vw] mx-auto px-6 flex flex-col h-screen justify-center z-10">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400/10 border border-yellow-400/40 shadow-[0_0_10px_rgba(250,204,21,0.2)]">
              <ShoppingCart className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Your <span className="text-yellow-400">Cart</span>
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {totalItems === 0
                  ? "You don’t have any tapes in your cart yet."
                  : `You have ${totalItems} item${
                      totalItems > 1 ? "s" : ""
                    } ready to roll.`}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/shop")}
            className="hidden sm:inline-flex border border-yellow-400 text-yellow-300 px-4 py-2 rounded-full text-sm font-medium bg-black/30
            hover:bg-yellow-400 hover:text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.5)]"
          >
            Continue Shopping
          </button>
        </div>

        {/* EMPTY STATE */}
        {items.length === 0 && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-yellow-500/5  px-8 py-12 text-center shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
            <p className="text-lg text-gray-200 mb-2">
              Your cart is feeling a bit light.
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Add some tapes from the shop to see them here.
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
          <div className="grid lg:grid-cols-[2fr,1fr] gap-8">
            {/* LEFT: ITEMS LIST */}
            <div
              style={{ borderTop: "1px solid rgba(255, 255, 255, 0.18)" }}
              className="space-y-4 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_0_12px_rgba(255,255,255,0.04)]
  bg-gradient-to-b from-black/0 to-black/70 p-6 overflow-y-auto h-[70vh]"
            >
              {items.map((item) => {
                const mainImage = item.images?.[0] ?? "/placeholder-tape.png";

                return (
                  <div
                    key={item.id}
                    className="pb-6 border-b border-white/10 last:border-b-0 last:pb-0"
                  >
                    <div className="flex gap-4 md:gap-5">
                      {/* IMAGE */}
                      <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center overflow-hidden">
                        <img
                          src={mainImage}
                          alt={item.title}
                          className="object-contain w-full h-full"
                        />
                      </div>

                      {/* TEXT CONTENT */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          {item.category && (
                            <p className="text-[11px] uppercase tracking-wide text-sky-400/80 mb-1">
                              {item.category}
                            </p>
                          )}
                          <h2 className="text-sm md:text-base font-semibold text-white line-clamp-2">
                            {item.title}
                          </h2>
                        </div>

                        {/* QTY + PRICE */}
                        <div className="mt-2 flex items-end justify-between gap-4">
                          <div className="text-xs text-gray-400">
                            <div className="flex gap-1 items-center mb-2 bg-black/50 rounded-md">
                              <button
                                onClick={() =>
                                  dispatch(removeOneFromCart(item.id))
                                }
                                className="p-1 rounded-full text-xs font-semibold"
                              >
                                <ChevronDown color="white" size={20} />
                              </button>

                              <p>
                                <span className="text-gray-200 text-xl">
                                  {item.quantity}
                                </span>
                              </p>
                              <button
                                onClick={() => dispatch(addToCart(item))}
                                className="p-1 rounded-full text-xs font-semibol"
                              >
                                <ChevronUp color="white" size={20} />
                              </button>
                            </div>

                            {item.price_raw && (
                              <p className="mt-0.5">
                                Price:{" "}
                                <span className="text-yellow-300 font-medium">
                                  {item.price_raw}
                                </span>
                              </p>
                            )}
                          </div>

                          {item.price_raw && (
                            <div className="text-right">
                              <p className="text-xs text-gray-400">Subtotal</p>
                              <p className="text-sm md:text-base font-semibold text-yellow-300">
                                {(() => {
                                  const numeric = parseFloat(
                                    item.price_raw.replace(/[^0-9.]/g, "")
                                  );
                                  return `$${(numeric * item.quantity).toFixed(
                                    2
                                  )}`;
                                })()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTONS — FIXED & WORKING */}
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={() => dispatch(removeProduct(item.id))}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-400/30 hover:bg-red-500/30 hover:text-red-300 transition-all duration-200"
                      >
                        Remove Item
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT: SUMMARY CARD */}
            <div
              style={{ borderTop: "1px solid rgba(255, 255, 255, 0.18)" }}
              className="rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_0_12px_rgba(255,255,255,0.04)]
  bg-gradient-to-b from-black/0 to-black/70 p-6 space-y-5 "
            >
              <h3 className="text-lg font-semibold flex items-center gap-2">
                Order Summary
              </h3>

              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-yellow-300 font-medium">
                    {subtotal > 0 ? `$${subtotal.toFixed(2)}` : "-"}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-gray-500 pt-1">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent my-2" />

              <button
                disabled
                className="w-full py-3 rounded-full font-semibold text-sm bg-yellow-400 text-black opacity-80 cursor-not-allowed shadow-[0_0_22px_rgba(250,204,21,0.6)] transition-all duration-200"
              >
                Checkout (coming soon)
              </button>

              <button
                onClick={() => dispatch(clearCart())}
                className="w-full py-2 rounded-full text-xs md:text-sm text-red-300 bg-red-500/10 border border-red-500/30 hover:border-red-400 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200"
              >
                Clear Entire Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
