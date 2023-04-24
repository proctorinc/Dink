import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import {
  type Budget,
  type Fund,
  Transaction,
  type TransactionSource,
} from "@prisma/client";
import { useRouter } from "next/router";
import { type FC } from "react";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import Card from "~/components/ui/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type TransactionProps = {
  data: Transaction & {
    source:
      | (TransactionSource & {
          budget?: Budget | null;
          fund?: Fund | null;
        })
      | null;
  };
};

const Transaction: FC<TransactionProps> = ({ data: transaction }) => {
  const router = useRouter();
  const handleOnClick = () => {
    if (!transaction?.source?.type) {
      void router.push("/transactions/categorize");
    }
  };

  return (
    <Card key={transaction.id} onClick={handleOnClick}>
      <Card.Body horizontal size="sm">
        <Card.Group size="sm">
          <span className="font-bold">{transaction.name}</span>
          <div className="flex items-center gap-1 text-sm text-primary-light group-hover:text-primary-med">
            <span className="">
              {transaction?.source?.type
                ? formatToTitleCase(transaction.source.type)
                : "Uncategorized"}
            </span>
            {(transaction?.source?.type === "budget" ||
              transaction?.source?.type === "fund" ||
              transaction?.source?.type === "savings") && (
              <>
                <FontAwesomeIcon icon={faAngleRight} size="xs" />
                <span>
                  {transaction?.source.type === "budget"
                    ? transaction?.source?.budget?.name
                    : transaction?.source?.fund?.name}
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
            {transaction.date.toLocaleString("en-us", {
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
