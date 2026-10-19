// base modal, closes on Esc or when you click outside
import { useEffect } from "react";
import { CloseIcon } from "./Icons.jsx";

function Modal({ open, title, subtitle, onClose, children, maxWidth = "max-w-2xl" }) {
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className={`max-h-[95vh] w-full ${maxWidth} overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            <CloseIcon />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default Modal;
