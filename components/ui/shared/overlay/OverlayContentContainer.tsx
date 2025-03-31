import { ReactNode } from "react";

export const OverlayContentContainer = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col w-[40vw] max-h-[90vh] gap-6">{children}</div>;
};
