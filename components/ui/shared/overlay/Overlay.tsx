"use client";

import { useOverlay } from "@/context/OverlayContext";
import { createPortal } from "react-dom";

export const Overlay = ({ fullScreen }: { fullScreen: boolean }) => {
  const { isOpen, content } = useOverlay();

  if (!isOpen) return null;

  return createPortal(
    <div className="absolute w-screen h-screen top-0 left-0 flex items-center justify-center bg-black/50 z-50">
      <div
        className={`bg-white p-8 max-h-[65vh] rounded-lg shadow-lg ${fullScreen ? "h-[90vh]" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    </div>,
    document.body
  );
};
