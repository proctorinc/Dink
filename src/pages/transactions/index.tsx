import {
  faMagnifyingGlass,
  faSpinner,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import Header from "~/components/ui/Header";
import MonthYearSelector from "~/components/ui/MonthYearSelector";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";

const TransactionsPage = () => {
  const router = useRouter();
  const transactionData = api.transactions.getAll.useQuery();

  return (
    <>
      <Header title="Transactions" />
      {/* <div className="flex gap-2">
        <div className="h-32 w-32 rounded-xl bg-primary-med p-4">20</div>
        <div className="h-32 w-32 rounded-xl bg-primary-med p-4">50%</div>
      </div> */}
      <div className="flex w-full gap-2">
        <button className="flex h-fit items-center gap-1 rounded-lg bg-secondary-med py-2 px-5 font-bold text-secondary-dark hover:bg-secondary-light hover:text-secondary-med hover:ring hover:ring-secondary-med group-hover:text-secondary-light">
          <FontAwesomeIcon size="sm" icon={faMagnifyingGlass} />
          <span>Search</span>
        </button>
        <button
          className="flex h-fit items-center gap-1 rounded-lg bg-secondary-med py-2 px-5 font-bold text-secondary-dark hover:bg-secondary-light hover:text-secondary-med hover:ring hover:ring-secondary-med group-hover:text-secondary-light"
          onClick={() => {
            void router.push("/transactions/categorize");
          }}
        >
          <FontAwesomeIcon size="sm" icon={faTags} />
          <span>Categorize</span>
        </button>
      </div>
      <MonthYearSelector />
      <div className="flex w-full flex-col gap-3">
        {transactionData.isLoading && (
          <div className="flex w-full justify-center">
            <FontAwesomeIcon
              className="animate-spin text-primary-light"
              size="2xl"
              icon={faSpinner}
            />
          </div>
        )}
        {transactionData.data &&
          transactionData.data.map((transaction) => {
            return (
              <div
                key={transaction.id}
                className="group flex w-full cursor-pointer items-center justify-between rounded-xl bg-primary-med px-4 py-2 hover:bg-primary-light hover:text-primary-dark"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-bold">{transaction.name}</span>
                  <span className="text-xs text-primary-light group-hover:text-primary-med">
                    {transaction.sourceType
                      ? transaction.sourceType
                      : "Uncategorized"}
                    {transaction.sourceType === "fund" &&
                      ` / ${transaction.fundSource?.name ?? ""}`}
                    {transaction.sourceType === "budget" &&
                      ` / ${transaction.budgetSource?.name ?? ""}`}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-lg font-bold text-primary-light group-hover:text-primary-med">
                    {formatToCurrency(transaction.amount)}
                  </span>
                  <span className="text-xs text-primary-light group-hover:text-primary-med">
                    {transaction.date.toLocaleString("en-us", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default TransactionsPage;
