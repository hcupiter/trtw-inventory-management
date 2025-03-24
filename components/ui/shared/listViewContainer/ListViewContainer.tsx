import { ReactNode } from "react";

export const ListViewContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col gap-2 size-full mb-20 overflow-auto no-scrollbar">
      {children}
    </div>
  );
};
