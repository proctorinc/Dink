import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import { formatToCurrency, formatToPercentage } from "~/utils";
import { api } from "~/utils/api";

export default function Home() {
  const budgetData = api.budgets.getAllData.useQuery();

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-primary-dark p-2 text-white">
        <div className="container flex max-w-md flex-col items-center justify-center gap-12 px-4 py-10">
          <div className="flex w-full flex-col items-center gap-4">
            {/* Welcome header component */}
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col">
                <h1 className="text-4xl font-bold">Hi, Matt</h1>
                <h2 className="text-xl font-light text-primary-light">
                  March 2023
                </h2>
              </div>
              <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-secondary-med">
                <div className="h-8 w-8 rounded-full bg-secondary-dark"></div>
                <div className="absolute mt-14 h-8 w-8 rounded-full bg-secondary-dark"></div>
              </div>
            </div>

            {/* Chart block component */}
            <div className="h-64 w-full rounded-xl bg-secondary-med"></div>

            {/* Month year picker component */}
            <div className="flex w-full items-center justify-between rounded-xl bg-primary-med py-2 px-5 text-primary-light">
              <FontAwesomeIcon className="h-4 w-4" icon={faArrowLeft} />
              <span className="font-bold text-primary-light">March 2023</span>
              <FontAwesomeIcon className="h-4 w-4" icon={faArrowRight} />
            </div>

            {/* Budget component*/}
            <div className="flex w-full flex-col justify-between gap-1 rounded-xl bg-primary-med p-4">
              <div className="flex justify-between">
                <h3 className="text-xl font-bold">Budget</h3>
                <h3 className="text-md font-bold">
                  {formatToPercentage(
                    budgetData.data?.spent,
                    budgetData.data?.goal
                  )}{" "}
                  left
                </h3>
              </div>
              <p className="text-sm text-primary-light">
                {formatToCurrency(budgetData.data?.spent)} /{" "}
                {formatToCurrency(budgetData.data?.goal)}
              </p>
              <div className="relative h-6 w-full rounded-md bg-primary-dark">
                <div className="absolute h-full w-[85%] rounded-md bg-secondary-dark"></div>
                <div className="absolute h-full w-[70%] rounded-md bg-secondary-med"></div>
              </div>
            </div>

            {/* Fund component*/}
            <div className="flex w-full flex-col justify-between gap-1 rounded-xl bg-primary-med p-4">
              <div className="flex justify-between">
                <h3 className="text-xl font-bold">Funds</h3>
                <h3 className="text-md font-bold">$438,200</h3>
              </div>
              <p className="text-sm text-primary-light">$12,034 unallocated</p>
              <div className="relative h-6 w-full rounded-md bg-primary-dark">
                <div className="absolute h-full w-[50%] rounded-md bg-secondary-dark"></div>
                <div className="absolute h-full w-[25%] rounded-md bg-secondary-med"></div>
              </div>
            </div>

            {/* Transactions component*/}
            <div className="flex w-full items-center justify-between rounded-xl bg-primary-med p-4">
              <div className="flex flex-col">
                <h3 className="text-xl font-bold">Transactions</h3>
                <p className="text-sm text-primary-light">25 uncategorized</p>
              </div>
              <button className="flex h-fit items-center gap-2 rounded-lg bg-secondary-med py-2 px-5 font-bold text-secondary-dark">
                <span>View</span>
                <FontAwesomeIcon className="h-4 w-4" icon={faArrowRight} />
              </button>
            </div>

            {/* Credit Cards component*/}
            <div className="flex w-full flex-col justify-between gap-2 rounded-xl bg-primary-med p-4">
              <h3 className="text-xl font-bold">Credit Cards</h3>
              <div className="">
                <h3 className="py-1 text-lg">Chase Premium Platinum Plus</h3>
                <div className="relative h-6 w-full rounded-md bg-primary-dark">
                  <div className="absolute h-full w-[0%] rounded-md bg-secondary-dark"></div>
                  <div className="absolute h-full w-[3%] rounded-md bg-secondary-med"></div>
                </div>
                <div className="flex justify-between py-1">
                  <p className="text-sm text-primary-light">
                    $304 / $8,000 limit
                  </p>
                  <p className="text-sm text-primary-light">3% utilization</p>
                </div>
              </div>
              {/* <div className="h-[1px] w-full bg-primary-dark" /> */}
              <div className="">
                <h3 className="py-1 text-lg">Alaska Airlines Rewards</h3>
                <div className="relative h-6 w-full rounded-md bg-primary-dark">
                  <div className="absolute h-full w-[29%] rounded-md bg-secondary-dark"></div>
                  <div className="absolute h-full w-[20%] rounded-md bg-secondary-med"></div>
                </div>
                <div className="flex justify-between py-1">
                  <p className="text-sm text-primary-light">
                    $1,342 / $4,000 limit
                  </p>
                  <p className="text-sm text-primary-light">29% utilization</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
