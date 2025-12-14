import React from "react";
import { X } from "lucide-react";

const Modal = ({ message, onConfirm, onCancel }) => {
  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40
        animate-fadeIn
      "
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative p-7 w-[90%] max-w-md rounded-2xl
         shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_0_12px_rgba(255,255,255,0.08)]
  bg-gray-950
          text-white
          animate-scaleIn
          border-t border-gray-800
        "
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl z-0">
          <div className="absolute w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>
        <p className="text-lg mb-6 text-center">{message}</p>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onCancel}
            style={{ borderTop: "1px solid rgba(255, 255, 255, 0.18)" }}
            className="
              px-4 py-2 rounded-lg
             shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_0_12px_rgba(255,255,255,0.04)]
  bg-zinc-900
              hover:bg-white/20 transition
              text-white/70 font-normal
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="
    px-4 py-2 rounded-lg
    bg-yellow-500 text-black font-normal

    transition-all duration-200 ease-out
    hover:bg-yellow-400
    hover:shadow-[0_0_18px_rgba(234,179,8,0.55)]
  "
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
