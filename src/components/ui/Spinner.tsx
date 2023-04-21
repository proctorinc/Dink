import { type FC } from "react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type SizeProp } from "@fortawesome/fontawesome-svg-core";

type SpinnerProps = {
  size?: "sm" | "xs" | "lg";
};

const Spinner: FC<SpinnerProps> = ({ size }) => {
  let spinnerSize: SizeProp = "2xl";

  if (size === "sm") {
    spinnerSize = "lg";
  } else if (size === "xs") {
    spinnerSize = "sm";
  }

  return (
    <FontAwesomeIcon
      className="animate-spin text-primary-light"
      size={spinnerSize}
      icon={faSpinner}
    />
  );
};

export default Spinner;
