import { type Transaction } from "@prisma/client";
import { type FC } from "react";
import { formatToCurrency } from "~/utils";

type NoSourceTransactionProps = {
  data: Transaction;
};

export const NoSourceTransaction: FC<NoSourceTransactionProps> = ({
  data: transaction,
}) => {
  return (
    <div
      key={transaction?.id}
      className="group flex w-full cursor-pointer items-center rounded-xl bg-primary-med px-4 py-2 hover:bg-primary-light hover:text-primary-dark"
    >
      <div className="flex w-full justify-between">
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
      </div>
    </div>
  );
};
