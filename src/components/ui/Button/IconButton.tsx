import { type IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type MouseEventHandler, type FC } from "react";

type IconButtonProps = {
  icon: IconDefinition;
  active?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const IconButton: FC<IconButtonProps> = ({ icon, active, onClick }) => {
  const iconStyle = active
    ? "bg-primary-light text-primary-med"
    : "text-primary-light hover:bg-primary-light hover:text-primary-med";

  return (
    <button className={`${iconStyle} h-10 w-10 rounded-full`} onClick={onClick}>
      <FontAwesomeIcon size="xl" icon={icon} />
    </button>
  );
};
