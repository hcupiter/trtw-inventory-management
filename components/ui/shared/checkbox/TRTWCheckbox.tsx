export const TRTWCheckbox = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) => {
  return (
    <div className="flex w-full items-start gap-3 ">
      <input
        className="mt-2"
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      ></input>
      <p className="text-sm">{label}</p>
    </div>
  );
};
