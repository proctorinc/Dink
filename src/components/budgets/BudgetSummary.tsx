import { useRouter } from "next/router";
import {
  formatToCurrency,
  formatToPercentage,
  getFirstDayOfMonth,
  getLastDayOfMonth,
} from "~/utils";
import { api } from "~/utils/api";

const BudgetSummary = () => {
  const router = useRouter();
  const today = new Date();
  const startOfMonth = getFirstDayOfMonth(today);
  const endOfMonth = getLastDayOfMonth(today);
  const budgetData = api.budgets.getDataByMonth.useQuery({
    startOfMonth,
    endOfMonth,
  });

  const percentSpent = formatToPercentage(
    budgetData?.data?.spent,
    budgetData?.data?.goal
  );

  return (
    <div
      className="group flex w-full cursor-pointer flex-col justify-between gap-1 rounded-xl bg-primary-med p-4 hover:bg-primary-light hover:text-primary-dark"
      onClick={() => {
        void router.push("/budget");
      }}
    >
      <div className="flex justify-between">
        <h3 className="text-xl font-bold">Budget</h3>
        <h3 className="text-lg font-bold text-primary-light group-hover:text-primary-med">
          {formatToPercentage(budgetData.data?.spent, budgetData.data?.goal)}{" "}
          Spent
        </h3>
      </div>
      <span className="text-sm text-primary-light group-hover:text-primary-med">
        {formatToCurrency(budgetData.data?.spent)} /{" "}
        {formatToCurrency(budgetData.data?.goal)}
      </span>
      <div className="relative h-6 w-full rounded-md bg-primary-dark group-hover:bg-primary-med">
        <div
          className="absolute h-full rounded-md bg-gradient-to-r from-secondary-dark to-secondary-med"
          style={{ width: percentSpent }}
        ></div>
      </div>
    </div>
  );
};

export default BudgetSummary;
