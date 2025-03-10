import { InputHTMLAttributes, ReactNode } from "react";
import styles from "./TextField.module.css";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  mandatory?: boolean;
  label?: string;
  placeholder?: string;
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
  const errorBorderStyle = error ? styles.containerError : styles.container;

  return (
    <div className={styles.textfieldBase}>
      <label className={styles.label}>
        {label} {mandatory && <span className={styles.mandatory}>*</span>}
      </label>
      <div className="flex flex-col items-start w-full">
        <input
          type={type}
          className={`${errorBorderStyle} ${styles.content}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
};

export default TRDWTextField;
