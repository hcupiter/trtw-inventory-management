import { ReactNode } from "react";

export const TRDWLabel = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) => {
  return (
    <div className="w-full flex justify-between border-b-1 border-gray-300 pb-3">
      <p className="text-base">{title}</p>
      <div className="text-base font-bold">
        {description ? <p>{description}</p> : children}
      </div>
    </div>
  );
};
