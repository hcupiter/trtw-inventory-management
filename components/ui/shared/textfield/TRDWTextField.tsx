import { InputHTMLAttributes, useState } from "react";
import { Icon } from "@iconify/react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  mandatory?: boolean;
  label: string;
  placeholder: string;
  error?: string;
  disabled?: boolean;
}

const TRDWTextField: React.FC<TextFieldProps> = ({
  type,
  mandatory = false,
  label,
  placeholder = "",
  error = "",
  value,
  onChange,
  disabled = false,
  ...props
}) => {
  // State to control password visibility.
  const [showPassword, setShowPassword] = useState(false);

  // Determine the actual input type.
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex w-full flex-col items-start justify-start gap-1">
      <label className="text-base text-black font-bold">
        {label} {mandatory && <span className="text-red">*</span>}
      </label>
      {/* Wrap the input in a relatively positioned container */}
      <div className="relative flex flex-col items-start w-full">
        <input
          type={inputType}
          className={`focus:outline-0 border-1 w-full rounded-lg px-4 py-3 placeholder:text-gray-400 ${
            error ? "border-red" : "border-gray-300"
          } ${disabled ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        {/* Conditionally render the eye icon if input type is password */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            aria-label="Toggle password visibility"
          >
            {showPassword ? (
              <Icon icon={"mdi:eye-outline"} />
            ) : (
              <Icon icon={"heroicons:eye-slash-16-solid"} />
            )}
          </button>
        )}
        {error && <p className="text-base text-red">{error}</p>}
      </div>
    </div>
  );
};

export default TRDWTextField;
