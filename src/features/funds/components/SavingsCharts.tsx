import { type Fund, Prisma } from "@prisma/client";
import { type FC } from "react";
import { PieChart } from "~/components/ui/Charts";
import Spinner from "~/components/ui/Spinner";
import { formatToPercentage } from "~/utils";

type SavingsChartsProps = {
  data:
    | {
        total: Prisma.Decimal;
        unallocatedTotal: Prisma.Decimal;
        funds: Fund[];
      }
    | undefined;
};

export const SavingsCharts: FC<SavingsChartsProps> = ({ data }) => {
  const percentAllocated = formatToPercentage(
    data?.total,
    Prisma.Decimal.add(
      data?.total ?? new Prisma.Decimal(0),
      data?.unallocatedTotal ?? new Prisma.Decimal(0)
    )
  );

  const chartData = [
    { name: "Allocated", amount: data?.total },
    { name: "Unallocated", amount: data?.unallocatedTotal },
  ];

  return (
    <div className="flex w-full items-end overflow-x-clip">
      <div className="max-h-1/4 h-64 w-2/3">
        <PieChart data={data?.funds ?? []} floatRight />
      </div>
      <div className="flex h-full w-1/3 items-end justify-center">
        <div className="relative flex h-40 w-full flex-col items-center justify-center">
          {data && (
            <span className="absolute text-xl font-bold">
              {percentAllocated}
            </span>
          )}
          {!data && (
            <div className="absolute">
              <Spinner size="sm" />
            </div>
          )}
          <PieChart data={chartData} progress />
          <span className="absolute bottom-0 font-bold text-primary-light">
            Allocated
          </span>
        </div>
      </div>
    </div>
  );
};
