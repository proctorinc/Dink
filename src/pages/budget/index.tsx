import {
  faChevronLeft,
  faChevronRight,
  faPlus,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Prisma } from "@prisma/client";
import { useMonthContext } from "~/hooks/useMonthContext";
import { ButtonBar } from "~/components/ui/Button";
import Button from "~/components/ui/Button/Button";
import Header from "~/components/ui/Header";
import MonthYearSelector from "~/components/ui/MonthSelector";
import Spinner from "~/components/ui/Spinner";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";
import Budget from "~/features/budgets";
import { useRouter } from "next/router";
import { PieChart } from "~/components/ui/Charts";
import AuthPage from "~/components/routes/AuthPage";

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

  const income = api.transactions.getIncomeByMonth.useQuery({
    startOfMonth,
    endOfMonth,
  });

  const incomeBudget = {
    spent: income.data ?? new Prisma.Decimal(0),
    leftover: new Prisma.Decimal(0),
    id: "income",
    goal: new Prisma.Decimal(0),
    icon: "",
    name: "Income",
    userId: "",
    isSavings: false,
    savingsFundId: null,
    savingsFund: null,
  };

  const chartData = [
    { name: "Spent", amount: budgetData.data?.spent },
    { name: "Left", amount: budgetData.data?.leftover },
  ];

  return (
    <AuthPage>
      <Header title={`Budget`} subtitle={`${month} ${year}`} />
      <div className="flex w-full items-center justify-center">
        <div className="p-2">
          <button className="h-8 w-8 rounded-full text-primary-light hover:bg-primary-light hover:text-primary-med">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </div>
        <div className="relative flex h-52 w-full flex-col items-center justify-center pb-5">
          <div className="absolute flex flex-col items-center justify-center text-xl font-bold">
            <h2 className="text-xl font-bold">Spending</h2>
          </div>
          <PieChart data={chartData} progress />
          <span className="absolute bottom-0 font-bold text-primary-light">
            {formatToCurrency(budgetData.data?.spent)} of{" "}
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
          <Budget data={incomeBudget} />
          <h3 className="w-full text-left font-bold text-primary-light">
            Spending
          </h3>
          {budgetData.data?.budgets.spending.map((budget) => (
            <Budget key={budget.id} data={budget} />
          ))}
          <h3 className="w-full text-left font-bold text-primary-light">
            Savings
          </h3>
          {budgetData.data?.budgets.savings.map((budget) => (
            <Budget key={budget.id} data={budget} />
          ))}
        </>
      )}
    </AuthPage>
  );
}
