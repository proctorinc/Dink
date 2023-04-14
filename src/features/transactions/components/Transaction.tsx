import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { type Budget, type Fund, Transaction } from "@prisma/client";
import { useRouter } from "next/router";
import { type FC } from "react";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import Card from "~/components/ui/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        <Card.Group size="sm">
          <span className="font-bold">{transaction.name}</span>
          <div className="flex items-center gap-1 text-sm text-primary-light group-hover:text-primary-med">
            <span className="">
              {transaction.sourceType
                ? formatToTitleCase(transaction.sourceType)
                : "Uncategorized"}
            </span>
            {(transaction.sourceType === "budget" ||
              transaction.sourceType === "fund" ||
              transaction.sourceType === "savings") && (
              <>
                <FontAwesomeIcon icon={faAngleRight} size="xs" />
                <span>
                  {transaction.sourceType === "budget"
                    ? transaction.budgetSource?.name
                    : transaction.fundSource?.name}
                </span>
              </>
            )}
          </div>
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
