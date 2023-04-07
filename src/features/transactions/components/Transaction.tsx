import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { type Budget, type Fund, Transaction } from "@prisma/client";
import { useRouter } from "next/router";
import { type FC } from "react";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import { IconButton } from "~/components/ui/Button";
import Card from "~/components/ui/Card";

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
    <Card size="sm" key={transaction.id} onClick={handleOnClick}>
      <Card.Body horizontal size="sm">
        <Card.Group horizontal>
          {transaction.sourceType === null && (
            <IconButton
              size="sm"
              style="secondary"
              icon={faTriangleExclamation}
            />
          )}
          <Card.Group size="sm">
            <span className="overflow-x-hidden text-ellipsis text-lg font-bold">
              {transaction.name}
            </span>
            <span className="text-sm text-primary-light group-hover:text-primary-med">
              {transaction.sourceType
                ? formatToTitleCase(transaction.sourceType)
                : "Uncategorized"}
              {(transaction.sourceType === "fund" ||
                transaction.sourceType === "savings") &&
                ` / ${transaction.fundSource?.name ?? ""}`}
              {transaction.sourceType === "budget" &&
                ` / ${transaction.budgetSource?.name ?? ""}`}
            </span>
          </Card.Group>
        </Card.Group>
        <Card.Group size="sm" className="text-right">
          <span className="text-lg font-bold group-hover:text-primary-med">
            {formatToCurrency(transaction.amount)}
          </span>
          <span className="text-sm text-primary-light group-hover:text-primary-med">
            {transaction?.isSavings &&
              transaction?.date.toLocaleString("en-us", {
                month: "long",
              })}
            {!transaction.isSavings &&
              transaction.date.toLocaleString("en-us", {
                month: "short",
                day: "numeric",
              })}
          </span>
        </Card.Group>
      </Card.Body>
    </Card>
  );
};

export default Transaction;
