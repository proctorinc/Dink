import {
  faMagnifyingGlass,
  faSpinner,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import Transaction from "~/components/transactions/Transaction";
import Header from "~/components/ui/Header";
import MonthYearSelector from "~/components/ui/MonthYearSelector";
import { api } from "~/utils/api";

const TransactionsPage = () => {
  const router = useRouter();
  const transactionData = api.transactions.getAll.useQuery();

  return (
    <>
      <Header title="Transactions" />
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
          transactionData.data.map((transaction) => (
            <Transaction key={transaction.id} data={transaction} />
          ))}
      </div>
    </>
  );
};

export default TransactionsPage;
