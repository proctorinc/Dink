import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import BackHeader from "~/components/ui/BackHeader";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";

const CategorizePage = () => {
  const [type, setType] = useState<string | null>(null);
  const ctx = api.useContext();
  const fundsData = api.funds.getAllData.useQuery();
  const budgetData = api.budgets.getAllData.useQuery();
  const uncategorizedTransactions =
    api.transactions.getUncategorized.useQuery();
  const categorizeTransaction =
    api.transactions.categorizeTransaction.useMutation({
      onSuccess: () => ctx.invalidate(),
    });

  const current = uncategorizedTransactions?.data
    ? uncategorizedTransactions?.data[0]
    : null;

  const selectById = (sourceId: string) => {
    categorizeTransaction.mutate({
      id: current?.id ?? "",
      type,
      sourceId,
    });
    setType(null);
  };

  return (
    <>
      <BackHeader title="Categorize Transactions" />

      {/* Chart block component */}
      <div className="flex h-40 w-full flex-col items-center justify-center rounded-xl bg-gradient-to-t from-secondary-dark to-secondary-med p-4 text-secondary-light">
        {!!uncategorizedTransactions.data && (
          <>
            <span className="text-xl font-bold">{current?.name}</span>
            <span>
              {formatToCurrency(uncategorizedTransactions.data[0]?.amount)}
            </span>
            <span>
              {current?.date.toLocaleString("en-us", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>Account: {current?.account ? current?.name : ""}</span>
          </>
        )}
      </div>

      {!type && (
        <div className="flex w-full flex-col gap-2">
          <h2 className="text-left text-xl text-primary-light">
            Choose a category:
          </h2>
          <div
            className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-primary-med px-4 py-2 text-center hover:bg-primary-light hover:text-primary-dark"
            onClick={() => setType("fund")}
          >
            <span className="text-xl font-bold">Fund</span>
          </div>
          <div
            className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-primary-med px-4 py-2 text-center hover:bg-primary-light hover:text-primary-dark"
            onClick={() => setType("budget")}
          >
            <span className="text-xl font-bold">Budget</span>
          </div>
        </div>
      )}
      {!!type && (
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-left text-xl text-primary-light">
              Choose a {type}:
            </h2>
            <button
              className="flex h-fit items-center justify-center gap-2 rounded-lg bg-secondary-med px-2 py-1 text-xs font-bold text-secondary-dark"
              onClick={() => setType(null)}
            >
              <FontAwesomeIcon icon={faRedo} />
              Back
            </button>
          </div>
          {type === "budget" &&
            budgetData?.data?.budgets.map((budget) => (
              <div
                key={budget.id}
                className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-primary-med px-4 py-2 text-center hover:bg-primary-light hover:text-primary-dark"
                onClick={() => selectById(budget.id)}
              >
                <span className="text-xl font-bold">{budget.name}</span>
              </div>
            ))}
          {type === "fund" &&
            fundsData?.data?.funds.map((fund) => (
              <div
                key={fund.id}
                className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-primary-med px-4 py-2 text-center hover:bg-primary-light hover:text-primary-dark"
                onClick={() => selectById(fund.id)}
              >
                <span className="text-xl font-bold">{fund.name}</span>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default CategorizePage;
