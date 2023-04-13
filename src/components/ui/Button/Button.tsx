import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type FC, type ReactNode } from "react";

type ButtonProps = {
  primary?: boolean;
  icon?: IconDefinition;
  style?: "primary" | "secondary" | "warning" | "danger";
  children?: ReactNode;
  title?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  iconRight?: boolean;
  disabled?: boolean;
  size?: "sm";
  className?: string;
};

const Button: FC<ButtonProps> = ({
  title,
  style,
  icon,
  onClick,
  iconRight,
  disabled,
  size,
  className,
}) => {
  let buttonColors =
    "bg-primary-med text-primary-light hover:bg-primary-light hover:text-primary-med hover:ring hover:ring-primary-med group-hover:text-primary-light";

  if (disabled && style === "warning") {
    buttonColors = "text-warning-med ring ring-warning-med";
  } else if (disabled && style === "danger") {
    buttonColors = "text-danger-med ring ring-danger-med";
  } else if (disabled) {
    buttonColors = "text-primary-med ring ring-primary-med";
  } else if (style === "secondary") {
    buttonColors =
      "bg-secondary-med text-secondary-dark hover:bg-secondary-light hover:text-secondary-med hover:ring hover:ring-secondary-med group-hover:text-secondary-light";
  } else if (style === "warning") {
    buttonColors =
      "bg-warning-med text-warning-dark hover:bg-warning-light hover:text-warning-med hover:ring hover:ring-warning-med group-hover:text-warning-light";
  } else if (style === "danger") {
    buttonColors =
      "bg-danger-med text-danger-dark hover:bg-danger-light hover:text-danger-med hover:ring hover:ring-danger-med group-hover:text-danger-light";
  }

  const buttonSize = size === "sm" ? "px-2 text-xs py-1" : "h-10 py-6 px-5";

  return (
    <button
      className={`${buttonColors} ${buttonSize} flex items-center justify-center gap-2 rounded-lg font-bold ${
        className ?? ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && !iconRight && <FontAwesomeIcon icon={icon} />}
      {title && <span>{title}</span>}
      {icon && iconRight && <FontAwesomeIcon icon={icon} />}
    </button>
  );
};

export default Button;
