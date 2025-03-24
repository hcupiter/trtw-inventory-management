"use client";

import { Overlay } from "@/components/ui/shared/overlay/Overlay";
import { createContext, useContext, useState, ReactNode } from "react";

type OverlayContextType = {
  isOpen: boolean;
  content: ReactNode;
  fullScreen: boolean;
  openOverlay: ({
    overlayContent,
    isFullScreen,
  }: {
    overlayContent: ReactNode;
    isFullScreen?: boolean;
  }) => void;
  closeOverlay: () => void;
};

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export const OverlayProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [fullScreen, setFullScreen] = useState(false); // ✅ Added fullScreen state

  const openOverlay = ({
    overlayContent,
    isFullScreen = false,
  }: {
    overlayContent: ReactNode;
    isFullScreen?: boolean;
  }) => {
    setContent(overlayContent);
    if (isFullScreen) setFullScreen(isFullScreen);
    else setFullScreen(false);
    setIsOpen(true);
  };

  const closeOverlay = () => {
    setIsOpen(false);
    setFullScreen(false);
    setContent(null);
  };

  return (
    <OverlayContext.Provider
      value={{
        isOpen,
        content,
        fullScreen,
        openOverlay,
        closeOverlay,
      }}
    >
      {children}
      {isOpen && <Overlay fullScreen={fullScreen} />}
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
