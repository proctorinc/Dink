import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import AuthPage from "~/components/routes/AuthPage";
import { ProgressBar } from "~/components/ui/Charts";
import Header from "~/components/ui/Header";
import Budget, {
  BudgetSummary,
  BudgetSummarySkeleton,
  IncomeBudget,
  IncomeBudgetSkeleton,
} from "~/features/budgets";
import { CreateBudgetModal } from "~/features/budgets/components/CreateBudgetModal";
import { useMonthContext } from "~/hooks/useMonthContext";
import useNotifications from "~/hooks/useNotifications";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";

export default function Funds() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const { month, year, startOfMonth, endOfMonth } = useMonthContext();
  const budgetData = api.budgets.getDataByMonth.useQuery(
    { startOfMonth, endOfMonth },
    { onError: () => setErrorNotification("Failed to fetch budgets") }
  );
  const income = api.transactions.getIncomeByMonth.useQuery({
    startOfMonth,
    endOfMonth,
  });
  const userPreferences = api.users.getUserPreferences.useQuery();
  const targetIncome = userPreferences.data?.targetIncome;

  const { setErrorNotification } = useNotifications();

  return (
    <AuthPage>
      <Head>
        <title>Budget</title>
      </Head>
      <main className="flex h-full min-h-screen flex-col items-center text-white">
        <div className="container flex max-w-md flex-grow flex-col items-center justify-center gap-12 pt-5 sm:pb-4 lg:max-w-2xl">
          <div className="flex w-full flex-grow flex-col items-center gap-4">
            <div className="flex w-full flex-col gap-4 px-4">
              <Header title={`${month} ${year}`} />
              {/* <MonthSelector /> */}
              {!budgetData.isLoading && (
                <>
                  <BudgetSummary data={budgetData.data} />
                  {/* <IncomeBudget /> */}
                </>
              )}
              {budgetData.isLoading && (
                <>
                  <BudgetSummarySkeleton />
                </>
              )}
            </div>
            <div className="flex w-full flex-grow flex-col gap-4 rounded-t-2xl bg-gray-100 p-4 pb-20 font-bold text-black">
              <div className="grid grid-cols-1 overflow-clip rounded-xl border border-gray-300 bg-white shadow-md lg:grid-cols-2">
                {/* <div className="flex flex-col items-center gap-2 p-4 text-center">
                  <span>Uncategorized Spending</span>
                  <span className="text-danger-med">-$?,???.??</span>
                </div> */}
                <div className="flex flex-col items-center gap-2 p-4 text-center">
                  <span>Uncategorized Spending</span>
                  <span className="text-danger-med">-$?,???.??</span>
                </div>
                <div className="flex items-center gap-2 border-t border-gray-300 bg-gray-100 p-4 text-sm text-gray-600">
                  <span onClick={() => void router.push("/savings/allocate")}>
                    Categorize
                  </span>
                  <FontAwesomeIcon icon={faArrowRight} size="sm" />
                </div>
                {/* <div className="flex items-center justify-center gap-2 border-t border-gray-300 bg-gray-100 p-4 text-sm text-gray-600">
                  <span onClick={() => void router.push("/savings/allocate")}>
                    Categorize
                  </span>
                  <FontAwesomeIcon icon={faArrowRight} size="sm" />
                </div> */}
              </div>
              <h3 className="pl-2">Budgets</h3>
              <div className="grid grid-cols-1 overflow-clip rounded-xl border border-gray-300 bg-white shadow-md lg:grid-cols-2">
                {budgetData.data?.spending.budgets.map((budget) => (
                  <Budget key={budget.id} data={budget} />
                ))}
                <div className="flex items-center gap-2 bg-gray-100 p-4 text-sm text-gray-600">
                  <FontAwesomeIcon icon={faPlus} size="sm" />
                  <span onClick={() => setModalOpen(true)}>New Budget</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <CreateBudgetModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </AuthPage>
  );
}
