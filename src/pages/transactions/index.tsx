import { faMagnifyingGlass, faTags } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useMonthContext } from "~/components/hooks/useMonthContext";
import Transaction from "~/components/transactions/Transaction";
import Header from "~/components/ui/Header";
import MonthYearSelector from "~/components/ui/MonthSelector";
import Spinner from "~/components/ui/Spinner";
import { api } from "~/utils/api";

const TransactionsPage = () => {
  const router = useRouter();
  const { month, year, startOfMonth, endOfMonth } = useMonthContext();
  const transactionData = api.transactions.getByMonth.useQuery({
    startOfMonth,
    endOfMonth,
  });

  return (
    <>
      <Header title="Transactions" subtitle={`${month} ${year}`} />
      <div className="flex w-full gap-2">
        <button className="flex h-10 items-center gap-2 rounded-lg bg-primary-med py-2 px-5 font-bold text-primary-light hover:bg-primary-light hover:text-primary-med hover:ring hover:ring-primary-med group-hover:text-primary-light">
          <FontAwesomeIcon size="sm" icon={faMagnifyingGlass} />
          <span>Search</span>
        </button>
        <button
          className="flex h-fit items-center gap-2 rounded-lg bg-secondary-med py-2 px-5 font-bold text-secondary-dark hover:bg-secondary-light hover:text-secondary-med hover:ring hover:ring-secondary-med group-hover:text-secondary-light"
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
        {transactionData.isLoading && <Spinner />}
        {transactionData.data &&
          transactionData.data.map((transaction) => (
            <Transaction key={transaction.id} data={transaction} />
          ))}
      </div>
    </>
  );
};

export default TransactionsPage;
