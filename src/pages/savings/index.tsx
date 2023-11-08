import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import { useRouter } from "next/router";
import AuthPage from "~/components/routes/AuthPage";
import Header from "~/components/ui/Header";
import { TextSkeleton } from "~/components/ui/Skeleton";
import Fund, { SavingsCharts } from "~/features/funds";
import useNotifications from "~/hooks/useNotifications";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";

export default function Funds() {
  const router = useRouter();
  const fundsData = api.funds.getAllData.useQuery(undefined, {
    onError: () => setErrorNotification("Failed to fetch funds"),
  });

  const { setErrorNotification } = useNotifications();

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
              <div className="flex w-full grid-cols-1 gap-4 overflow-x-scroll">
                <SavingsCharts data={fundsData?.data} />
              </div>
            </div>
            <div className="flex w-full flex-col gap-4 rounded-t-2xl bg-gray-100 p-4 pb-20 font-bold text-black">
              <h3 className="pl-2">This Month</h3>
              <div className="grid grid-cols-2 overflow-clip rounded-xl border border-gray-300 bg-white shadow-md lg:grid-cols-2">
                <div className="flex flex-col items-center gap-2 p-4">
                  <span>Saved</span>
                  <span className="text-secondary-med">+2,250.00</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4">
                  <span>Spent</span>
                  <span className="text-danger-med">-$260.50</span>
                </div>
                <div className="col-span-2 flex items-center gap-2 border-t border-gray-300 bg-gray-100 p-4 text-sm text-gray-600">
                  <span onClick={() => void router.push("/savings/allocate")}>
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
                    onClick={() => void router.push(`/savings/${fund.id}`)}
                  />
                ))}
                <div className="flex items-center gap-2 bg-gray-100 p-4 text-sm text-gray-600">
                  <FontAwesomeIcon icon={faPlus} size="sm" />
                  <span onClick={() => void router.push("/savings/create")}>
                    New Fund
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AuthPage>
  );
}
