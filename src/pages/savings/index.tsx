import { faCoins, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ButtonBar } from "~/components/ui/Button";
import Button from "~/components/ui/Button/Button";
import { PieChart } from "~/components/ui/Charts";
import Header from "~/components/ui/Header";
import Page from "~/components/ui/Page";
import Spinner from "~/components/ui/Spinner";
import Fund from "~/features/funds";
import useNotifications from "~/hooks/useNotifications";
import { formatToCurrency, formatToPercentage } from "~/utils";
import { api } from "~/utils/api";

export default function Funds() {
  const router = useRouter();
  const fundsData = api.funds.getAllData.useQuery(undefined, {
    onSuccess: () => clearNotification(),
    onError: () => setErrorNotification("Failed to fetch funds"),
  });

  const percentAllocated = formatToPercentage(
    fundsData?.data?.total,
    Prisma.Decimal.add(
      fundsData.data?.total ?? new Prisma.Decimal(0),
      fundsData.data?.unallocatedTotal ?? new Prisma.Decimal(0)
    )
  );

  const { setLoadingNotification, clearNotification, setErrorNotification } =
    useNotifications();

  useEffect(() => {
    if (fundsData.isFetching) {
      setLoadingNotification("Loading Funds...");
    }
  }, [fundsData, setLoadingNotification]);

  const isFundsEmpty = fundsData?.data?.funds.length === 0;

  const chartData = [
    { name: "Allocated", amount: fundsData.data?.total },
    { name: "Unallocated", amount: fundsData.data?.unallocatedTotal },
  ];

  return (
    <Page auth title="Savings">
      <Header
        title="Savings"
        subtitle={`Total: ${formatToCurrency(fundsData?.data?.total)}`}
      />
      <div className="flex w-full items-end overflow-x-clip">
        <div className="max-h-1/4 h-64 w-2/3">
          <PieChart data={fundsData.data?.funds ?? []} floatRight />
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
          style={isFundsEmpty ? "secondary" : "primary"}
          onClick={() => void router.push("/savings/create")}
        />
        <Button
          title="Allocate"
          icon={faCoins}
          style={isFundsEmpty ? "primary" : "secondary"}
          onClick={() => void router.push("/savings/allocate")}
        />
      </ButtonBar>
      {fundsData.isLoading && <Spinner />}
      <div className="flex w-full flex-col gap-3">
        {fundsData?.data?.funds.map((fund) => (
          <Fund
            key={fund.id}
            data={fund}
            onClick={() => void router.push(`/savings/${fund.id}`)}
          />
        ))}
      </div>
    </Page>
  );
}