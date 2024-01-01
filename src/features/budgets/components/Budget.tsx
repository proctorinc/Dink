import { type Budget, type Prisma } from "@prisma/client";
import { useState, type FC } from "react";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import { ProgressBar } from "~/components/ui/Charts";
import useIcons from "~/hooks/useIcons";
import { faMoneyBill1 } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BudgetDetailDrawer from "./BudgetDetailDrawer";

export type BudgetProps = {
  data: Budget & {
    spent: Prisma.Decimal;
    leftover: Prisma.Decimal;
  };
  open?: string;
  onSelection?: (budget: Budget) => void;
  className?: string;
};

const Budget: FC<BudgetProps> = ({
  data: budget,
  open,
  onSelection,
  className,
}) => {
  const { convertToIcon, convertToColor } = useIcons();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const icon = convertToIcon(budget?.icon) ?? faMoneyBill1;
  const color = convertToColor(budget?.color);

  return (
    <>
      <div
        className={
          open === budget.id
            ? `flex w-full bg-gray-100 p-4 ${className ?? ""}`
            : `flex w-full border-b border-gray-300 p-4 ${className ?? ""}`
        }
        onClick={() =>
          onSelection ? onSelection(budget) : setIsDetailOpen(true)
        }
      >
        <div className="flex w-full items-center gap-1">
          <button
            className="h-8 w-8 rounded-lg shadow-md"
            style={{
              backgroundColor: color?.primary,
              color: color?.secondary,
            }}
          >
            <FontAwesomeIcon size="lg" icon={icon} />
          </button>
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
      <BudgetDetailDrawer
        open={isDetailOpen}
        budget={budget}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  );
};

export default Budget;
