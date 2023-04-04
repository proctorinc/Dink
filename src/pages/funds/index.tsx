import { faCoins, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/router";
import { ButtonBar } from "~/components/ui/Button";
import Button from "~/components/ui/Button/Button";
import { PieChart } from "~/components/ui/Charts";
import Header from "~/components/ui/Header";
import Spinner from "~/components/ui/Spinner";
import Fund from "~/features/funds";
import { formatToCurrency, formatToPercentage } from "~/utils";
import { api } from "~/utils/api";

export default function Funds() {
  const router = useRouter();
  const fundsData = api.funds.getAllData.useQuery();

  const percentAllocated = formatToPercentage(
    fundsData?.data?.total,
    Prisma.Decimal.add(
      fundsData.data?.total ?? new Prisma.Decimal(0),
      fundsData.data?.unallocatedTotal ?? new Prisma.Decimal(0)
    )
  );

  const isFundsEmpty = fundsData?.data?.funds.length === 0;

  const chartData = [
    { name: "Allocated", amount: fundsData.data?.total },
    { name: "Unallocated", amount: fundsData.data?.unallocatedTotal },
  ];

  return (
    <>
      <Header
        title="Funds"
        subtitle={`Total: ${formatToCurrency(fundsData?.data?.total)}`}
      />
      <div className="flex w-full items-end overflow-x-clip">
        <div className="max-h-1/4 h-64 w-2/3">
          <PieChart data={fundsData.data?.funds ?? []} />
        </div>
        <div className="flex w-1/3 items-end">
          <div className="relative flex h-40 w-full flex-col items-center justify-center">
            <span className="absolute text-xl font-bold">
              {percentAllocated}
            </span>
            <PieChart data={chartData} progress />
            <span className="absolute bottom-0 font-bold text-primary-light">
              Allocated
            </span>
          </div>
        </div>
      </div>
      <ButtonBar>
        <Button
          title="Fund"
          icon={faPlus}
          active={isFundsEmpty}
          onClick={() => void router.push("/funds/create")}
        />
        <Button
          title="Allocate"
          icon={faCoins}
          active={!isFundsEmpty}
          onClick={() => void router.push("/funds/allocate")}
        />
      </ButtonBar>
      {fundsData.isLoading && <Spinner />}
      {fundsData?.data?.funds.map((fund) => (
        <Fund
          key={fund.id}
          data={fund}
          onClick={() => void router.push(`/funds/${fund.id}`)}
        />
      ))}
    </>
  );
}
