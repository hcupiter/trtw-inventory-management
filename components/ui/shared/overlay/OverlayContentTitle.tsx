import { Icon } from "@iconify/react";

export const OverlayContentTitle = ({
  title,
  onCancel,
}: {
  title: string;
  onCancel: () => void;
}) => {
  return (
    <div className="flex gap-5 items-center">
      <Icon
        icon={"heroicons-outline:chevron-left"}
        className="w-7 h-7 hover:text-blue"
        onClick={onCancel}
      />
      <h1 className="text-black text-2xl font-bold">{title}</h1>
    </div>
  );
};
