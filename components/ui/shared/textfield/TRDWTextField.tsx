import { InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  mandatory?: boolean;
  label: string;
  placeholder: string;
  error?: string;
}

const TRDWTextField: React.FC<TextFieldProps> = ({
  type,
  mandatory = false,
  label,
  placeholder = "",
  error = "",
  value,
  onChange,
  ...props
}) => {
  return (
    <div className={"flex w-full flex-col items-start justify-start gap-1"}>
      <label className={"text-base text-black font-bold"}>
        {label} {mandatory && <span className={"text-red"}>*</span>}
      </label>
      <div className="flex flex-col items-start w-full">
        <input
          type={type}
          className={`focus:outline-0 border-1 w-full rounded-lg px-4 py-3 placeholder:text-gray-400 ${
            error ? "border-red" : "border-gray-300"
          }`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
        {error && <p className={"text-base text-red"}>{error}</p>}
      </div>
    </div>
  );
};

export default TRDWTextField;
