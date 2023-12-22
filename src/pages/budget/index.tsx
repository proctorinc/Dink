import {
  faAngleDown,
  faAngleUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import { useState } from "react";
import AuthPage from "~/components/routes/AuthPage";
import Header from "~/components/ui/Header";
import Budget, {
  BudgetSummary,
  BudgetSummarySkeleton,
  IncomeBudget,
  SavingsBudget,
  SavingsBudgetSkeletons,
  SpendingBudgetSkeletons,
} from "~/features/budgets";
import CreateBudgetDrawer from "~/features/budgets/components/CreateBudgetDrawer";
import { useMonthContext } from "~/hooks/useMonthContext";
import useNotifications from "~/hooks/useNotifications";
import { api } from "~/utils/api";

export default function Funds() {
  const [isSpendingOpen, setIsSpendingOpen] = useState(true);
  const [isBillsOpen, setIsBillsOpen] = useState(true);
  const [isSavingsOpen, setIsSavingsOpen] = useState(true);
  const [createBudgetType, setCreateBudgetType] = useState("");
  const [openBudget, setOpenBudget] = useState("");

  const { month, year, startOfMonth, endOfMonth } = useMonthContext();
  const budgetData = api.budgets.getDataByMonth.useQuery(
    { startOfMonth, endOfMonth },
    { onError: () => setErrorNotification("Failed to fetch budgets") }
  );
  const { setErrorNotification } = useNotifications();

  const handleOpenBudget = (budgetId: string) => {
    setOpenBudget((prev) => (prev === budgetId ? "" : budgetId));
  };

  return (
    <AuthPage>
      <Head>
        <title>Budget</title>
      </Head>
      <main className="flex h-full min-h-screen flex-col items-center text-white">
        <div className="container flex max-w-md flex-grow flex-col items-center justify-center gap-12 pt-5 sm:pb-4 lg:max-w-2xl">
          <div className="flex w-full flex-grow flex-col items-center gap-4">
            <div className="flex w-full flex-col gap-4 px-4">
              <Header title="Budget" subtitle={`${month} ${year}`} />
              {!budgetData.isLoading && (
                <>
                  <BudgetSummary data={budgetData.data} />
                </>
              )}
              {budgetData.isLoading && (
                <>
                  <BudgetSummarySkeleton />
                </>
              )}
            </div>
            <div className="flex w-full flex-grow flex-col gap-4 rounded-t-2xl bg-gray-100 p-4 pb-20 font-bold text-black">
              {/* <div className="grid grid-cols-1 overflow-clip rounded-xl border border-gray-300 bg-white shadow-md lg:grid-cols-2">
                <div className="flex flex-col items-center gap-2 p-4 text-center">
                  <span>Uncategorized Spending</span>
                  <span className="text-danger-med">-$?,???.??</span>
                </div>
                <div className="flex items-center justify-end gap-2 border-t border-gray-300 bg-gray-100 p-4 text-sm text-gray-600">
                  <span onClick={() => void router.push("/savings/allocate")}>
                    Categorize
                  </span>
                  <FontAwesomeIcon icon={faArrowRight} size="sm" />
                </div>
              </div> */}
              <div
                className="flex items-center justify-between px-2"
                onClick={() => setIsSpendingOpen((prev) => !prev)}
              >
                <h3>Spending</h3>
                <FontAwesomeIcon
                  icon={isSpendingOpen ? faAngleDown : faAngleUp}
                />
              </div>
              <div className="grid grid-cols-1 overflow-clip rounded-xl border border-gray-300 bg-white shadow-md lg:grid-cols-2">
                {isSpendingOpen && (
                  <>
                    <IncomeBudget
                      open={openBudget}
                      onClick={(income) => setOpenBudget(income)}
                    />
                    {!budgetData.data?.spending.budgets && (
                      <SpendingBudgetSkeletons />
                    )}
                    {budgetData.data?.spending.budgets.map((budget) => (
                      <Budget
                        key={budget.id}
                        data={budget}
                        open={openBudget}
                        onClick={(budgetId) => handleOpenBudget(budgetId)}
                      />
                    ))}
                    <div className="flex items-center justify-end gap-2 bg-gray-100 p-4 text-sm text-gray-600">
                      <FontAwesomeIcon icon={faPlus} size="sm" />
                      <span onClick={() => setCreateBudgetType("spending")}>
                        Spending Budget
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div
                className="flex items-center justify-between px-2"
                onClick={() => setIsBillsOpen((prev) => !prev)}
              >
                <h3>Bills</h3>
                <FontAwesomeIcon icon={isBillsOpen ? faAngleDown : faAngleUp} />
              </div>
              {/* <div className="grid grid-cols-1 overflow-clip rounded-xl border border-gray-300 bg-white shadow-md lg:grid-cols-2">
                {isBillsOpen && (
                  <>
                    <IncomeBudget
                      open={openBudget}
                      onClick={(income) => setOpenBudget(income)}
                    />
                    {budgetData.data?.spending.budgets.map((budget) => (
                      <Budget
                        key={budget.id}
                        data={budget}
                        open={openBudget}
                        onClick={(budgetId) => handleOpenBudget(budgetId)}
                      />
                    ))}
                    <div className="flex items-center justify-end gap-2 bg-gray-100 p-4 text-sm text-gray-600">
                      <FontAwesomeIcon icon={faPlus} size="sm" />
                      <span onClick={() => setCreateBudgetType("spending")}>
                        Spending Budget
                      </span>
                    </div>
                  </>
                )}
              </div> */}
              <div
                className="flex items-center justify-between px-2"
                onClick={() => setIsSavingsOpen((prev) => !prev)}
              >
                <h3>Monthly Savings</h3>
                <FontAwesomeIcon
                  icon={isSavingsOpen ? faAngleDown : faAngleUp}
                />
              </div>
              <div className="grid grid-cols-1 overflow-clip rounded-xl border border-gray-300 bg-white shadow-md lg:grid-cols-2">
                {isSavingsOpen && (
                  <>
                    {!budgetData.data?.savings.budgets && (
                      <SavingsBudgetSkeletons />
                    )}
                    {budgetData.data?.savings.budgets.map((budget) => (
                      <SavingsBudget key={budget.id} data={budget} />
                    ))}
                    <div className="flex items-center justify-end gap-2 bg-gray-100 p-4 text-sm text-gray-600">
                      <FontAwesomeIcon icon={faPlus} size="sm" />
                      <span onClick={() => setCreateBudgetType("savings")}>
                        Savings Budget
                      </span>
                    </div>
                  </>
                )}
                {!isSavingsOpen && <div></div>}
              </div>
            </div>
          </div>
        </div>
      </main>
      <CreateBudgetDrawer
        open={createBudgetType}
        onClose={() => setCreateBudgetType("")}
      />
    </AuthPage>
  );
}
