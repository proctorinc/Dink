import { type Budget, type Prisma } from "@prisma/client";
import { useRouter } from "next/router";
import { type MouseEventHandler, type FC } from "react";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import Card from "~/components/ui/Card";
import { ProgressBar } from "~/components/ui/Charts";
import { IconButton } from "~/components/ui/Button";
import useIcons from "~/hooks/useIcons";
import { faMoneyBill1 } from "@fortawesome/free-solid-svg-icons";

export type BudgetProps = {
  data: Budget & {
    spent: Prisma.Decimal;
    leftover: Prisma.Decimal;
  };
  onClick?: MouseEventHandler<HTMLDivElement>;
};

const Budget: FC<BudgetProps> = ({ data: budget, onClick }) => {
  const router = useRouter();
  const { convertToIcon } = useIcons();
  const icon = convertToIcon(budget?.icon) ?? faMoneyBill1;

  const navigateToBudget = () => {
    void router.push(`/budget/${budget?.id ?? ""}`);
  };

  return (
    <div
      className="flex w-full border-b border-gray-300 p-4"
      onClick={onClick ?? navigateToBudget}
    >
      <div className="flex w-full items-center gap-1">
        <IconButton size="sm" icon={icon} style="secondary" />
        <div className="flex w-full flex-col gap-1 pl-2">
          <div className="flex justify-between text-sm group-hover:text-primary-med">
            <h3>{formatToTitleCase(budget.name)}</h3>
            <span>
              {formatToCurrency(budget.spent)} / {formatToCurrency(budget.goal)}
            </span>
          </div>
          <ProgressBar size="sm" value={budget.spent} goal={budget.goal} />
        </div>
      </div>
    </div>
  );
};

export default Budget;
