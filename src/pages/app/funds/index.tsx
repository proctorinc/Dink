import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import { api } from "~/utils/api";

export default function Funds() {
  const funds = api.funds.getAll.useQuery();

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
                <h1 className="text-4xl font-bold">Funds</h1>
                <h2 className="text-xl font-light text-primary-light">
                  Total: $165,972.35
                </h2>
              </div>
              <div className="relative flex items-center justify-center">
                <FontAwesomeIcon
                  className="h-6 w-6 text-primary-light"
                  icon={faGear}
                />
              </div>
            </div>

            {/* Chart block component */}
            <div className="h-64 w-full rounded-xl bg-secondary-med"></div>

            {funds?.data?.map((fund) => (
              <div
                key={fund.id}
                className="flex w-full flex-col rounded-xl bg-primary-med p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-secondary-dark">
                      <div className="h-5 w-5 rounded-full bg-secondary-med" />
                    </div>
                    <h3 className="text-xl font-bold">
                      {formatToTitleCase(fund.name)}
                    </h3>
                  </div>
                  <span className="text-xl font-bold text-primary-light">
                    {formatToCurrency(fund.initial_amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
