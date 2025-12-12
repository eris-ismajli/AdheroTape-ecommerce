import React from "react";
import { X } from "lucide-react";

const Modal = ({ message, onConfirm, onCancel }) => {
  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50 backdrop-blur-sm
        animate-fadeIn
      "
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ borderTop: "1px solid rgba(255, 255, 255, 0.18)" }}
        className="
          relative p-7 w-[90%] max-w-md rounded-2xl
         shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_0_12px_rgba(255,255,255,0.08)]
  bg-zinc-900
          text-white
          animate-scaleIn
        "
      >
        <p className="text-lg mb-6 text-center">
          {message}
        </p>

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
    bg-blue-500 text-black font-normal
    hover:bg-blue-400
    transition-colors duration-200
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
