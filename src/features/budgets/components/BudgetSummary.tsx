import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { type Fund, type Prisma } from "@prisma/client";
import { useRouter } from "next/router";
import { type FC } from "react";
import Button from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import { ProgressBar } from "~/components/ui/Charts";
import { formatToCurrency } from "~/utils";

type BudgetSummaryProps = {
  data:
    | {
        overall: {
          goal: Prisma.Decimal;
          spent: Prisma.Decimal;
          leftover: Prisma.Decimal;
        };
        spending: {
          budgets: {
            spent: Prisma.Decimal;
            leftover: Prisma.Decimal;
            id: string;
            goal: Prisma.Decimal;
            icon: string;
            name: string;
            startDate: Date;
            endDate: Date | null;
            savingsFundId: string | null;
            userId: string;
            savingsFund: Fund | null;
          }[];
          total: Prisma.Decimal;
          goal: Prisma.Decimal;
          leftover: Prisma.Decimal;
        };
        savings: {
          budgets: {
            spent: Prisma.Decimal;
            leftover: Prisma.Decimal;
            id: string;
            goal: Prisma.Decimal;
            icon: string;
            name: string;
            startDate: Date;
            endDate: Date | null;
            savingsFundId: string | null;
            userId: string;
            savingsFund: Fund | null;
          }[];
          total: Prisma.Decimal;
          goal: Prisma.Decimal;
          leftover: Prisma.Decimal;
        };
      }
    | undefined;
};

export const BudgetSummary: FC<BudgetSummaryProps> = ({ data }) => {
  const router = useRouter();

  if (data && data.spending.budgets.length === 0) {
    return (
      <Card onClick={() => void router.push("/budget")}>
        <Card.Body horizontal>
          <div className="flex flex-col">
            <h3 className="text-xl font-bold">Budget</h3>
            <span className="text-sm text-primary-light group-hover:text-primary-med">
              No budgets created
            </span>
          </div>
          <Button title="Add" icon={faPlus} style="secondary" />
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card onClick={() => void router.push("/budget")}>
      <Card.Body>
        <Card.Group
          className="w-full justify-between text-xl font-bold"
          horizontal
        >
          <h3>{formatToCurrency(data?.overall.leftover)} left</h3>
        </Card.Group>
        <ProgressBar
          style="primary"
          value={data?.overall.spent}
          goal={data?.overall.goal}
        />
        <span className="text-sm text-primary-light group-hover:text-primary-med">
          {formatToCurrency(data?.overall.spent)} /{" "}
          {formatToCurrency(data?.overall.goal)}
        </span>
      </Card.Body>
    </Card>
  );
};
