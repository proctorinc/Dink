import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatToTitleCase } from "~/utils";
import { useMonthContext } from "~/hooks/useMonthContext";
import Button from "./Button";

const MonthSelector = () => {
  const {
    month,
    year,
    hasNextMonth,
    hasPreviousMonth,
    getNextMonth,
    getPreviousMonth,
  } = useMonthContext();

  return (
    <div className="flex w-full items-center justify-between rounded-xl bg-primary-med py-1 px-2 text-primary-light">
      <button
        className={`${
          !hasPreviousMonth ? "invisible" : ""
        } h-8 w-8 rounded-full text-primary-light hover:bg-primary-light hover:text-primary-med`}
      >
        <FontAwesomeIcon icon={faArrowLeft} onClick={getPreviousMonth} />
      </button>
      <Button
        noShadow
        title={`${formatToTitleCase(month)} ${formatToTitleCase(year)}`}
      />
      <button
        className={`${
          !hasNextMonth ? "invisible" : ""
        } h-8 w-8 rounded-full text-primary-light hover:bg-primary-light hover:text-primary-med`}
      >
        <FontAwesomeIcon icon={faArrowRight} onClick={getNextMonth} />
      </button>
    </div>
  );
};

export default MonthSelector;
