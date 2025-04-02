import { formatDateToYYYYMMDD } from "@/utils/dateFormatter";
import { useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";

const TRDWDatePicker = ({
  selected,
  onChange,
  ...props
}: {
  selected: Date | null;
  onChange: (date: Date | null) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="bg-gray-200 rounded-lg flex w-fit items-center px-4 py-4 cursor-pointer select-none"
      onClick={() => inputRef.current?.showPicker()} // Trigger input click
    >
      <input
        ref={inputRef} // Assign ref to input
        id="custom-datepicker"
        type="date"
        value={formatDateToYYYYMMDD(selected || new Date())}
        {...props}
        onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
        className="text-black bg-transparent appearance-none focus:outline-none cursor-pointer select-none"
      />
    </div>
  );
};

export default TRDWDatePicker;
