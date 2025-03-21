"use client";

import { useOverlay } from "@/context/OverlayContext";
import { createPortal } from "react-dom";

export const Overlay = () => {
  const { isOpen, content, closeOverlay, fullScreen } = useOverlay();

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed pb-10 inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={closeOverlay}
    >
      <div
        className={`bg-white p-8 max-h-[65vh] rounded-lg shadow-lg relative overflow-y-auto ${
          fullScreen ? "h-[90vh]" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    </div>,
    document.body
  );
};
