import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { formatToMonthYear } from "~/utils";

const MonthYearSelector = () => {
  const [date, setDate] = useState(new Date());

  const incrementDate = () => {
    setDate(new Date(date.setMonth(date.getMonth() + 1)));
  };

  const decrementDate = () => {
    setDate(new Date(date.setMonth(date.getMonth() - 1)));
  };

  return (
    <div className="flex w-full items-center justify-between rounded-xl bg-primary-med py-2 px-2 text-primary-light">
      <button className="h-8 w-8 rounded-full text-primary-light hover:bg-primary-light hover:text-primary-med">
        <FontAwesomeIcon icon={faArrowLeft} onClick={decrementDate} />
      </button>
      <span className="font-bold text-primary-light">
        {formatToMonthYear(date)}
      </span>
      <button className="h-8 w-8 rounded-full text-primary-light hover:bg-primary-light hover:text-primary-med">
        <FontAwesomeIcon icon={faArrowRight} onClick={incrementDate} />
      </button>
    </div>
  );
};

export default MonthYearSelector;
