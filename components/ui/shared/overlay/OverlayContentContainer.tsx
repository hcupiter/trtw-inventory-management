import { ReactNode } from "react";

export const OverlayContentContainer = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="flex flex-col w-200 max-h-[80vh] bg-white gap-6 overflow-y-auto">
      {children}
    </div>
  );
};
