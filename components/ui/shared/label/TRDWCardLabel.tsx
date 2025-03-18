export const TRDWCardLabel = ({
  width,
  title,
  description,
  debug = false,
}: {
  width: number;
  title: string;
  description: string;
  debug?: boolean;
}) => {
  return (
    <div
      className={`flex flex-col ${debug && "bg-red"}`}
      style={{ width: `${width}rem` }}
    >
      <p className="text-2xs text-gray">{title}</p>
      <p className="text-base font-bold">{description}</p>
    </div>
  );
};
