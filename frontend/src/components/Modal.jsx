import React from "react";
import { X } from "lucide-react";

const Modal = ({ message, onConfirm, onCancel, title }) => {
  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40 backdrop-blur-sm
        animate-fadeIn
      "
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative p-6 w-[90%] max-w-md rounded-2xl
         shadow-[0_4px_20px_rgba(0,0,0,0.45)]
          text-white
          animate-scaleIn
          bg-zinc-950 border border-white/5
        "
      >
        <h1 className="text-center text-[20px] text-yellow-400 mb-4">{title}</h1>

        <p className="text-white/60 text-lg mb-6 text-center">{message}</p>

        <div className="flex justify-center gap-8 mt-4">
          <button
            onClick={onCancel}
            className="
    
    text-white/60 text-lg
    hover:text-white
    hover:scale-105
    hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]
    transition-all duration-200 ease-out
  "
          >
            Cancel
          </button>

          <div className="h-[40px] w-px bg-white/10" />

          <button
            onClick={onConfirm}
            className="
    text-blue-400 text-lg
    hover:text-blue-200
    hover:scale-105
    hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]
    transition-all duration-200 ease-out
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
