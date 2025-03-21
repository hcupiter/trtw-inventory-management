"use client";

import { Overlay } from "@/components/ui/shared/overlay/Overlay";
import { createContext, useContext, useState, ReactNode } from "react";

type OverlayContextType = {
  isOpen: boolean;
  content: ReactNode;
  fullScreen: boolean;
  makeFullScreen: (status: boolean) => void;
  openOverlay: (content: ReactNode) => void;
  closeOverlay: () => void;
};

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export const OverlayProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [fullScreen, setFullScreen] = useState(false);

  const openOverlay = (overlayContent: ReactNode) => {
    setContent(overlayContent);
    setIsOpen(true);
  };

  const closeOverlay = () => {
    setIsOpen(false);
    setContent(null);
  };

  const makeFullScreen = (status: boolean) => {
    setFullScreen(status);
  };

  return (
    <OverlayContext.Provider
      value={{
        isOpen,
        content,
        openOverlay,
        closeOverlay,
        fullScreen,
        makeFullScreen,
      }}
    >
      {children}
      {isOpen && <Overlay />}
    </OverlayContext.Provider>
  );
};

export const useOverlay = () => {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error("useOverlay must be used within an OverlayProvider");
  }
  return context;
};
