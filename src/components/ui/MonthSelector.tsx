import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatToTitleCase } from "~/utils";
import { useMonthContext } from "~/hooks/useMonthContext";
import Button from "./Button";
import Card from "./Card";

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
    <Card>
      <Card.Body horizontal size="sm">
        <button
          className={`${
            !hasPreviousMonth ? "invisible" : ""
          } h-8 w-8 rounded-full text-primary-light hover:bg-primary-light hover:text-primary-med`}
        >
          <FontAwesomeIcon icon={faArrowLeft} onClick={getPreviousMonth} />
        </button>
        <Button
          noShadow
          style="invisible"
          title={`${formatToTitleCase(month)} ${formatToTitleCase(year)}`}
        />
        <button
          className={`${
            !hasNextMonth ? "invisible" : ""
          } h-8 w-8 rounded-full text-primary-light hover:bg-primary-light hover:text-primary-med`}
        >
          <FontAwesomeIcon icon={faArrowRight} onClick={getNextMonth} />
        </button>
      </Card.Body>
    </Card>
  );
};

export default MonthSelector;
