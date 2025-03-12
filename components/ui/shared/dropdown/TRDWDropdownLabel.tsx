import TRDWDropdown from "./TRDWDropdown";

const TRDWDropdownLabel = ({
  label,
  mandatory = false,
  contents,
  selected,
  onChange,
}: {
  label: string;
  mandatory?: boolean;
  contents: string[];
  selected: string;
  onChange: (selected: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-lg font-bold">
        {label} {mandatory && <span className="text-red">*</span>}
      </label>
      <TRDWDropdown
        contents={contents}
        selected={selected}
        onChange={onChange}
      />
    </div>
  );
};

export default TRDWDropdownLabel;
