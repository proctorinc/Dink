import Header from "~/components/ui/Header";
import MonthYearSelector from "~/components/ui/MonthYearSelector";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";

const TransactionsPage = () => {
  const transactionData = api.transactions.getAll.useQuery();

  return (
    <>
      <Header title="Transactions" subtitle="???" />
      <div className="flex w-full items-center gap-2">
        <button
          disabled
          className="flex h-fit items-center gap-2 rounded-lg bg-secondary-med py-2 px-5 font-bold text-secondary-dark group-hover:text-secondary-light"
        >
          <span>All</span>
        </button>
        <button
          disabled
          className="flex h-fit items-center gap-2 rounded-lg bg-secondary-med py-2 px-5 font-bold text-secondary-dark group-hover:text-secondary-light"
        >
          <span>Uncategorized</span>
        </button>
        <button
          disabled
          className="flex h-fit items-center gap-2 rounded-lg bg-secondary-med py-2 px-5 font-bold text-secondary-dark group-hover:text-secondary-light"
        >
          <span>Categorized</span>
        </button>
      </div>
      <MonthYearSelector />
      {transactionData.data &&
        transactionData.data.map((transaction) => {
          return (
            <div
              key={transaction.id}
              className="group flex w-full cursor-pointer items-center justify-between rounded-xl bg-primary-med p-4 hover:bg-primary-light hover:text-primary-dark"
            >
              <span>{transaction.name}</span>
              <span>{formatToCurrency(transaction.amount)}</span>
              <span>{transaction.date.toLocaleDateString()}</span>
            </div>
          );
        })}
    </>
  );
};

export default TransactionsPage;
