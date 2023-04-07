import { Prisma } from "@prisma/client";
import { type FC } from "react";
import { formatToCurrency } from "~/utils";
import Card from "~/components/ui/Card";
import { ProgressBar } from "~/components/ui/Charts";
import { IconButton } from "~/components/ui/Button";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";
import { useMonthContext } from "~/hooks/useMonthContext";

export const IncomeBudget: FC = () => {
  const { month, startOfMonth, endOfMonth } = useMonthContext();

  const income = api.transactions.getIncomeByMonth.useQuery({
    startOfMonth,
    endOfMonth,
  });

  return (
    <Card size="sm">
      <Card.Header>
        <Card.Group horizontal>
          <IconButton icon={faSackDollar} size="sm" style="secondary" />
          <h3 className="text-lg">{month} Income</h3>
        </Card.Group>
      </Card.Header>
      <Card.Body>
        <ProgressBar
          size="sm"
          value={income.data}
          goal={new Prisma.Decimal(0)}
        />
        <span className="text-sm text-primary-light">
          {formatToCurrency(income?.data)} /{" "}
          {formatToCurrency(new Prisma.Decimal(0))}
        </span>
      </Card.Body>
    </Card>
  );
};
