import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TRDWDatePicker = ({ ...props }) => {
  return (
    <div>
      <DatePicker
        className="text-black px-4 py-4 bg-gray-200 rounded-lg"
        {...props}
      />
    </div>
  );
};

export default TRDWDatePicker;
