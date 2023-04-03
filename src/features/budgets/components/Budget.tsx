import { type Budget, type Prisma } from "@prisma/client";
import { useRouter } from "next/router";
import { type FC } from "react";
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
};

const Budget: FC<BudgetProps> = ({ data: budget }) => {
  const router = useRouter();
  const { convertToIcon } = useIcons();
  const icon = convertToIcon(budget?.icon) ?? faMoneyBill1;

  if (budget.goal === budget.leftover) {
    return (
      <Card onClick={() => void router.push(`/budget/${budget.id}`)}>
        <Card.Body horizontal>
          <Card.Group size="sm">
            <Card.Group horizontal>
              <IconButton icon={icon} size="sm" style="secondary" />
              <h3 className="text-lg font-bold">
                {formatToTitleCase(budget.name)}
              </h3>
            </Card.Group>
          </Card.Group>
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
        <Card.Group horizontal>
          <IconButton icon={icon} size="sm" style="secondary" />
          <h3 className="text-lg">{formatToTitleCase(budget.name)}</h3>
        </Card.Group>
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
