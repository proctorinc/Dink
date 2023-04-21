import { type Transaction } from "@prisma/client";
import { type FC } from "react";
import Card from "~/components/ui/Card";
import { formatToCurrency } from "~/utils";

type NoSourceTransactionProps = {
  data: Transaction;
};

export const NoSourceTransaction: FC<NoSourceTransactionProps> = ({
  data: transaction,
}) => {
  return (
    <Card key={transaction?.id} size="sm">
      <Card.Body horizontal>
        <div className="flex flex-col">
          <span className="text-md font-bold">{transaction?.name}</span>
          <span className="text-sm text-primary-light group-hover:text-primary-med">
            {transaction?.date?.toLocaleString("en-us", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex flex-col justify-center text-right">
          <span className="font-bold text-primary-light group-hover:text-primary-med">
            {formatToCurrency(transaction?.amount)}
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};
