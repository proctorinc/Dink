import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatToTitleCase } from "~/utils";
import { useMonthContext } from "../hooks/useMonthContext";

const MonthSelector = () => {
  const { month, year, hasNextMonth, getNextMonth, getPreviousMonth } =
    useMonthContext();

  return (
    <div className="flex w-full items-center justify-between rounded-xl bg-primary-med py-2 px-2 text-primary-light">
      <button className="h-8 w-8 rounded-full text-primary-light hover:bg-primary-light hover:text-primary-med">
        <FontAwesomeIcon icon={faArrowLeft} onClick={getPreviousMonth} />
      </button>
      <span className="font-bold text-primary-light">
        {formatToTitleCase(month)} {formatToTitleCase(year)}
      </span>
      <button
        className={`${
          !hasNextMonth() ? "invisible" : ""
        } h-8 w-8 rounded-full text-primary-light hover:bg-primary-light hover:text-primary-med`}
      >
        <FontAwesomeIcon icon={faArrowRight} onClick={getNextMonth} />
      </button>
    </div>
  );
};

export default MonthSelector;
