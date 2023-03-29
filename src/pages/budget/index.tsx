import {
  faChevronLeft,
  faChevronRight,
  faPlus,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useMonthContext } from "~/components/hooks/useMonthContext";
import Header from "~/components/ui/Header";
import MonthYearSelector from "~/components/ui/MonthSelector";
import {
  formatToCurrency,
  formatToProgressPercentage,
  formatToTitleCase,
} from "~/utils";
import { api } from "~/utils/api";

export default function Budgets() {
  const router = useRouter();
  const { startOfMonth, endOfMonth } = useMonthContext();
  const budgetData = api.budgets.getDataByMonth.useQuery({
    startOfMonth,
    endOfMonth,
  });

  return (
    <>
      <Header
        title="Budget"
        subtitle={`Left: ${formatToCurrency(budgetData.data?.leftover)}`}
      />
      <div className="flex w-full items-center justify-center gap-2">
        <div className="p-2">
          <button className="invisible h-8 w-8 rounded-full text-primary-light hover:bg-primary-light hover:text-primary-med">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </div>
        <div className="flex w-full">
          <div className="flex w-full flex-col gap-1">
            <div className="flex w-full items-center justify-center p-2">
              <div className="relative flex aspect-square w-full items-center justify-center rounded-full bg-primary-med">
                <div className="z-20 flex aspect-square w-[75%] flex-col items-center justify-center gap-3 rounded-full bg-primary-dark">
                  <h2 className="text-xl font-bold">Overall</h2>
                  <span className="text-md text-center text-primary-light">
                    {formatToCurrency(budgetData.data?.spent)} /{" "}
                    {formatToCurrency(budgetData.data?.goal)}
                  </span>
                </div>
                <div className="absolute bottom-0 h-[50%] w-full rounded-bl-full rounded-br-full bg-gradient-to-t from-secondary-dark to-secondary-med" />
                <div className="absolute right-0 h-full w-[50%] rounded-br-full rounded-tr-full bg-gradient-to-t from-secondary-dark to-secondary-med" />
              </div>
            </div>
          </div>
        </div>
        <div className="p-2">
          <button className="invisible h-8 w-8 rounded-full text-primary-light hover:bg-primary-light hover:text-primary-med">
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>

      <MonthYearSelector />
      <div className="group flex w-full flex-col justify-between gap-1 rounded-xl bg-primary-med py-2 px-4 hover:bg-primary-light hover:text-primary-dark">
        <h3 className="text-lg font-bold">Income</h3>
        <div className="relative h-4 w-full rounded-md bg-primary-dark group-hover:bg-primary-med">
          <div
            className="absolute h-full rounded-md bg-gradient-to-r from-secondary-dark to-secondary-med"
            style={{ width: "50%" }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-primary-light group-hover:text-primary-med">
          <span>??? / ???</span>
          <span>??? left</span>
        </div>
      </div>
      {budgetData.isLoading && (
        <div className="flex w-full justify-center">
          <FontAwesomeIcon
            className="animate-spin text-primary-light"
            size="2xl"
            icon={faSpinner}
          />
        </div>
      )}
      {budgetData.data?.budgets.map((budget) => {
        const percentSpent = formatToProgressPercentage(
          budget.spent,
          budget.goal
        );
        return (
          <div
            key={budget.id}
            className="group flex w-full flex-col justify-between gap-1 rounded-xl bg-primary-med py-2 px-4 hover:bg-primary-light hover:text-primary-dark"
            onClick={() => void router.push(`/budget/${budget.id}`)}
          >
            <h3 className="text-lg font-bold">
              {formatToTitleCase(budget.name)}
            </h3>
            <div className="relative h-4 w-full rounded-md bg-primary-dark group-hover:bg-primary-med">
              <div
                className="absolute h-full rounded-md bg-gradient-to-r from-secondary-dark to-secondary-med"
                style={{ width: percentSpent }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-primary-light group-hover:text-primary-med">
              <span>
                {formatToCurrency(budget.spent)} /{" "}
                {formatToCurrency(budget.goal)}
              </span>
              {Number(budget.leftover) >= 0 && (
                <span>{formatToCurrency(budget.leftover)} left</span>
              )}
              {Number(budget.leftover) < 0 && (
                <span>{formatToCurrency(budget.leftover)} over</span>
              )}
            </div>
          </div>
        );
      })}
      <button className="flex h-fit items-center gap-2 rounded-lg bg-secondary-med py-2 px-5 font-bold text-secondary-dark hover:bg-secondary-light hover:text-secondary-med hover:ring hover:ring-secondary-med group-hover:text-secondary-light">
        <FontAwesomeIcon className="sm" icon={faPlus} />
        <span>Budget</span>
      </button>
    </>
  );
}
