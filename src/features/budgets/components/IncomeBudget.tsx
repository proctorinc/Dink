import { type FC } from "react";
import { formatToCurrency } from "~/utils";
import { ProgressBar } from "~/components/ui/Charts";
import { api } from "~/utils/api";
import { useMonthContext } from "~/hooks/useMonthContext";
import {
  faArrowRight,
  faMoneyCheck,
  faPencil,
  faReceipt,
  faSitemap,
} from "@fortawesome/free-solid-svg-icons";
import Button, { IconButton } from "~/components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type IncomeBudgetType = {
  open: string;
  onClick: (budgetId: string) => void;
};

export const IncomeBudget: FC<IncomeBudgetType> = ({ open, onClick }) => {
  const { startOfMonth, endOfMonth } = useMonthContext();
  const userPreferences = api.users.getUserPreferences.useQuery();
  const income = api.transactions.getIncomeByMonth.useQuery({
    startOfMonth,
    endOfMonth,
  });
  const INCOME = "income";

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
      <div
        className={
          open === INCOME
            ? "flex w-full bg-gray-100 p-4"
            : "flex w-full border-b border-gray-300 p-4"
        }
        onClick={() => onClick(INCOME)}
      >
        <div className="flex w-full items-center gap-1">
          <IconButton size="sm" icon={faMoneyCheck} style="secondary" />
          <div className="flex w-full flex-col gap-1 pl-2">
            <div className="flex justify-between group-hover:text-primary-med">
              <h3>Income</h3>
              <span>{formatToCurrency(income.data)} / $???.??</span>
            </div>
            <ProgressBar size="sm" value={income.data} goal={income.data} />
          </div>
        </div>
      </div>
      {open === INCOME && (
        <div className="flex justify-around border-b border-gray-300 bg-gray-100 p-4 text-gray-600">
          <FontAwesomeIcon icon={faPencil} />
          <FontAwesomeIcon icon={faSitemap} />
          <FontAwesomeIcon icon={faReceipt} />
        </div>
      )}
    </>
  );
};
