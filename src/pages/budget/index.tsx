import {
  faAngleDown,
  faAngleUp,
  faBackward,
  faPlus,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";
import { useMonthContext } from "~/hooks/useMonthContext";
import { ButtonBar, IconButton } from "~/components/ui/Button";
import Button from "~/components/ui/Button/Button";
import Header from "~/components/ui/Header";
import MonthYearSelector from "~/components/ui/MonthSelector";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";
import Budget, {
  SavingsBudget,
  IncomeBudget,
  BudgetSkeletons,
  BudgetCharts,
} from "~/features/budgets";
import Page from "~/components/ui/Page";
import { useState } from "react";
import useNotifications from "~/hooks/useNotifications";
import { CreateBudgetModal } from "~/features/budgets/components/CreateBudgetModal";

export default function Budgets() {
  const {
    month,
    year,
    setCurrentMonth,
    startOfMonth,
    endOfMonth,
    isCurrentMonth,
  } = useMonthContext();
  const budgetData = api.budgets.getDataByMonth.useQuery(
    { startOfMonth, endOfMonth },
    { onError: () => setErrorNotification("Failed to fetch budgets") }
  );
  const [showSavings, setShowSavings] = useState(true);
  const [showSpending, setShowSpending] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { setErrorNotification } = useNotifications();

  const currentMonth = new Date().toLocaleString("en-us", {
    month: "long",
  });

  return (
    <>
      <Page auth title="Budget">
        <Header title={`Budget`} subtitle={`${month} ${year}`} />
        <div className="grid w-full grid-flow-row grid-cols-1 gap-4 lg:grid-cols-2">
          <BudgetCharts data={budgetData.data} />
          <div className="flex flex-col gap-4 lg:order-first">
            <ButtonBar>
              {isCurrentMonth && (
                <Button
                  title="Budget"
                  icon={faPlus}
                  style="secondary"
                  onClick={() => setModalOpen(true)}
                />
              )}
              {!isCurrentMonth && (
                <Button
                  title={currentMonth}
                  icon={faBackward}
                  onClick={setCurrentMonth}
                  style="secondary"
                />
              )}
            </ButtonBar>
            <MonthYearSelector />
            <IncomeBudget />
          </div>
        </div>
        {!budgetData.data && <BudgetSkeletons />}
        {budgetData.data && (
          <>
            <div
              className="flex w-full items-center justify-between"
              onClick={() => setShowSpending((prev) => !prev)}
            >
              <div className="flex w-full items-center gap-1">
                <IconButton
                  icon={showSpending ? faAngleUp : faAngleDown}
                  noShadow
                />
                <h3 className="text-left text-xl font-bold text-primary-light">
                  Spending
                </h3>
              </div>
              <span className="font-bold text-primary-light">
                {formatToCurrency(budgetData.data?.spending.total)}
              </span>
            </div>
            <div className="grid w-full grid-flow-row grid-cols-1 gap-3 lg:grid-cols-2">
              {showSpending &&
                budgetData.data?.spending.budgets.map((budget) => (
                  <Budget key={budget.id} data={budget} />
                ))}
            </div>
            <div
              className="flex w-full items-center justify-between"
              onClick={() => setShowSavings((prev) => !prev)}
            >
              <div className="flex items-center gap-1">
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
            <div className="grid w-full grid-flow-row grid-cols-1 gap-3 lg:grid-cols-2">
              {showSavings &&
                budgetData.data?.savings.budgets.map((budget) => (
                  <SavingsBudget key={budget.id} data={budget} />
                ))}
            </div>
          </>
        )}
      </Page>
      <CreateBudgetModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
