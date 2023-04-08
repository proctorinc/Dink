import {
  faAngleDown,
  faAngleUp,
  faChevronLeft,
  faChevronRight,
  faPlus,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMonthContext } from "~/hooks/useMonthContext";
import { ButtonBar, IconButton } from "~/components/ui/Button";
import Button from "~/components/ui/Button/Button";
import Header from "~/components/ui/Header";
import MonthYearSelector from "~/components/ui/MonthSelector";
import Spinner from "~/components/ui/Spinner";
import { formatToCurrency, formatToPercentage } from "~/utils";
import { api } from "~/utils/api";
import Budget, { SavingsBudget, IncomeBudget } from "~/features/budgets";
import { useRouter } from "next/router";
import { PieChart } from "~/components/ui/Charts";
import Page from "~/components/ui/Page";
import { useState } from "react";

export default function Budgets() {
  const router = useRouter();
  const {
    month,
    year,
    setCurrentMonth,
    startOfMonth,
    endOfMonth,
    isCurrentMonth,
  } = useMonthContext();
  const budgetData = api.budgets.getDataByMonth.useQuery({
    startOfMonth,
    endOfMonth,
  });
  const [showSavings, setShowSavings] = useState(true);
  const [showSpending, setShowSpending] = useState(true);
  const percentSpent = formatToPercentage(
    budgetData?.data?.spent,
    budgetData?.data?.goal
  );

  const chartData = [
    { name: "Spent", amount: budgetData.data?.spent },
    { name: "Left", amount: budgetData.data?.leftover },
  ];

  return (
    <Page auth title="Budget">
      <Header title={`Budget`} subtitle={`${month} ${year}`} />
      <div className="flex w-full items-center justify-center">
        <div className="p-2">
          <button className="h-8 w-8 rounded-full text-primary-light hover:bg-primary-light hover:text-primary-med">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </div>
        <div className="relative flex h-52 w-full flex-col items-center justify-center pb-5">
          <div className="absolute flex flex-col items-center justify-center text-xl font-bold">
            <h2 className="text-3xl font-bold">{percentSpent}</h2>
          </div>
          <PieChart data={chartData} progress />
          <span className="absolute bottom-0 font-bold text-primary-light">
            {formatToCurrency(budgetData.data?.spent)} /{" "}
            {formatToCurrency(budgetData.data?.goal)}
          </span>
        </div>
        <div className="p-2">
          <button className="h-8 w-8 rounded-full text-primary-light hover:bg-primary-light hover:text-primary-med">
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
      <ButtonBar>
        {isCurrentMonth && (
          <Button
            title="Budget"
            icon={faPlus}
            style="secondary"
            onClick={() => void router.push("/budget/create")}
          />
        )}
        {!isCurrentMonth && (
          <Button
            title="Current"
            icon={faRedo}
            onClick={setCurrentMonth}
            style="secondary"
          />
        )}
      </ButtonBar>
      <></>
      <MonthYearSelector />
      {budgetData.isLoading && <Spinner />}
      {budgetData.isSuccess && (
        <>
          <IncomeBudget />
          <div
            className="flex w-full items-center justify-between"
            onClick={() => setShowSpending((prev) => !prev)}
          >
            <h3 className="w-full text-left text-xl font-bold text-primary-light">
              Spending
            </h3>
            <IconButton icon={showSpending ? faAngleDown : faAngleUp} />
          </div>
          {showSpending &&
            budgetData.data?.budgets.spending.map((budget) => (
              <Budget key={budget.id} data={budget} />
            ))}
          <div
            className="flex w-full items-center justify-between"
            onClick={() => setShowSavings((prev) => !prev)}
          >
            <h3 className="w-full text-left text-xl font-bold text-primary-light">
              Savings
            </h3>
            <IconButton icon={showSavings ? faAngleDown : faAngleUp} />
          </div>
          <div className="flex w-full flex-col gap-3">
            {showSavings &&
              budgetData.data?.budgets.savings.map((budget) => (
                <SavingsBudget key={budget.id} data={budget} />
              ))}
          </div>
        </>
      )}
    </Page>
  );
}
