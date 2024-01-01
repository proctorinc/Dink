import { type Transaction, type TransactionSource } from "@prisma/client";
import { type FC } from "react";
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
    <div className="flex w-full flex-col gap-2 overflow-clip rounded-2xl bg-white font-bold text-black shadow-xl shadow-primary-med">
      <span className="px-6 pt-6 pb-2 text-4xl font-extrabold">
        {formatToCurrency(transaction.amount)}
      </span>
      <div className="flex flex-col gap-1 bg-primary-light px-6 pb-4 pt-2">
        <span className="font-bold text-primary-med">{transaction.name}</span>
        <span className="text-sm text-white">
          {transaction.date.toLocaleString("en-us", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
};
