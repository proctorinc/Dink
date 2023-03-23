import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import {
  formatToCurrency,
  formatToPercentage,
  formatToTitleCase,
} from "~/utils";
import { api } from "~/utils/api";

export default function Budgets() {
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
            <div className="flex w-full justify-between">
              <div className="flex flex-col">
                <h1 className="text-4xl font-bold">Budget</h1>
                <h2 className="text-xl font-light text-primary-light">
                  Left: {formatToCurrency(budgetData.data?.leftover)}
                </h2>
              </div>
              <div className="relative flex items-center justify-center">
                <FontAwesomeIcon
                  className="h-6 w-6 text-primary-light"
                  icon={faGear}
                />
              </div>
            </div>

            {/* Budget total summary component */}
            <div className="flex w-full flex-col justify-between gap-1 rounded-xl bg-primary-med p-4">
              <div className="relative h-6 w-full rounded-md bg-primary-dark">
                <div className="absolute h-full w-[50%] rounded-md bg-secondary-dark"></div>
                <div className="absolute h-full w-[40%] rounded-md bg-secondary-med"></div>
              </div>
              <div className="flex justify-between py-1">
                <p className="text-md text-primary-light">
                  {formatToCurrency(budgetData.data?.spent)} /{" "}
                  {formatToCurrency(budgetData.data?.goal)}
                </p>
                <p className="text-md text-primary-light">
                  {formatToPercentage(
                    budgetData.data?.spent,
                    budgetData.data?.goal
                  )}{" "}
                  spent
                </p>
              </div>
            </div>

            {/* Chart block component */}
            <div className="h-40 w-full rounded-xl bg-secondary-med"></div>

            {/* Month year picker component */}
            <div className="flex w-full items-center justify-between rounded-xl bg-primary-med py-2 px-5 text-primary-light">
              <span>{"<-"}</span>
              <span className="text-primary-light">March 2023</span>
              <span>{"->"}</span>
            </div>

            {budgetData.data?.budgets.map((budget) => (
              <div
                key={budget.id}
                className="flex w-full flex-col justify-between gap-1 rounded-xl bg-primary-med p-4"
              >
                <h3 className="text-xl font-bold">
                  {formatToTitleCase(budget.name)}
                </h3>
                <div className="relative h-6 w-full rounded-md bg-primary-dark">
                  <div className="absolute h-full w-[50%] rounded-md bg-secondary-dark"></div>
                  <div className="absolute h-full w-[40%] rounded-md bg-secondary-med"></div>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-primary-light">
                    $??? / {formatToCurrency(budget.goal)}
                  </p>
                  <p className="text-sm text-primary-light">$??? left</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
