import { faArrowRight, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/router";
import Header from "~/components/ui/Header";
import { formatToCurrency, formatToPercentage } from "~/utils";
import { api } from "~/utils/api";

export default function Home() {
  const router = useRouter();

  const budgetData = api.budgets.getAllData.useQuery();
  const creditAccounts = api.bankAccounts.getCreditAccounts.useQuery();

  return (
    <div className="container flex max-w-md flex-col items-center justify-center gap-12 p-4">
      <div className="flex w-full flex-col items-center gap-4">
        <Header
          title={"Hi, Matt"}
          subtitle={"March 2023"}
          icon={
            <FontAwesomeIcon
              className="h-6 w-6 text-primary-light hover:text-white"
              icon={faGear}
            />
          }
        />

        {/* Chart block component */}
        <div className="h-64 w-full rounded-xl bg-gradient-to-t from-secondary-dark to-secondary-med"></div>

        {/* Transactions component */}
        <div
          className="group flex w-full cursor-pointer items-center justify-between rounded-xl bg-primary-med p-4 hover:bg-primary-light hover:text-primary-dark"
          onClick={() => router.push("/app/transactions")}
        >
          <div className="flex flex-col">
            <h3 className="text-xl font-bold">Transactions</h3>
            <span className="text-sm text-primary-light group-hover:text-primary-med">
              25 uncategorized
            </span>
          </div>
          <button className="flex h-fit items-center gap-2 rounded-lg bg-gradient-to-r from-secondary-dark to-secondary-med py-2 px-5 font-bold text-primary-dark group-hover:text-secondary-light">
            <span>View</span>
            <FontAwesomeIcon className="h-4 w-4" icon={faArrowRight} />
          </button>
        </div>

        {/* Budget component */}
        <div
          className="group flex w-full cursor-pointer flex-col justify-between gap-1 rounded-xl bg-primary-med p-4 hover:bg-primary-light hover:text-primary-dark"
          onClick={() => router.push("/app/budget")}
        >
          <div className="flex justify-between">
            <h3 className="text-xl font-bold">Budget</h3>
            <h3 className="text-lg font-bold text-primary-light">
              {formatToPercentage(
                budgetData.data?.spent,
                budgetData.data?.goal
              )}{" "}
              left
            </h3>
          </div>
          <span className="text-sm text-primary-light group-hover:text-primary-med">
            {formatToCurrency(budgetData.data?.spent)} /{" "}
            {formatToCurrency(budgetData.data?.goal)}
          </span>
          <div className="relative h-6 w-full rounded-md bg-primary-dark group-hover:bg-primary-med">
            <div className="absolute h-full w-[70%] rounded-md bg-gradient-to-r from-secondary-dark to-secondary-med"></div>
          </div>
        </div>

        {/* Fund component */}
        <div
          className="group flex w-full cursor-pointer flex-col justify-between gap-1 rounded-xl bg-primary-med p-4 hover:bg-primary-light hover:text-primary-dark"
          onClick={() => router.push("/app/funds")}
        >
          <div className="flex justify-between">
            <h3 className="text-xl font-bold">Funds</h3>
            <h3 className="text-lg font-bold text-primary-light">$438,200</h3>
          </div>
          <span className="text-sm text-primary-light group-hover:text-primary-med">
            $12,034 unallocated
          </span>
          <div className="relative h-6 w-full rounded-md bg-primary-dark group-hover:bg-primary-med">
            <div className="absolute h-full w-[25%] rounded-md bg-gradient-to-r from-secondary-dark to-secondary-med"></div>
          </div>
        </div>

        {/* Accounts component */}
        <div
          className="group flex w-full cursor-pointer items-center justify-between rounded-xl bg-primary-med p-4 hover:bg-primary-light hover:text-primary-dark"
          onClick={() => router.push("/app/accounts")}
        >
          <div className="flex flex-col">
            <h3 className="text-xl font-bold">Accounts</h3>
            <span className="text-sm text-primary-light group-hover:text-primary-med">
              12 linked accounts
            </span>
          </div>
          <button className="flex h-fit items-center gap-2 rounded-lg bg-gradient-to-r from-secondary-dark to-secondary-med py-2 px-5 font-bold text-primary-dark group-hover:text-secondary-light">
            <span>View</span>
            <FontAwesomeIcon className="h-4 w-4" icon={faArrowRight} />
          </button>
        </div>

        {/* Credit Cards component */}
        <div className="flex w-full flex-col justify-between rounded-xl bg-primary-med">
          <h3 className="p-4 text-xl font-bold">Credit Cards</h3>
          {creditAccounts.data?.map((account) => {
            const utilization = formatToPercentage(
              account.current,
              new Prisma.Decimal(account.limit ?? 0)
            );
            return (
              <div
                key={account.id}
                className="group cursor-pointer rounded-xl px-4 py-2 hover:bg-primary-light hover:text-primary-dark"
                onClick={() => router.push(`/app/accounts/${account.id}`)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="py-1 text-lg">{account.name}</h3>
                  <span className="flex h-fit items-center justify-center rounded-lg bg-warning-med px-2 py-1 text-xs font-bold text-warning-dark">
                    Due 3d
                  </span>
                </div>
                <div className="relative h-6 w-full rounded-md bg-primary-dark group-hover:bg-primary-med">
                  <div
                    className={`absolute h-full w-0 rounded-md bg-gradient-to-r from-secondary-dark to-secondary-med`}
                    style={{ width: utilization }}
                  ></div>
                </div>
                <div className="flex justify-between py-1 text-sm text-primary-light group-hover:text-primary-med">
                  <span>
                    {formatToCurrency(account.current)} /{" "}
                    {formatToCurrency(new Prisma.Decimal(account.limit ?? 0))}{" "}
                    limit
                  </span>
                  <span>{utilization} utilization</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
