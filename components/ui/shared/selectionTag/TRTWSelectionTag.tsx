export const TRTWSelectionTag = ({
  description,
  isActive,
  onClick,
}: {
  description: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex w-fit border-1 rounded-lg border-blue ${
        isActive ? "bg-blue *:text-white font-bold" : "*:text-blue font-normal"
      } cursor-pointer`}
    >
      <p className="p-2">{description}</p>
    </div>
  );
};
