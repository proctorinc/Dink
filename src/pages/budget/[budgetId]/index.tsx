import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import NoSourceTransaction from "~/components/transactions/NoSourceTransaction";
import Header from "~/components/ui/Header";
import { formatToCurrency, formatToPercentage } from "~/utils";
import { api } from "~/utils/api";

const BudgetPage = () => {
  const router = useRouter();
  const { budgetId } = router.query;
  const strbudgetId = typeof budgetId === "string" ? budgetId : null;
  const budgetData = api.budgets.getById.useQuery(
    {
      budgetId: strbudgetId ?? "",
    },
    {
      enabled: !!budgetId,
    }
  );
  const percentSpent = formatToPercentage(
    budgetData?.data?.spent,
    budgetData?.data?.goal
  );

  if (budgetData.isLoading) {
    return (
      <div className="flex w-full justify-center">
        <FontAwesomeIcon
          className="animate-spin text-primary-light"
          size="2xl"
          icon={faSpinner}
        />
      </div>
    );
  }

  if (!budgetData.data) {
    <div>Not Found</div>;
  }

  return (
    <>
      <Header back title={budgetData?.data?.name} />
      <div
        className="group flex w-full flex-col justify-between gap-1 rounded-xl bg-primary-med p-4 hover:bg-primary-light hover:text-primary-dark"
        onClick={() =>
          void router.push(`/budget/${budgetData?.data?.id ?? ""}`)
        }
      >
        <div className="relative h-6 w-full rounded-md bg-primary-dark group-hover:bg-primary-med">
          <div
            className="absolute h-full rounded-md bg-gradient-to-r from-secondary-dark to-secondary-med"
            style={{ width: percentSpent }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-primary-light group-hover:text-primary-med">
          <span>
            {formatToCurrency(budgetData?.data?.spent)} /{" "}
            {formatToCurrency(budgetData?.data?.goal)}
          </span>
          <span>{formatToCurrency(budgetData?.data?.leftover)} left</span>
        </div>
      </div>
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
