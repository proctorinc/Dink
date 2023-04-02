import { type Budget, type Prisma } from "@prisma/client";
import { useRouter } from "next/router";
import { type FC } from "react";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import Card from "~/components/ui/Card";
import { ProgressBar } from "~/components/ui/Charts";

export type BudgetProps = {
  data: Budget & {
    spent: Prisma.Decimal;
    leftover: Prisma.Decimal;
  };
};

const Budget: FC<BudgetProps> = ({ data: budget }) => {
  const router = useRouter();

  if (budget.goal === budget.leftover) {
    return (
      <Card>
        <Card.Body horizontal>
          <h3 className="text-lg font-bold">
            {formatToTitleCase(budget.name)}
          </h3>
          <span className="font-bold text-primary-light">
            {formatToCurrency(budget.goal)}
          </span>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card
      key={budget.id}
      size="sm"
      onClick={() => void router.push(`/budget/${budget.id}`)}
    >
      <Card.Header>
        <h3 className="text-lg">{formatToTitleCase(budget.name)}</h3>
      </Card.Header>
      <Card.Body>
        <ProgressBar size="sm" value={budget.spent} goal={budget.goal} />
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
