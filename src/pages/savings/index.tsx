import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import { useState } from "react";
import AuthPage from "~/components/routes/AuthPage";
import Header from "~/components/ui/Header";
import { TextSkeleton } from "~/components/ui/Skeleton";
import Fund, { SavingsCharts } from "~/features/funds";
import AllocateSavingsDrawer from "~/features/funds/components/AllocateSavingsDrawer";
import CreateFundDrawer from "~/features/funds/components/CreateFundDrawer";
import useNotifications from "~/hooks/useNotifications";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";

export default function Funds() {
  const fundsData = api.funds.getAllData.useQuery(undefined, {
    onError: () => setErrorNotification("Failed to fetch funds"),
  });
  const [allocateDrawerOpen, setAllocateDrawerOpen] = useState(false);
  const [createFundDrawerOpen, setCreateFundDrawerOpen] = useState(false);
  const [openFund, setOpenFund] = useState("");

  const { setErrorNotification } = useNotifications();

  const handleOpenFund = (fundId: string) => {
    setOpenFund((prev) => (prev === fundId ? "" : fundId));
  };

  return (
    <AuthPage>
      <Head>
        <title>Savings</title>
      </Head>
      <main className="flex flex-col items-center text-white">
        <div className="container flex max-w-md flex-col items-center justify-center gap-12 pt-5 sm:pb-4 lg:max-w-2xl">
          <div className="flex w-full flex-col items-center gap-4">
            <div className="flex w-full flex-col gap-4 px-4">
              <Header
                title="Savings"
                subtitle={
                  fundsData.data ? (
                    `Total: ${formatToCurrency(fundsData?.data?.total)}`
                  ) : (
                    <TextSkeleton width={200} size="xl" color="primary" />
                  )
                }
              />
              <SavingsCharts data={fundsData?.data} />
            </div>
            <div className="flex w-full flex-col gap-4 rounded-t-2xl bg-gray-100 p-4 pb-20 font-bold text-black">
              <h3 className="pl-2">This Month</h3>
              <div className="grid grid-cols-2 overflow-clip rounded-xl border border-gray-300 bg-white shadow-md lg:grid-cols-2">
                <div className="flex flex-col items-center gap-2 p-4">
                  <span>Saved</span>
                  <span className="text-secondary-med">+?,???.??</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4">
                  <span>Spent</span>
                  <span className="text-danger-med">-$???.??</span>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2 border-t border-gray-300 bg-gray-100 p-4 text-sm text-gray-600">
                  <span onClick={() => setAllocateDrawerOpen(true)}>
                    Allocate Savings
                  </span>
                  <FontAwesomeIcon icon={faArrowRight} size="sm" />
                </div>
              </div>
              <h3 className="pl-2">Funds</h3>
              <div className="grid grid-cols-1 overflow-clip rounded-xl border border-gray-300 bg-white shadow-md lg:grid-cols-2">
                {fundsData?.data?.funds.map((fund) => (
                  <Fund
                    key={fund.id}
                    data={fund}
                    open={openFund}
                    onSelection={handleOpenFund}
                  />
                ))}
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
        onClose={() => setAllocateDrawerOpen(false)}
      />
      <CreateFundDrawer
        open={createFundDrawerOpen}
        onClose={() => setCreateFundDrawerOpen(false)}
      />
    </AuthPage>
  );
}
