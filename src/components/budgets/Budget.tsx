import { type Budget, type Prisma } from "@prisma/client";
import { useRouter } from "next/router";
import { type FC } from "react";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import Card from "../ui/Card";
import { ProgressBar } from "../ui/Charts";

export type BudgetProps = {
  data: Budget & {
    spent: Prisma.Decimal;
    leftover: Prisma.Decimal;
  };
};

const Budget: FC<BudgetProps> = ({ data: budget }) => {
  const router = useRouter();

  return (
    <Card
      key={budget.id}
      style="sm"
      onClick={() => void router.push(`/budget/${budget.id}`)}
    >
      <Card.Header>
        <h3 className="text-lg">{formatToTitleCase(budget.name)}</h3>
      </Card.Header>
      <Card.Body>
        <ProgressBar style="sm" value={budget.spent} goal={budget.goal} />
        <div className="flex justify-between text-sm text-primary-light group-hover:text-primary-med">
          <span>
            {formatToCurrency(budget.spent)} / {formatToCurrency(budget.goal)}
          </span>
          {Number(budget.leftover) >= 0 && (
            <span>{formatToCurrency(budget.leftover)} left</span>
          )}
          {Number(budget.leftover) < 0 && (
            <span>{formatToCurrency(budget.leftover)} over</span>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Budget;
