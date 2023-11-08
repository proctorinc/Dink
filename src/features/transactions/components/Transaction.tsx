import {
  faAngleRight,
  faCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  type Budget,
  type Fund,
  Transaction,
  type TransactionSource,
} from "@prisma/client";
import { useRouter } from "next/router";
import { type FC } from "react";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "~/components/ui/Button";
import useIcons from "~/hooks/useIcons";

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
  const { convertToIcon } = useIcons();
  const handleOnClick = () => {
    if (!transaction?.source?.type) {
      void router.push("/transactions/categorize");
    }
  };

  const icon = faExclamationCircle;

  // console.log(
  //   transaction?.source.type === "budget"
  //     ? transaction?.source?.budget?.name
  //     : transaction?.source?.fund?.name
  // );

  // console.log(
  //   transaction?.source.type === "budget"
  //     ? transaction?.source?.budget?.icon
  //     : transaction?.source?.fund?.icon
  // );

  if (transaction?.source?.budget?.icon !== undefined) {
    convertToIcon(transaction.source.budget.icon);
  } else if (transaction?.source?.fund?.icon !== undefined) {
    convertToIcon(transaction.source.fund.icon);
  }

  return (
    <div
      className="border-b border-gray-300 p-4"
      key={transaction.id}
      onClick={handleOnClick}
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <IconButton icon={icon} size="sm" style="secondary" />
          <div className="flex flex-col gap-1">
            <span className="font-bold">{transaction.name}</span>
            <div className="flex items-center gap-1 text-sm text-gray-500 group-hover:text-primary-med">
              <span>
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
          </div>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="group-hover:text-primary-med">
            {formatToCurrency(transaction.amount)}
          </span>
          <span className="text-sm text-gray-500 group-hover:text-primary-med">
            {transaction.date.toLocaleString("en-us", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
