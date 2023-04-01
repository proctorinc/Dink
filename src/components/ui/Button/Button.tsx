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
};

const Button: FC<ButtonProps> = ({
  title,
  active,
  icon,
  onClick,
  iconRight,
}) => {
  const colors = active
    ? "bg-secondary-med py-2 px-5 font-bold text-secondary-dark hover:bg-secondary-light hover:text-secondary-med hover:ring hover:ring-secondary-med group-hover:text-secondary-light"
    : "bg-primary-med py-2 px-5 font-bold text-primary-light hover:bg-primary-light hover:text-primary-med hover:ring hover:ring-primary-med group-hover:text-primary-light";

  return (
    <button
      className={`flex h-10 items-center justify-center gap-2 rounded-lg ${colors}`}
      onClick={onClick}
    >
      {icon && !iconRight && <FontAwesomeIcon icon={icon} />}
      {title && <span>{title}</span>}
      {icon && iconRight && <FontAwesomeIcon icon={icon} />}
    </button>
  );
};

export default Button;
