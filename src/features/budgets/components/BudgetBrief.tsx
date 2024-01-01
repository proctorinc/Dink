import { type Budget, type Prisma } from "@prisma/client";
import { type FC } from "react";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import useIcons from "~/hooks/useIcons";
import { faMoneyBill1 } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type BudgetBriefProps = {
  data: Budget & {
    spent: Prisma.Decimal;
    leftover: Prisma.Decimal;
  };
  onSelection?: (budget: Budget) => void;
};

const BudgetBrief: FC<BudgetBriefProps> = ({ data: budget, onSelection }) => {
  const { convertToIcon, convertToColor } = useIcons();
  const icon = convertToIcon(budget?.icon) ?? faMoneyBill1;
  const color = convertToColor(budget?.color);

  return (
    <>
      <div
        className="flex w-full border-b border-gray-300 p-4"
        onClick={() => (onSelection ? onSelection(budget) : null)}
      >
        <div className="flex items-center gap-1">
          <button
            className="h-8 w-8 rounded-lg shadow-md"
            style={{
              backgroundColor: color?.primary,
              color: color?.secondary,
            }}
          >
            <FontAwesomeIcon size="lg" icon={icon} />
          </button>
          <h3>{formatToTitleCase(budget.name)}</h3>
        </div>
        <span className="flex w-fit flex-grow items-center justify-end text-right">
          {formatToCurrency(budget.spent)} / {formatToCurrency(budget.goal)}
        </span>
      </div>
    </>
  );
};

export default BudgetBrief;
