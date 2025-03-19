import { ButtonHTMLAttributes, ReactNode } from "react";
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
  const variantStyle =
    variant === ButtonVariant.PRIMARY
      ? `bg-blue text-white hover:bg-dark-blue`
      : variant === ButtonVariant.SECONDARY
      ? `text-blue border-blue border-1 hover:bg-blue hover:text-white`
      : `text-red border-red border-1 hover:bg-red hover:text-white`;
  const fullWidthStyle = fullWidth ? "w-full" : null;

  return (
    <button
      className={`flex px-4 py-3 justify-center items-center rounded-lg gap-4 text-base ${variantStyle} ${fullWidthStyle} select-none`}
      {...props}
    >
      {iconName && <Icon icon={iconName} />}
      {children && <span>{children}</span>}
    </button>
  );
};

export default TRDWButton;
