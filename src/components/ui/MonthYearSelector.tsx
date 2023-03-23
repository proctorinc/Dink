import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MonthYearSelector = () => {
  return (
    <div className="flex w-full items-center justify-between rounded-xl bg-primary-med py-2 px-5 text-primary-light">
      <FontAwesomeIcon className="h-4 w-4" icon={faArrowLeft} />
      <span className="font-bold text-primary-light">March 2023</span>
      <FontAwesomeIcon className="h-4 w-4" icon={faArrowRight} />
    </div>
  );
};

export default MonthYearSelector;
