import {
  faAngleDown,
  faAngleUp,
  faChevronLeft,
  faChevronRight,
  faPlus,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";
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
import { useEffect, useState } from "react";
import { BarChart } from "~/components/ui/Charts/BarChart";
import useNotifications from "~/hooks/useNotifications";

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
  const budgetData = api.budgets.getDataByMonth.useQuery(
    {
      startOfMonth,
      endOfMonth,
    },
    {
      onSuccess: () => clearNotification(),
      onError: () => setErrorNotification("Failed to fetch budgets"),
    }
  );
  const [showSavings, setShowSavings] = useState(true);
  const [showSpending, setShowSpending] = useState(true);
  const [chartNum, setChartNum] = useState(0);
  const percentOverall = formatToPercentage(
    budgetData?.data?.overall.spent,
    budgetData?.data?.overall.goal
  );
  const { setLoadingNotification, clearNotification, setErrorNotification } =
    useNotifications();

  useEffect(() => {
    if (budgetData.isFetching) {
      setLoadingNotification("Loading Budgets...");
    }
  }, [budgetData, setLoadingNotification]);

  const overallData = [
    { name: "Spent", amount: budgetData.data?.overall.spent },
    { name: "Left", amount: budgetData.data?.overall.leftover },
  ];
  const barGraphData = [
    {
      title: "Spending",
      amount: Number(budgetData.data?.spending.total),
      goal: Number(budgetData.data?.spending.leftover),
    },
    {
      title: "Savings",
      amount: Number(budgetData.data?.savings.total),
      goal: Number(budgetData.data?.savings.leftover),
    },
  ];

  return (
    <Page auth title="Budget">
      <Header title={`Budget`} subtitle={`${month} ${year}`} />
      <div className="flex h-44 w-full items-center justify-center">
        <IconButton
          className={chartNum == 0 ? "invisible" : ""}
          icon={faChevronLeft}
          onClick={() => setChartNum((prev) => prev - 1)}
        />
        {chartNum === 0 && (
          <div className="relative flex h-full w-full flex-col items-center justify-center pb-5">
            <div className="absolute flex flex-col items-center justify-center text-xl font-bold">
              <h2 className="text-2xl font-bold">{percentOverall}</h2>
            </div>
            <PieChart data={overallData} progress />
            <span className="absolute bottom-0 font-bold text-primary-light">
              {formatToCurrency(budgetData.data?.overall.spent)} /{" "}
              {formatToCurrency(budgetData.data?.overall.goal)}
            </span>
          </div>
        )}
        {chartNum === 1 && (
          <div className="flex h-full w-full items-center">
            <div className="relative flex h-40 w-full flex-col items-center justify-center pb-5">
              <BarChart
                data={barGraphData}
                keys={["amount", "goal"]}
                floatRight
              />
              <div className="absolute bottom-0 flex w-full justify-around font-bold text-primary-light">
                <span>Spending</span>
                <span>Savings</span>
              </div>
            </div>
          </div>
        )}
        <IconButton
          className={chartNum === 1 ? "invisible" : ""}
          icon={faChevronRight}
          onClick={() => setChartNum((prev) => prev + 1)}
        />
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
            <div className="flex gap-1">
              <IconButton
                icon={showSpending ? faAngleUp : faAngleDown}
                noShadow
              />
              <h3 className="w-full text-left text-xl font-bold text-primary-light">
                Spending
              </h3>
            </div>
            <span className="font-bold text-primary-light">
              {formatToCurrency(budgetData.data?.spending.total)}
            </span>
          </div>
          <div className="flex w-full flex-col gap-3">
            {showSpending &&
              budgetData.data?.spending.budgets.map((budget) => (
                <Budget key={budget.id} data={budget} />
              ))}
          </div>
          <div
            className="flex w-full items-center justify-between"
            onClick={() => setShowSavings((prev) => !prev)}
          >
            <div className="flex gap-1">
              <IconButton
                icon={showSavings ? faAngleUp : faAngleDown}
                noShadow
              />
              <h3 className="w-full text-left text-xl font-bold text-primary-light">
                Savings
              </h3>
            </div>
            <span className="font-bold text-primary-light">
              {formatToCurrency(budgetData.data?.savings.total)}
            </span>
          </div>
          <div className="flex w-full flex-col gap-3">
            {showSavings &&
              budgetData.data?.savings.budgets.map((budget) => (
                <SavingsBudget key={budget.id} data={budget} />
              ))}
          </div>
        </>
      )}
    </Page>
  );
}
