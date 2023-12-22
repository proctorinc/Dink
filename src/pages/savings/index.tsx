import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import { useMemo, useState } from "react";
import AuthPage from "~/components/routes/AuthPage";
import { PieChart } from "~/components/ui/Charts";
import { TextSkeleton } from "~/components/ui/Skeleton";
import Fund, { FundSkeletons } from "~/features/funds";
import AllocateSavingsDrawer from "~/features/funds/components/AllocateSavingsDrawer";
import CreateFundDrawer from "~/features/funds/components/CreateFundDrawer";
import useIcons from "~/hooks/useIcons";
import { useMonthContext } from "~/hooks/useMonthContext";
import useNotifications from "~/hooks/useNotifications";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

export default function Funds() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const allocate = searchParams.get("allocate");

  const fundsData = api.funds.getAllData.useQuery(undefined, {
    onError: () => setErrorNotification("Failed to fetch funds"),
  });
  const [allocateDrawerOpen, setAllocateDrawerOpen] = useState<boolean>(
    !!allocate ?? false
  );
  const [createFundDrawerOpen, setCreateFundDrawerOpen] = useState(false);

  const { setErrorNotification } = useNotifications();
  const { month } = useMonthContext();
  const { convertToColor } = useIcons();

  const openAllocationDrawer = () => {
    void router.replace({ pathname: "/savings", query: { allocate: true } });
    setAllocateDrawerOpen(true);
  };

  const sortedFunds = useMemo(() => {
    return fundsData.data?.funds
      ? fundsData.data?.funds.sort((a, b) => (a.amount >= b.amount ? 1 : -1))
      : [];
  }, [fundsData.data]);

  return (
    <AuthPage>
      <Head>
        <title>Savings</title>
      </Head>
      <main className="flex flex-col items-center text-white">
        <div className="container flex max-w-md flex-col items-center justify-center gap-12 pt-5 sm:pb-4 lg:max-w-2xl">
          <div className="flex w-full flex-col items-center gap-4">
            <div className="sticky top-20 z-10 flex w-full px-4">
              <div className="relative flex h-52 w-2/3 items-center justify-center font-bold">
                <PieChart
                  colors={sortedFunds.map(
                    (fund) => convertToColor(fund.color).primary
                  )}
                  data={sortedFunds}
                  floatRight
                />
                {!fundsData?.data && (
                  <div className="align-center absolute flex h-48 w-48 animate-pulse items-center justify-center rounded-full bg-white/20"></div>
                )}
                <div className="absolute flex flex-col items-center justify-center pb-2 align-middle">
                  <span className="text-sm font-normal text-primary-light">
                    Total Savings
                  </span>
                  <span className="text-4xl">
                    {fundsData?.data?.total &&
                      formatToCurrency(fundsData?.data?.total)}
                    {!fundsData?.data?.total && (
                      <TextSkeleton size="2xl" width={125} />
                    )}
                  </span>
                </div>
              </div>
              <div className="flex w-1/3 flex-col justify-center gap-2 pr-4 font-bold">
                <span className="text-xl font-bold">{month}</span>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-normal text-primary-light">
                    Saved
                  </span>
                  <span className="rounded-md bg-secondary-med px-3 py-1 text-secondary-light">
                    +{formatToCurrency(fundsData.data?.monthly.saved)}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-normal text-primary-light">
                    Spent
                  </span>
                  <span className="rounded-md bg-danger-med px-3 py-1 text-danger-light">
                    -{formatToCurrency(fundsData.data?.monthly.spent)}
                  </span>
                </div>
              </div>
            </div>
            <div className="z-20 flex w-full flex-col gap-4 rounded-t-2xl bg-gray-100 p-4 pb-20 font-bold text-black">
              <div className="flex w-full items-center justify-between px-2">
                <h3>Unallocated</h3>
                <button
                  className="flex items-center justify-center gap-1 text-sm"
                  onClick={() => openAllocationDrawer()}
                >
                  Allocate
                  <FontAwesomeIcon icon={faArrowRight} size="sm" />
                </button>
              </div>
              <div className="rounded-xl border border-gray-300 bg-white p-4">
                {formatToCurrency(fundsData.data?.unallocatedTotal)}
              </div>
              <h3 className="px-2">Funds</h3>
              <div className="grid grid-cols-1 overflow-clip rounded-xl border border-gray-300 bg-white shadow-md lg:grid-cols-2">
                <FundSkeletons />
                {fundsData?.data?.funds.map((fund) => (
                  <Fund key={fund.id} data={fund} />
                ))}
                {!fundsData?.data?.funds && <FundSkeletons />}
                <div className="flex items-center justify-end gap-2 bg-gray-100 p-4 text-sm text-gray-600">
                  <FontAwesomeIcon icon={faPlus} size="sm" />
                  <span onClick={() => setCreateFundDrawerOpen(true)}>
                    New Fund
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <AllocateSavingsDrawer
        open={allocateDrawerOpen}
        onClose={() => {
          void router.replace("/savings", undefined);
          setAllocateDrawerOpen(false);
        }}
      />
      <CreateFundDrawer
        open={createFundDrawerOpen}
        onClose={() => setCreateFundDrawerOpen(false)}
      />
    </AuthPage>
  );
}
