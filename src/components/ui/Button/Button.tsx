import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type FC, type ReactNode } from "react";

type ButtonProps = {
  primary?: boolean;
  icon?: IconDefinition;
  style?: "primary" | "secondary" | "warning" | "danger" | "invisible";
  children?: ReactNode;
  title?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  iconRight?: boolean;
  disabled?: boolean;
  size?: "sm" | "lg";
  className?: string;
  noShadow?: boolean;
  type?: "submit" | "button" | "reset";
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
  noShadow,
  type,
}) => {
  let buttonColors =
    "bg-primary-med bg-gradient-to-b from-primary-med to-primary-med-dark text-primary-light hover:bg-primary-light hover:from-primary-light hover:to-primary-light hover:text-primary-med hover:ring hover:ring-primary-med group-hover:text-primary-light";

  if (disabled && style === "warning") {
    buttonColors = "text-warning-med ring ring-warning-med";
  } else if (disabled && style === "danger") {
    buttonColors = "text-danger-med ring ring-danger-med";
  } else if (disabled) {
    buttonColors = "text-primary-med border-2 border-primary-med";
  } else if (style === "secondary") {
    buttonColors =
      "bg-secondary-med bg-gradient-to-b from-secondary-med to-secondary-med-dark text-secondary-dark hover:bg-secondary-light hover:text-secondary-med-light hover:from-secondary-light hover:to-secondary-light hover:ring hover:ring-secondary-med group-hover:text-secondary-light";
  } else if (style === "warning") {
    buttonColors =
      "bg-warning-med text-warning-dark hover:bg-warning-light hover:text-warning-med hover:ring hover:ring-warning-med group-hover:text-warning-light";
  } else if (style === "danger") {
    buttonColors =
      "bg-danger-med text-danger-dark hover:bg-danger-light hover:text-danger-med hover:ring hover:ring-danger-med group-hover:text-danger-light";
  } else if (style === "invisible") {
    buttonColors = "bg-transparent";
  }

  let buttonSize = "h-10 py-3 px-5";

  if (size === "sm") {
    buttonSize = "px-2 text-xs py-1";
  } else if (size === "lg") {
    buttonSize = "px-4 text-md py-2";
  }

  return (
    <button
      className={`${buttonColors} ${buttonSize} flex items-center justify-center gap-2 rounded-lg font-bold ${
        noShadow ? "" : "shadow-lg"
      } ${className ?? ""}`}
      onClick={onClick}
      disabled={disabled}
      type={type ?? "button"}
    >
      {icon && !iconRight && <FontAwesomeIcon icon={icon} />}
      {title && <span>{title}</span>}
      {icon && iconRight && <FontAwesomeIcon icon={icon} />}
    </button>
  );
};

export default Button;
