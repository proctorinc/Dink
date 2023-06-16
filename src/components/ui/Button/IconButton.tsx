import { type SizeProp } from "@fortawesome/fontawesome-svg-core";
import { type IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type MouseEventHandler, type FC } from "react";

type IconButtonProps = {
  icon: IconDefinition;
  active?: boolean;
  style?: "secondary" | "primary" | "danger";
  size?: "sm" | "xs";
  iconSize?: "xl" | "lg" | "sm" | "xs";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  noShadow?: boolean;
  disabled?: boolean;
};

export const IconButton: FC<IconButtonProps> = ({
  icon,
  active,
  style,
  size,
  iconSize,
  onClick,
  className,
  noShadow,
  disabled,
}) => {
  let buttonSize = "w-10";
  if (size === "sm") {
    buttonSize = "w-8";
  } else if (size === "xs") {
    buttonSize = "w-4";
  }
  let innerIconSize: SizeProp = "lg";
  if (size === "sm") {
    innerIconSize = "lg";
  } else if (size === "xs") {
    innerIconSize = "2xs";
  }

  let iconStyle =
    "text-primary-light hover:bg-primary-light hover:text-primary-med";

  if (active && style === "secondary") {
    iconStyle = "bg-secondary-light text-secondary-med";
  } else if (style === "secondary") {
    iconStyle =
      "bg-secondary-dark text-secondary-med group-hover:bg-secondary-med group-hover:text-secondary-light";
  } else if (active && style === "danger") {
    iconStyle = "bg-danger-light text-danger-med";
  } else if (style === "danger") {
    iconStyle =
      "bg-danger-dark text-danger-med group-hover:bg-danger-med group-hover:text-danger-light";
  } else if (active) {
    iconStyle = "bg-primary-light text-primary-med";
  }

  return (
    <button
      className={`${iconStyle} ${buttonSize} flex aspect-square items-center justify-center rounded-lg ${
        noShadow ? "" : "shadow-xl"
      } ${className ?? ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      <FontAwesomeIcon size={iconSize ?? innerIconSize} icon={icon} />
    </button>
  );
};
