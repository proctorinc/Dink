import { type Transaction, type TransactionSource } from "@prisma/client";
import { type FC } from "react";
import Card from "~/components/ui/Card";
import { formatToCurrency } from "~/utils";

type DetailedTransactionProps = {
  data: Transaction & {
    source: TransactionSource | null;
  };
};

export const DetailedTransaction: FC<DetailedTransactionProps> = ({
  data: transaction,
}) => {
  return (
    <Card
      key={transaction?.id}
      size="sm"
      className="bg-secondary-med text-secondary-light"
    >
      <Card.Body horizontal>
        <div className="flex flex-col">
          <span className="text-xl font-bold">{transaction?.name}</span>
          <span className="text-sm font-bold text-secondary-dark group-hover:text-primary-med">
            {transaction?.merchantName} / {transaction?.paymentChannel}
          </span>
        </div>
        <div className="flex flex-col justify-center text-right">
          <span className="font-bold group-hover:text-primary-med">
            {formatToCurrency(transaction?.amount)}
          </span>
          <span className="text-sm font-bold text-secondary-dark group-hover:text-primary-med">
            {transaction?.date?.toLocaleString("en-us", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};
