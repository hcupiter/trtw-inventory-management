import TRDWDatePicker from "./TRDWDatePicker";

const TRDWDatePickerLabel = ({
  label,
  mandatory = false,
  selected,
  onChange,
  ...props
}: {
  label: string;
  mandatory?: boolean;
  selected: Date;
  onChange: (date: Date | null) => void;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-lg font-bold">
        {label} {mandatory && <span className="text-red">*</span>}
      </label>
      <TRDWDatePicker selected={selected} onChange={onChange} {...props} />
    </div>
  );
};

export default TRDWDatePickerLabel;
