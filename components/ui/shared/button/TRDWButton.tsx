import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";
import { Icon } from "@iconify/react";

// Define button variants
export enum ButtonVariant {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  DANGER = "danger",
}

// Define the button props
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  iconName?: string;
  fullWidth?: boolean;
  children?: ReactNode;
}

const TRDWButton: React.FC<ButtonProps> = ({
  variant = ButtonVariant.PRIMARY,
  iconName,
  fullWidth = false,
  children,
  ...props
}) => {
  const baseStyle = styles.buttonBase;
  const variantStyle =
    variant === ButtonVariant.PRIMARY
      ? styles.buttonPrimary
      : variant === ButtonVariant.SECONDARY
      ? styles.buttonSecondary
      : styles.buttonDestructive;
  const fullWidthStyle = fullWidth ? "w-full" : null;

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${fullWidthStyle}`}
      {...props}
    >
      {iconName && <Icon icon={iconName} />}
      {children && <span>{children}</span>}
    </button>
  );
};

export default TRDWButton;
