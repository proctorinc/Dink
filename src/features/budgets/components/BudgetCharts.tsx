import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { type Prisma } from "@prisma/client";
import { useState, type FC } from "react";
import { IconButton } from "~/components/ui/Button";
import { PieChart } from "~/components/ui/Charts";
import { BarChart } from "~/components/ui/Charts/BarChart";
import { TextSkeleton } from "~/components/ui/Skeleton";
import Spinner from "~/components/ui/Spinner";
import { formatToCurrency, formatToPercentage } from "~/utils";

type BudgetChartsProps = {
  data:
    | {
        overall: {
          spent: Prisma.Decimal;
          goal: Prisma.Decimal;
          leftover: Prisma.Decimal;
        };
        spending: {
          total: Prisma.Decimal;
          leftover: Prisma.Decimal;
        };
        savings: {
          total: Prisma.Decimal;
          leftover: Prisma.Decimal;
        };
      }
    | undefined;
};

export const BudgetCharts: FC<BudgetChartsProps> = ({ data }) => {
  const [chartNum, setChartNum] = useState(0);
  const percentOverall = formatToPercentage(
    data?.overall.spent,
    data?.overall.goal
  );
  const overallData = [
    { name: "Spent", amount: data?.overall.spent },
    { name: "Left", amount: data?.overall.leftover },
  ];
  const barGraphData = [
    {
      title: "Spending",
      amount: Number(data?.spending.total),
      goal: Number(data?.spending.leftover),
    },
    {
      title: "Savings",
      amount: Number(data?.savings.total),
      goal: Number(data?.savings.leftover),
    },
  ];

  return (
    <div className="flex h-44 w-full items-center justify-center">
      <IconButton
        className={chartNum == 0 ? "invisible" : ""}
        icon={faChevronLeft}
        noShadow
        onClick={() => setChartNum((prev) => prev - 1)}
      />
      {chartNum === 0 && (
        <div className="relative flex h-full w-full flex-col items-center justify-center pb-5">
          <div className="absolute flex flex-col items-center justify-center text-xl font-bold">
            {data && <h2 className="text-2xl font-bold">{percentOverall}</h2>}
            {!data && <Spinner size="sm" />}
          </div>
          <PieChart data={overallData} progress />
          {data && (
            <span className="absolute bottom-0 font-bold text-primary-light">
              {formatToCurrency(data?.overall.spent)} /{" "}
              {formatToCurrency(data?.overall.goal)}
            </span>
          )}
          {!data && (
            <div className="absolute bottom-0">
              <TextSkeleton color="primary" width={200} />
            </div>
          )}
        </div>
      )}
      {chartNum === 1 && (
        <div className="flex h-full w-full items-center">
          <div className="relative flex h-40 w-full flex-col items-center justify-center pb-5">
            <BarChart
              data={barGraphData}
              keys={["amount", "goal"]}
              floatRight
            />
            <div className="absolute bottom-0 flex w-full justify-around font-bold text-primary-light">
              <span>Spending</span>
              <span>Savings</span>
            </div>
          </div>
        </div>
      )}
      <IconButton
        className={chartNum === 1 ? "invisible" : ""}
        icon={faChevronRight}
        noShadow
        onClick={() => setChartNum((prev) => prev + 1)}
      />
    </div>
  );
};
