import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Prisma } from "@prisma/client";
import Head from "next/head";
import { useState } from "react";
import AuthPage from "~/components/routes/AuthPage";
import { PieChart } from "~/components/ui/Charts";
import Fund from "~/features/funds";
import AllocateSavingsDrawer from "~/features/funds/components/AllocateSavingsDrawer";
import CreateFundDrawer from "~/features/funds/components/CreateFundDrawer";
import EditFundDrawer from "~/features/funds/components/EditFundDrawer";
import useNotifications from "~/hooks/useNotifications";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";

export default function Funds() {
  const fundsData = api.funds.getAllData.useQuery(undefined, {
    onError: () => setErrorNotification("Failed to fetch funds"),
  });
  const [allocateDrawerOpen, setAllocateDrawerOpen] = useState(false);
  const [createFundDrawerOpen, setCreateFundDrawerOpen] = useState(false);
  const [openFund, setOpenFund] = useState<
    | (Fund & {
        amount: Prisma.Decimal;
      })
    | null
  >(null);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  const { setErrorNotification } = useNotifications();

  const chartData = [
    { name: "Allocated", amount: fundsData.data?.total },
    { name: "Unallocated", amount: fundsData.data?.unallocatedTotal },
  ];

  return (
    <AuthPage>
      <Head>
        <title>Savings</title>
      </Head>
      <main className="flex flex-col items-center text-white">
        <div className="container flex max-w-md flex-col items-center justify-center gap-12 pt-5 sm:pb-4 lg:max-w-2xl">
          <div className="flex w-full flex-col items-center gap-4">
            <div className="flex w-full flex-col gap-4 px-4">
              {/* <Header
                title="Savings"
                subtitle={
                  fundsData.data ? (
                    `Total: ${formatToCurrency(fundsData?.data?.total)}`
                  ) : (
                    <TextSkeleton width={200} size="xl" color="primary" />
                  )
                }
              /> */}
              <div className="max-h-1/4 relative flex h-64 w-2/3 items-center justify-center font-bold lg:w-1/2">
                <PieChart data={fundsData.data?.funds ?? []} floatRight />
                <div className="absolute flex flex-col items-center justify-center align-middle text-3xl">
                  <span>{formatToCurrency(fundsData?.data?.total)}</span>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4 rounded-t-2xl bg-gray-100 p-4 pb-20 font-bold text-black">
              {/* <h3 className="pl-2">This Month</h3>
              <div className="flex gap-4">
                <div className="flex w-1/3 flex-col gap-2 overflow-clip rounded-xl border border-gray-300 bg-white p-4 text-center shadow-md">
                  <span>Saved</span>
                  <span className="text-xl text-secondary-med">
                    +{formatToCurrency(fundsData.data?.monthly.saved)}
                  </span>
                </div>
                <div className="flex w-1/3 flex-col gap-2 overflow-clip rounded-xl border border-gray-300 bg-white p-4 text-center shadow-md">
                  <span>Spent</span>
                  <span className="text-xl text-danger-med">
                    -{formatToCurrency(fundsData.data?.monthly.spent)}
                  </span>
                </div>
              </div> */}
              <div className="flex w-full items-center justify-between px-2">
                <h3>Funds</h3>
                <button
                  className="flex items-center justify-center gap-1 text-sm"
                  onClick={() => setAllocateDrawerOpen(true)}
                >
                  Allocate Savings
                  <FontAwesomeIcon icon={faArrowRight} size="sm" />
                </button>
              </div>
              <div className="grid grid-cols-1 overflow-clip rounded-xl border border-gray-300 bg-white shadow-md lg:grid-cols-2">
                {fundsData?.data?.funds.map((fund) => (
                  <Fund
                    key={fund.id}
                    data={fund}
                    open={openFund?.id}
                    // onSelection={handleOpenFund}
                    onEdit={() => setEditDrawerOpen(true)}
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
      {openFund && (
        <EditFundDrawer
          open={editDrawerOpen}
          fund={openFund}
          onClose={() => setEditDrawerOpen(false)}
        />
      )}
    </AuthPage>
  );
}
