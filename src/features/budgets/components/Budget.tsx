import { type Budget, type Prisma } from "@prisma/client";
import { type FC } from "react";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import { ProgressBar } from "~/components/ui/Charts";
import { IconButton } from "~/components/ui/Button";
import useIcons from "~/hooks/useIcons";
import {
  faMoneyBill1,
  faPencil,
  faReceipt,
  faSitemap,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type BudgetProps = {
  data: Budget & {
    spent: Prisma.Decimal;
    leftover: Prisma.Decimal;
  };
  open?: string;
  onClick: (budgetId: string) => void;
};

const Budget: FC<BudgetProps> = ({ data: budget, open, onClick }) => {
  const { convertToIcon } = useIcons();
  const icon = convertToIcon(budget?.icon) ?? faMoneyBill1;

  return (
    <>
      <div
        className={
          open === budget.id
            ? "flex w-full bg-gray-100 p-4"
            : "flex w-full border-b border-gray-300 p-4"
        }
        onClick={() => onClick(budget.id)}
      >
        <div className="flex w-full items-center gap-1">
          <IconButton size="sm" icon={icon} style="secondary" />
          <div className="flex w-full flex-col gap-1 pl-2">
            <div className="flex justify-between group-hover:text-primary-med">
              <h3>{formatToTitleCase(budget.name)}</h3>
              <span>
                {formatToCurrency(budget.spent)} /{" "}
                {formatToCurrency(budget.goal)}
              </span>
            </div>
            <ProgressBar size="sm" value={budget.spent} goal={budget.goal} />
          </div>
        </div>
      </div>
      {open === budget.id && (
        <div className="flex justify-around border-b border-gray-300 bg-gray-100 p-4 text-gray-600">
          <FontAwesomeIcon icon={faPencil} />
          <FontAwesomeIcon icon={faSitemap} />
          <FontAwesomeIcon icon={faReceipt} />
        </div>
      )}
    </>
  );
};

export default Budget;
