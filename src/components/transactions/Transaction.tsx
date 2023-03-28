import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Budget, type Fund, Transaction } from "@prisma/client";
import { useRouter } from "next/router";
import { type FC } from "react";
import { formatToCurrency } from "~/utils";

type TransactionProps = {
  data: Transaction & {
    fundSource: Fund | null;
    budgetSource: Budget | null;
  };
};

const Transaction: FC<TransactionProps> = ({ data: transaction }) => {
  const router = useRouter();
  const handleOnClick = () => {
    if (!transaction.sourceType) {
      void router.push("/transactions/categorize");
    }
  };

  return (
    <div
      key={transaction.id}
      className="group flex w-full cursor-pointer items-center rounded-xl bg-primary-med px-4 py-2 hover:bg-primary-light hover:text-primary-dark"
      onClick={handleOnClick}
    >
      <div className="flex w-full justify-between">
        <div className="flex flex-col">
          <span className="text-lg font-bold">{transaction.name}</span>
          <span className="text-sm text-primary-light group-hover:text-primary-med">
            {transaction.sourceType ? transaction.sourceType : "Uncategorized"}
            {transaction.sourceType === "fund" &&
              ` / ${transaction.fundSource?.name ?? ""}`}
            {transaction.sourceType === "budget" &&
              ` / ${transaction.budgetSource?.name ?? ""}`}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-lg font-bold group-hover:text-primary-med">
            {formatToCurrency(transaction.amount)}
          </span>
          <span className="text-sm text-primary-light group-hover:text-primary-med">
            {transaction.date.toLocaleString("en-us", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
      {!transaction.sourceType && (
        <div className="pl-3">
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-secondary-med group-hover:bg-secondary-med">
            <FontAwesomeIcon
              className="text-secondary-light group-hover:text-secondary-light"
              size="lg"
              icon={faTriangleExclamation}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Transaction;
