import { Prisma } from "@prisma/client";
import { useRouter } from "next/router";
import { formatToCurrency, formatToPercentage } from "~/utils";
import { api } from "~/utils/api";

const FundsSummary = () => {
  const router = useRouter();

  const accountData = api.bankAccounts.getAllData.useQuery();
  const fundsData = api.funds.getAllData.useQuery();

  // TODO: Should ignore current month's money to avoid conflict with budget
  const unallocatedFunds = Prisma.Decimal.sub(
    accountData.data?.total ?? new Prisma.Decimal(0),
    fundsData.data?.total ?? new Prisma.Decimal(0)
  );
  const percentAllocated = formatToPercentage(
    fundsData.data?.total,
    accountData.data?.total
  );

  return (
    <div
      className="group flex w-full cursor-pointer flex-col justify-between gap-1 rounded-xl bg-primary-med p-4 hover:bg-primary-light hover:text-primary-dark"
      onClick={() => void router.push("/funds")}
    >
      <div className="flex justify-between">
        <h3 className="text-xl font-bold">Funds</h3>
        <h3 className="text-lg font-bold text-primary-light group-hover:text-primary-med">
          {formatToCurrency(fundsData?.data?.total)}
        </h3>
      </div>
      <span className="text-sm text-primary-light group-hover:text-primary-med">
        {formatToCurrency(unallocatedFunds)} unallocated
      </span>
      <div className="relative h-6 w-full rounded-md bg-primary-dark group-hover:bg-primary-med">
        <div
          className="absolute h-full rounded-md bg-gradient-to-r from-secondary-dark to-secondary-med"
          style={{ width: percentAllocated }}
        ></div>
      </div>
    </div>
  );
};

export default FundsSummary;
