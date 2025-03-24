export const TRDWCardLabel = ({
  width,
  customClassConfig,
  title,
  description,
  debug = false,
}: {
  width?: number;
  customClassConfig?: string;
  title: string;
  description: string;
  debug?: boolean;
}) => {
  return (
    <div
      className={`flex flex-col ${debug && "bg-red"} ${customClassConfig}`}
      style={{ width: `${width}vw` }}
    >
      <p className="text-2xs text-gray">{title}</p>
      <p className="text-base font-bold">{description}</p>
    </div>
  );
};
