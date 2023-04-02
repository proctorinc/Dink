import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type FC, type ReactNode } from "react";

type ButtonProps = {
  primary?: boolean;
  icon?: IconDefinition;
  active?: boolean;
  children?: ReactNode;
  title?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  iconRight?: boolean;
  disabled?: boolean;
  size?: "sm";
};

const Button: FC<ButtonProps> = ({
  title,
  active,
  icon,
  onClick,
  iconRight,
  disabled,
  size,
}) => {
  let buttonColors =
    "bg-primary-med text-primary-light hover:bg-primary-light hover:text-primary-med hover:ring hover:ring-primary-med group-hover:text-primary-light";

  if (disabled) {
    buttonColors = "text-primary-med ring ring-primary-med";
  } else if (active) {
    buttonColors =
      "bg-secondary-med text-secondary-dark hover:bg-secondary-light hover:text-secondary-med hover:ring hover:ring-secondary-med group-hover:text-secondary-light";
  }

  const buttonSize = size === "sm" ? "px-2 text-xs py-1" : "h-10 py-2 px-5";

  return (
    <button
      className={`${buttonColors} ${buttonSize} flex items-center justify-center gap-2 rounded-lg font-bold`}
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
