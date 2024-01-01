import { type FC } from "react";
import { formatToCurrency } from "~/utils";
import { ProgressBar } from "~/components/ui/Charts";
import { api } from "~/utils/api";
import { useMonthContext } from "~/hooks/useMonthContext";
import { faArrowRight, faMoneyCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "~/components/ui/Button";

export type IncomeBudgetType = {
  open: string;
  onClick: (budgetId: string) => void;
};

export const IncomeBudget: FC<IncomeBudgetType> = () => {
  const { startOfMonth, endOfMonth } = useMonthContext();
  const userPreferences = api.users.getUserPreferences.useQuery();
  const income = api.transactions.getIncomeByMonth.useQuery({
    startOfMonth,
    endOfMonth,
  });

  const targetIncome = userPreferences.data?.targetIncome;

  if (Number(targetIncome) === 0) {
    return (
      <div>
        <div className="flex flex-col">
          <h3 className="text-xl font-bold">Income</h3>
          <span className="text-sm text-primary-light group-hover:text-primary-med">
            Not setup yet
          </span>
        </div>
        <Button title="Fix" icon={faArrowRight} style="secondary" iconRight />
      </div>
    );
  }

  return (
    <>
      <div className="flex w-full border-b border-gray-300 p-4">
        <div className="flex w-full items-center gap-1">
          <button className="h-8 w-8 rounded-lg bg-secondary-dark text-secondary-med shadow-md">
            <FontAwesomeIcon size="lg" icon={faMoneyCheck} />
          </button>
          <div className="flex w-full flex-col gap-1 pl-2">
            <div className="flex justify-between group-hover:text-primary-med">
              <h3>Income</h3>
              <span>{formatToCurrency(income.data)} / $???.??</span>
            </div>
            <ProgressBar size="sm" value={income.data} goal={income.data} />
          </div>
        </div>
      </div>
    </>
  );
};
