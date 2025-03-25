import { ReactNode } from "react";

export const ListViewContainer = ({
  scrollable = true,
  children,
}: {
  scrollable?: boolean;
  children: ReactNode;
}) => {
  return (
    <div
      className={`flex flex-col gap-2 size-full ${
        scrollable ? "overflow-auto no-scrollbar" : ""
      }`}
    >
      {children}
    </div>
  );
};
