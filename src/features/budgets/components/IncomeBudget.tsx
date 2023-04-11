import { Prisma } from "@prisma/client";
import { type FC } from "react";
import { formatToCurrency } from "~/utils";
import Card from "~/components/ui/Card";
import { ProgressBar } from "~/components/ui/Charts";
import { api } from "~/utils/api";
import { useMonthContext } from "~/hooks/useMonthContext";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Button from "~/components/ui/Button";

export const IncomeBudget: FC = () => {
  const { startOfMonth, endOfMonth } = useMonthContext();

  const income = api.transactions.getIncomeByMonth.useQuery({
    startOfMonth,
    endOfMonth,
  });

  const incomeGoal = new Prisma.Decimal(0);

  if (Number(incomeGoal) === 0) {
    return (
      <Card size="sm">
        <Card.Body horizontal>
          <div className="flex flex-col">
            <h3 className="text-xl font-bold">Income</h3>
            <span className="text-sm text-primary-light group-hover:text-primary-med">
              No projected income
            </span>
          </div>
          <Button title="Fix" icon={faArrowRight} style="secondary" iconRight />
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header size="sm">
        <h3 className="text-xl">Income</h3>
        <span className="text-sm text-primary-light">
          {formatToCurrency(income?.data)} / {formatToCurrency(incomeGoal)}
        </span>
      </Card.Header>
      <Card.Body>
        <ProgressBar
          size="sm"
          value={income.data}
          goal={new Prisma.Decimal(0)}
        />
      </Card.Body>
    </Card>
  );
};
