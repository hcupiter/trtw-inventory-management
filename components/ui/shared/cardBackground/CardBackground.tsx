import { ReactNode } from "react";

export const CardBackground = ({
  children,
  onClick,
}: {
  children?: ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div
      className="flex px-4 py-3 w-full rounded-lg bg-white-smoke justify-between hover:bg-gray-200 items-center select-none"
      onClick={onClick}
    >
      {children}
    </div>
  );
};
