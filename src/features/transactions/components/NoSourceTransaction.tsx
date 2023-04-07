import { type BankAccount, type Transaction } from "@prisma/client";
import { useRouter } from "next/router";
import { type FC } from "react";
import { formatToCurrency } from "~/utils";

type NoSourceTransactionProps = {
  data:
    | Transaction
    | (Transaction & { account: BankAccount | null })
    | undefined;
};

export const NoSourceTransaction: FC<NoSourceTransactionProps> = ({
  data: transaction,
}) => {
  const router = useRouter();
  const handleOnClick = () => {
    if (!transaction?.sourceType) {
      void router.push("/transactions/categorize");
    }
  };

  return (
    <div
      key={transaction?.id}
      className="group flex w-full cursor-pointer items-center rounded-xl bg-primary-med px-4 py-2 hover:bg-primary-light hover:text-primary-dark"
      onClick={handleOnClick}
    >
      <div className="flex w-full justify-between">
        <div className="flex flex-col">
          <span className="text-lg font-bold">{transaction?.name}</span>
          <span className="text-sm text-primary-light group-hover:text-primary-med">
            {transaction?.isSavings &&
              transaction?.date.toLocaleString("en-us", {
                month: "long",
                year: "numeric",
              })}
            {!transaction?.isSavings &&
              transaction?.date.toLocaleString("en-us", {
                month: "short",
                day: "numeric",
              })}
          </span>
        </div>
        <div className="flex flex-col justify-center text-right">
          <span className="text-xl font-bold text-primary-light group-hover:text-primary-med">
            {formatToCurrency(transaction?.amount)}
          </span>
        </div>
      </div>
    </div>
  );
};
