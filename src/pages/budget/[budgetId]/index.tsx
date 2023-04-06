import { useRouter } from "next/router";
import { useMonthContext } from "~/hooks/useMonthContext";
import { NoSourceTransaction } from "~/features/transactions";
import Header from "~/components/ui/Header";
import MonthYearSelector from "~/components/ui/MonthSelector";
import Spinner from "~/components/ui/Spinner";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";
import { PieChart } from "~/components/ui/Charts";
import {
  faAngleUp,
  faGear,
  faMoneyBill1,
} from "@fortawesome/free-solid-svg-icons";
import useIcons from "~/hooks/useIcons";
import Button, { ButtonBar } from "~/components/ui/Button";
import { useState } from "react";
import ConfirmDelete from "~/components/ui/ConfirmDelete";

const BudgetPage = () => {
  const router = useRouter();
  const { budgetId } = router.query;
  const ctx = api.useContext();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { convertToIcon } = useIcons();
  const { month, year, startOfMonth, endOfMonth } = useMonthContext();

  const strbudgetId = typeof budgetId === "string" ? budgetId : null;
  const budgetData = api.budgets.getById.useQuery(
    {
      startOfMonth,
      endOfMonth,
      budgetId: strbudgetId ?? "",
    },
    {
      enabled: !!budgetId,
    }
  );
  const deleteBudget = api.budgets.delete.useMutation({
    onSuccess: () => void ctx.invalidate(),
  });
  const icon = convertToIcon(budgetData.data?.icon) ?? faMoneyBill1;
  const chartData = [
    { name: "Spent", amount: budgetData.data?.spent },
    { name: "Left", amount: budgetData.data?.leftover },
  ];

  const handleDeleteBudget = () => {
    deleteBudget.mutate({ budgetId: budgetData?.data?.id ?? "" });
    void router.push("/budget");
  };

  if (budgetData.isLoading) {
    return <Spinner />;
  }

  if (!budgetData.data) {
    <div>Not Found</div>;
  }

  return (
    <>
      <Header
        back
        title={budgetData?.data?.name}
        subtitle={`${month} ${year}`}
        icon={icon}
      />
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
      <ButtonBar>
        <Button
          icon={settingsOpen ? faAngleUp : faGear}
          onClick={() => setSettingsOpen((prev) => !prev)}
        />
      </ButtonBar>
      {settingsOpen && (
        <ButtonBar>
          <ConfirmDelete
            confirmationText={budgetData?.data?.name ?? "delete budget"}
            onDelete={handleDeleteBudget}
          />
        </ButtonBar>
      )}
      <MonthYearSelector />
      <div className="w-full">
        <h2 className="text-left text-xl text-primary-light">Transactions</h2>
      </div>
      {!budgetData?.data?.source_transactions?.length && (
        <div className="group flex w-full items-center justify-between rounded-xl bg-primary-med px-4 py-2">
          None
        </div>
      )}
      <div className="flex w-full flex-col gap-3">
        {budgetData.data &&
          budgetData.data.source_transactions.map((transaction) => (
            <NoSourceTransaction key={transaction.id} data={transaction} />
          ))}
      </div>
    </>
  );
};

export default BudgetPage;
