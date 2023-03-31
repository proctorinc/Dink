import React from "react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Spinner = () => {
  return (
    <div className="flex w-full justify-center py-10">
      <FontAwesomeIcon
        className="animate-spin text-primary-light"
        size="2xl"
        icon={faSpinner}
      />
    </div>
  );
};

export default Spinner;
