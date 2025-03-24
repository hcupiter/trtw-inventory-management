import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomInput = (props: React.ComponentPropsWithoutRef<"input">) => (
  <input {...props} readOnly className="text-black py-4 pl-4" />
);

const TRDWDatePicker = ({
  selected,
  onChange,
  ...props
}: {
  selected: Date;
  onChange: (date: Date | null) => void;
}) => {
  return (
    <div className="bg-gray-200 rounded-lg flex w-fit items-center">
      <DatePicker
        className="text-black py-4 pl-4"
        selected={selected}
        onChange={onChange}
        {...props}
        customInput={<CustomInput />}
      />
    </div>
  );
};

export default TRDWDatePicker;
