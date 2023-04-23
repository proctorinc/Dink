import {
  type BankAccount,
  type TransactionCategory,
  type TransactionLocation,
  type TransactionPaymentMetadata,
  type TransactionPersonalFinanceCategory,
  type Transaction,
} from "@prisma/client";
import { type FC } from "react";
import Card from "~/components/ui/Card";
import { formatToCurrency } from "~/utils";

type DetailedTransactionProps = {
  data: Transaction & {
    personalFinanceCategory: TransactionPersonalFinanceCategory | null;
    paymentMetadata: TransactionPaymentMetadata | null;
    location: TransactionLocation | null;
    category: TransactionCategory[];
    account: BankAccount | null;
  };
};

export const DetailedTransaction: FC<DetailedTransactionProps> = ({
  data: transaction,
}) => {
  return (
    <Card key={transaction?.id} size="sm">
      <Card.Body horizontal>
        <div className="flex flex-col">
          <span className="text-xl font-bold">{transaction?.name}</span>
          <span className="text-sm text-primary-light group-hover:text-primary-med">
            {transaction?.merchantName} / {transaction?.paymentChannel}
          </span>
        </div>
        <div className="flex flex-col justify-center text-right">
          <span className="font-bold group-hover:text-primary-med">
            {formatToCurrency(transaction?.amount)}
          </span>
          <span className="text-primary-light group-hover:text-primary-med">
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
