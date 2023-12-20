import { type FC, useState } from "react";
import { useMonthContext } from "~/hooks/useMonthContext";
import { api } from "~/utils/api";
import { DetailedTransaction } from "~/features/transactions";
import Card from "~/components/ui/Card";
import Budget from "~/features/budgets";
import Fund, { FundPickerModal } from "~/features/funds";
import Button, { IconButton } from "~/components/ui/Button";
import { type Transaction, type TransactionSource } from "@prisma/client";
import Drawer from "~/components/ui/Drawer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type CategorizeTransactionsDrawerDrawerProps = {
  open: string;
  transactions: (Transaction & {
    source:
      | (TransactionSource & {
          budget: Budget | null;
          fund: Fund | null;
        })
      | null;
  })[];
  onClose: () => void;
};

const CategorizeTransactionsDrawer: FC<
  CategorizeTransactionsDrawerDrawerProps
> = ({ open, transactions, onClose }) => {
  const [type, setType] = useState<string | null>(null);
  const [fundPickerOpen, setFundPickerOpen] = useState(false);
  const [budgetPickerOpen, setbudgetPickerOpen] = useState(false);
  const ctx = api.useContext();
  const fundsData = api.funds.getAllData.useQuery();
  const { startOfMonth, endOfMonth } = useMonthContext();
  const budgetData = api.budgets.getDataByMonth.useQuery({
    startOfMonth,
    endOfMonth,
  });
  // const uncategorizedTransactions = useMemo(() => {
  //   return transactions.filter((transaction) => transaction.source === null);
  // }, [transactions]);
  const categorizeAsBudget = api.transactions.categorizeAsBudget.useMutation({
    onSuccess: () => {
      void ctx.invalidate();
    },
  });
  const categorizeAsFund = api.transactions.categorizeAsFund.useMutation({
    onSuccess: () => {
      void ctx.invalidate();
    },
  });
  const categorizeAsIncome = api.transactions.categorizeAsIncome.useMutation({
    onSuccess: () => {
      void ctx.invalidate();
    },
  });

  // const current = uncategorizedTransactions
  //   ? uncategorizedTransactions[0]
  //   : null;

  const current = transactions[0];

  const selectById = (sourceId: string) => {
    if (type === "fund") {
      categorizeAsFund.mutate({
        transactionId: current?.id ?? "",
        fundId: sourceId,
      });
    } else if (type === "budget") {
      categorizeAsBudget.mutate({
        transactionId: current?.id ?? "",
        budgetId: sourceId,
      });
    }
    setType(null);
  };

  const selectIncome = () => {
    categorizeAsIncome.mutate({ id: current?.id ?? "" });
  };

  return (
    <Drawer title="Categorize Transactions" open={!!open} onClose={onClose}>
      <span>Categorize Transactions</span>
      {/* <div className="grid w-full grid-cols-2 gap-2 text-sm">
        <div
          className={`flex items-center justify-center gap-2 rounded-xl border border-gray-300 p-2 ${
            type === "budget" ? "bg-gray-100" : "bg-white"
          }`}
          onClick={() => setBudgetType("budget")}
        >
          <h3>Spending</h3>
        </div>
        <div
          className={`flex items-center justify-center gap-2 rounded-xl border border-gray-300 p-2 ${
            budgetType === "savings" ? "bg-gray-100" : "bg-white"
          }`}
          onClick={() => setBudgetType("savings")}
        >
          <h3>Savings</h3>
        </div>
      </div>
      <form onSubmit={handleCreateBudget}>
        {type === "savings" && (
          <>
            <div className="flex flex-col gap-2 text-left">
              <label className="px-2" htmlFor="amount">
                Fund:
              </label>
              {fund && (
                <FundBrief
                  data={fund}
                  className="rounded-xl border border-gray-300 bg-gray-100 shadow-md"
                  onClick={() => setFundModalOpen(true)}
                />
              )}
              {!fund && (
                <Button
                  title="Select Fund"
                  style="secondary"
                  icon={faPlus}
                  onClick={() => setFundModalOpen(true)}
                />
              )}
            </div>
          </>
        )}
        {type === "budget" && (
          <>
            <div className="flex flex-col gap-2 text-left">
              <label className="px-2" htmlFor="fund-name">
                Name:
              </label>
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-2">
                  <button className="h-14 w-14 rounded-xl border border-secondary-dark bg-secondary-dark shadow-md">
                    <FontAwesomeIcon
                      className="text-secondary-med"
                      size="xl"
                      icon={convertToIcon(icon) ?? faPlusCircle}
                      onClick={() => setIconModalOpen(true)}
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="px-2" htmlFor="amount">
                  Amount:
                </label>
              </div>
            </div>
          </>
        )}
        <div className="mt-5 flex w-full justify-center">
          <Button
            style="secondary"
            type="submit"
            title="Create"
            className="w-full"
            disabled={!isValidSavingsData && !isValidSpendingData}
          />
        </div>
      </form>
      <FundPickerModal
        open={fundPickerOpen}
        onSelect={(iconName) => {
          setIcon(iconName);
          setIconModalOpen(false);
        }}
        onClose={() => setIconModalOpen(false)}
      />
      <Budget
        open={budgetPickerOpen}
        onSelect={(fund) => setFund(fund)}
        onClose={() => setFundModalOpen(false)}
      /> */}
    </Drawer>
  );
};

export default CategorizeTransactionsDrawer;
