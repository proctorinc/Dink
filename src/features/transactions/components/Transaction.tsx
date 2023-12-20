import {
  faAngleRight,
  faClone,
  faExclamationCircle,
  faNoteSticky,
  faPencil,
  faSitemap,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import {
  type Budget,
  type Fund,
  Transaction,
  type TransactionSource,
} from "@prisma/client";
import { type FC } from "react";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  open: string;
  onClick: (transactionId: string) => void;
};

const Transaction: FC<TransactionProps> = ({
  data: transaction,
  open,
  onClick,
}) => {
  const { convertToIcon, convertToColor } = useIcons();

  let icon: null | undefined | IconDefinition = faExclamationCircle;
  let color = convertToColor("gray");

  if (transaction?.source?.budget?.icon !== undefined) {
    icon = convertToIcon(transaction.source.budget.icon);
    color = convertToColor(transaction.source.budget.color);
    console.log(transaction.source.budget.icon);
  } else if (transaction?.source?.fund?.icon !== undefined) {
    icon = convertToIcon(transaction.source.fund.icon);
    color = convertToColor(transaction.source.fund.color);
    console.log(transaction.source.fund.icon);
  }

  return (
    <>
      <div
        key={transaction.id}
        className={
          open === transaction.id
            ? "bg-gray-100 p-4"
            : "border-b border-gray-300 p-4"
        }
        onClick={() => onClick(transaction.id)}
      >
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <button
              className="h-8 w-8 rounded-lg shadow-md"
              style={{
                backgroundColor: color?.primary,
                color: color?.secondary,
              }}
            >
              {icon && <FontAwesomeIcon size="lg" icon={icon} />}
            </button>
            <div className="flex flex-col gap-1 font-semibold">
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
      {open === transaction.id && (
        <div className="flex justify-around border-b border-gray-300 bg-gray-100 p-4 text-gray-600">
          <FontAwesomeIcon icon={faPencil} />
          <FontAwesomeIcon icon={faClone} />
          <FontAwesomeIcon icon={faNoteSticky} />
          <FontAwesomeIcon icon={faSitemap} />
        </div>
      )}
    </>
  );
};

export default Transaction;
