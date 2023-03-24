import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "~/components/ui/Header";
import MonthYearSelector from "~/components/ui/MonthYearSelector";
import {
  formatToCurrency,
  formatToPercentage,
  formatToTitleCase,
} from "~/utils";
import { api } from "~/utils/api";

export default function Budgets() {
  const budgetData = api.budgets.getAllData.useQuery();

  return (
    <>
      <Header
        title="Budget"
        subtitle={`Left: ${formatToCurrency(budgetData.data?.leftover)}`}
        icon={
          <FontAwesomeIcon
            className="h-6 w-6 text-primary-light hover:text-white"
            icon={faGear}
          />
        }
      />

      {/* Budget total summary component */}
      <div className="flex w-full flex-col justify-between gap-1 rounded-xl bg-primary-med p-4">
        <div className="relative h-6 w-full rounded-md bg-primary-dark">
          <div className="absolute h-full w-[40%] rounded-md bg-gradient-to-r from-secondary-dark to-secondary-med"></div>
        </div>
        <div className="flex justify-between">
          <span className="text-md text-primary-light">
            {formatToCurrency(budgetData.data?.spent)} /{" "}
            {formatToCurrency(budgetData.data?.goal)}
          </span>
          <span className="text-md text-primary-light">
            {formatToPercentage(budgetData.data?.spent, budgetData.data?.goal)}{" "}
            spent
          </span>
        </div>
      </div>

      {/* Chart block component */}
      <div className="h-40 w-full rounded-xl bg-gradient-to-t from-secondary-dark to-secondary-med"></div>

      <MonthYearSelector />

      {budgetData.data?.budgets.map((budget) => (
        <div
          key={budget.id}
          className="group flex w-full flex-col justify-between gap-1 rounded-xl bg-primary-med p-4 hover:bg-primary-light hover:text-primary-dark"
        >
          <h3 className="text-xl font-bold">
            {formatToTitleCase(budget.name)}
          </h3>
          <div className="relative h-6 w-full rounded-md bg-primary-dark group-hover:bg-primary-med">
            <div className="absolute h-full w-[40%] rounded-md bg-gradient-to-r from-secondary-dark to-secondary-med"></div>
          </div>
          <div className="flex justify-between text-sm text-primary-light group-hover:text-primary-med">
            <span>$??? / {formatToCurrency(budget.goal)}</span>
            <span>$??? left</span>
          </div>
        </div>
      ))}
    </>
  );
}
