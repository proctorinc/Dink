import { useRouter } from "next/router";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { api } from "~/utils/api";

const UncategorizedTransactionsSummary = () => {
  const router = useRouter();
  const uncategorizedTransactions =
    api.transactions.getUncategorized.useQuery();

  return (
    <div
      className="group flex w-full cursor-pointer items-center justify-between rounded-xl bg-primary-med p-4 hover:bg-primary-light hover:text-primary-dark"
      onClick={() => void router.push("/transactions/categorize")}
    >
      <div className="flex flex-col">
        <h3 className="text-xl font-bold">Transactions</h3>
        <span className="text-sm text-primary-light group-hover:text-primary-med">
          {uncategorizedTransactions?.data?.length ?? ""} uncategorized
        </span>
      </div>
      <button className="flex h-fit items-center gap-2 rounded-lg bg-secondary-med py-2 px-5 font-bold text-secondary-dark group-hover:bg-secondary-light group-hover:text-secondary-med group-hover:text-secondary-light group-hover:ring group-hover:ring-secondary-med">
        <span>Categorize</span>
        <FontAwesomeIcon className="h-4 w-4" icon={faArrowRight} />
      </button>
    </div>
  );
};

export default UncategorizedTransactionsSummary;
