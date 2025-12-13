import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Trash,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  removeOneFromCart,
  removeProduct,
  clearCart,
  addToCart,
} from "../store/cart/actions";
import Modal from "../components/Modal";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [idToDelete, setIdToDelete] = useState(null);

  const clearAllItems = () => {
    setShowModal(false);
    dispatch(clearCart());
  };

  const removeItem = () => {
    setShowModal(false);
    dispatch(removeProduct(idToDelete));
    setIdToDelete(null);
  };

  const items = useSelector((state) => state.cart.items || []);

  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const subtotal = items.reduce((sum, item) => {
    if (!item.price_raw) return sum;
    const numeric = parseFloat(String(item.price_raw).replace(/[^0-9.]/g, ""));
    if (isNaN(numeric)) return sum;
    return sum + numeric * (item.quantity || 1);
  }, 0);

  const clearCartMsg =
    "Are you sure you want to remove all items from your cart?";

  const removeItemMsg =
    "Are you sure you want to remove this item from your cart?";

  const modalConfirmFunc =
    modalMsg === clearCartMsg ? clearAllItems : removeItem;

  const incrementQuantity = (product) => {
    const chosenColor = product.chosenColor;
    const chosenWidth = product.chosenWidth;
    const chosenLength = product.chosenLength;

    dispatch(addToCart(product, 1, chosenColor, chosenWidth, chosenLength));
  };

  return (
    <div className="relative bg-gradient-to-b from-zinc-950 via-[#050816] to-gray-950 text-white overflow-auto">
      {showModal && (
        <Modal
          message={modalMsg}
          onConfirm={modalConfirmFunc}
          onCancel={() => setShowModal(false)}
        />
      )}

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 -right-40 w-[650px] h-[650px] bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[95vw] mx-auto px-6 flex flex-col h-screen justify-center z-10">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <ShoppingCart className="text-yellow-500" size={40} />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Your <span className="text-yellow-400">Cart</span>
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {totalItems === 0
                  ? "You don’t have any tapes in your cart yet."
                  : `You have ${totalItems} item${
                      totalItems > 1 ? "s" : ""
                    } ready to roll!`}
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
              className="space-y-4 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.35),inset_0_0_12px_rgba(255,255,255,0.04)]
  bg-gray-800/5 p-6 overflow-y-auto h-[70vh] scroll-smooth will-change-scroll scrollbar-hide"
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

                      <div
                        onClick={() =>
                          navigate(
                            `/shop/${item.oldId ? item.oldId : item.id}`,
                            { replace: true }
                          )
                        }
                        className="
    cursor-pointer h-[13rem] w-[13rem] rounded-2xl bg-black/60 
    border border-white/10 flex items-center justify-center 
    overflow-hidden group
  "
                      >
                        <img
                          src={mainImage}
                          alt={item.title}
                          className="
      object-contain w-full h-full 
      transition-transform duration-500 ease-out 
      group-hover:scale-110
    "
                        />
                      </div>

                      {/* TEXT CONTENT */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex gap-6">
                          <div>
                            {item.category && (
                              <p className="text-[12px] uppercase tracking-wide text-sky-400/80 mb-1">
                                {item.category}
                              </p>
                            )}
                            <h2
                              onClick={() =>
                                navigate(
                                  `/shop/${item.oldId ? item.oldId : item.id}`,
                                  { replace: true }
                                )
                              }
                              className="
    text-xl cursor-pointer font-normal 
    text-white transition-colors duration-300
    hover:text-yellow-400
  "
                            >
                              {item.title}
                            </h2>
                          </div>
                          {/* CHOSEN SPECS */}
                          <div className="rounded-2xl w-[70%] p-4  bg-gray-900/30 border border-white/5">
                            <p className="text-[13px] uppercase tracking-[0.2em] text-blue-300 mb-3">
                              Chosen Specs
                            </p>
                            <dl className="space-y-2 text-sm">
                              <div className="flex justify-between gap-4">
                                <dt className="text-zinc-500">Color</dt>
                                <dd className="text-zinc-200">
                                  {item.chosenColor ? item.chosenColor : "N/A"}
                                </dd>
                              </div>

                              <div className="flex justify-between gap-4">
                                <dt className="text-zinc-500">Width</dt>
                                <dd className="text-zinc-200">
                                  {item.chosenWidth ? item.chosenWidth : "N/A"}
                                </dd>
                              </div>
                              <div className="flex justify-between gap-4">
                                <dt className="text-zinc-500 whitespace-nowrap">
                                  Length
                                </dt>
                                <dd className="text-zinc-200">
                                  {item.chosenLength
                                    ? item.chosenLength
                                    : "N/A"}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </div>

                        {/* QTY + PRICE */}
                        <div className="mt-2 flex items-end justify-between gap-4">
                          <div className=" text-gray-400">
                            <div className="flex gap-1 items-center justify-between mb-2 bg-gray-900/75 rounded-md">
                              <button
                                onClick={() =>
                                  dispatch(removeOneFromCart(item.id))
                                }
                                className="p-1 rounded-full text-xs font-semibold"
                              >
                                <ChevronDown color="white" size={24} />
                              </button>

                              <p>
                                <span className="text-gray-200 text-xl">
                                  {item.quantity}
                                </span>
                              </p>
                              <button
                                onClick={() => incrementQuantity(item)}
                                className="p-1 rounded-full text-xs font-semibol"
                              >
                                <ChevronUp color="white" size={24} />
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
                            <div className="text-right flex items-end">
                              <p className="text-gray-400 mr-2">Total</p>
                              <p className="font-semibold text-yellow-300 mr-5">
                                {(() => {
                                  const numeric = parseFloat(
                                    item.price_raw.replace(/[^0-9.]/g, "")
                                  );
                                  return `$${(numeric * item.quantity).toFixed(
                                    2
                                  )}`;
                                })()}
                              </p>
                              <button
                                onClick={() => {
                                  setModalMsg(removeItemMsg);
                                  setShowModal(true);
                                  setIdToDelete(item.id);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg font-medium
             bg-red-500/15 text-red-500 border border-red-500/25
             hover:bg-red-500/25 hover:text-red-400 hover:border-red-500/40
             transition-all duration-200"
                              >
                                <Trash2 size={18} />
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTONS — FIXED & WORKING */}
                    {/* <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={() => dispatch(removeProduct(item.id))}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-400/30 hover:bg-red-500/30 hover:text-red-300 transition-all duration-200"
                      >
                        Remove Item
                      </button>
                    </div> */}
                  </div>
                );
              })}
            </div>

            {/* RIGHT: SUMMARY CARD */}
            <div
              style={{ borderTop: "1px solid rgba(255, 255, 255, 0.18)" }}
              className="rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_0_12px_rgba(255,255,255,0.04)]
  bg-gray-800/5 p-6 space-y-5 "
            >
              <h3 className="text-xl font-semibold flex items-center gap-2">
                Order Summary
              </h3>

              <div className="space-y-2 text-gray-300">
                <div className="text-lg flex justify-between">
                  <span>Items</span>
                  <span className="font-semibold">{totalItems}</span>
                </div>

                <div className="text-lg flex justify-between">
                  <span>Total</span>
                  <span className="text-yellow-300 font-medium">
                    {subtotal > 0 ? `$${subtotal.toFixed(2)}` : "-"}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-500 pt-1">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent my-2" />

              <button
                disabled
                className="w-full py-3 rounded-full font-semibold text-sm bg-green-500 text-black opacity-80 cursor-not-allowed shadow-[0_0_22px_rgba(34,197,94,0.6)] transition-all duration-200"
              >
                Checkout (coming soon)
              </button>

              <button
                onClick={() => {
                  setShowModal(true);
                  setModalMsg(clearCartMsg);
                }}
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
