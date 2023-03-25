import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "~/components/ui/Header";
import { formatToCurrency, formatToPercentage } from "~/utils";
import { api } from "~/utils/api";

export default function Home() {
  const router = useRouter();
  const { data: sessionData } = useSession();

  const accountData = api.bankAccounts.getAllData.useQuery();
  const budgetData = api.budgets.getAllData.useQuery();
  const fundsData = api.funds.getAllData.useQuery();
  const creditAccounts = api.bankAccounts.getCreditAccounts.useQuery();

  const monthYear = new Date().toLocaleDateString("en-us", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Header
        title={`Hi, ${sessionData?.user?.nickname ?? ""}`}
        subtitle={monthYear}
      />

      {/* Chart block component */}
      <div className="h-64 w-full rounded-xl bg-gradient-to-t from-secondary-dark to-secondary-med"></div>

      {/* Transactions component */}
      <div
        className="group flex w-full cursor-pointer items-center justify-between rounded-xl bg-primary-med p-4 hover:bg-primary-light hover:text-primary-dark"
        onClick={() => void router.push("/transactions")}
      >
        <div className="flex flex-col">
          <h3 className="text-xl font-bold">Transactions</h3>
          <span className="text-sm text-primary-light group-hover:text-primary-med">
            ??? uncategorized
          </span>
        </div>
        <button className="flex h-fit items-center gap-2 rounded-lg bg-secondary-med py-2 px-5 font-bold text-secondary-dark group-hover:text-secondary-light">
          <span>View</span>
          <FontAwesomeIcon className="h-4 w-4" icon={faArrowRight} />
        </button>
      </div>

      {/* Budget component */}
      <div
        className="group flex w-full cursor-pointer flex-col justify-between gap-1 rounded-xl bg-primary-med p-4 hover:bg-primary-light hover:text-primary-dark"
        onClick={() => {
          void router.push("/budget");
        }}
      >
        <div className="flex justify-between">
          <h3 className="text-xl font-bold">Budget</h3>
          <h3 className="text-lg font-bold text-primary-light">
            {formatToPercentage(budgetData.data?.spent, budgetData.data?.goal)}{" "}
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
        onClick={() => void router.push("/funds")}
      >
        <div className="flex justify-between">
          <h3 className="text-xl font-bold">Funds</h3>
          <h3 className="text-lg font-bold text-primary-light">
            {formatToCurrency(fundsData?.data?.amount)}
          </h3>
        </div>
        <span className="text-sm text-primary-light group-hover:text-primary-med">
          $??? unallocated
        </span>
        <div className="relative h-6 w-full rounded-md bg-primary-dark group-hover:bg-primary-med">
          <div className="absolute h-full w-[25%] rounded-md bg-gradient-to-r from-secondary-dark to-secondary-med"></div>
        </div>
      </div>

      {/* Accounts component */}
      <div
        className="group flex w-full cursor-pointer items-center justify-between rounded-xl bg-primary-med p-4 hover:bg-primary-light hover:text-primary-dark"
        onClick={() => void router.push("/accounts")}
      >
        <div className="flex flex-col">
          <h3 className="text-xl font-bold">Accounts</h3>
          <span className="text-sm text-primary-light group-hover:text-primary-med">
            {accountData.data?.count ?? "No"} linked accounts
          </span>
        </div>
        <button className="flex h-fit items-center gap-2 rounded-lg bg-secondary-med py-2 px-5 font-bold text-secondary-dark group-hover:text-secondary-light">
          <span>{accountData.data?.count ? "View" : "Link"}</span>
          <FontAwesomeIcon className="h-4 w-4" icon={faArrowRight} />
        </button>
      </div>

      {!creditAccounts.data && (
        <div
          className="group flex w-full cursor-pointer items-center justify-between rounded-xl bg-primary-med p-4 hover:bg-primary-light hover:text-primary-dark"
          onClick={() => void router.push("/accounts")}
        >
          <div className="flex flex-col">
            <h3 className="text-xl font-bold">Credit Cards</h3>
            <span className="text-sm text-primary-light group-hover:text-primary-med">
              No linked credit cards
            </span>
          </div>
          <button className="flex h-fit items-center gap-2 rounded-lg bg-secondary-med py-2 px-5 font-bold text-secondary-dark group-hover:text-secondary-light">
            <span>Link</span>
            <FontAwesomeIcon className="h-4 w-4" icon={faArrowRight} />
          </button>
        </div>
      )}

      {/* Credit Cards component */}
      {!!creditAccounts.data && (
        <div className="flex w-full flex-col justify-between rounded-xl bg-primary-med">
          <h3 className="p-4 pb-2 text-xl font-bold">Credit Cards</h3>
          {creditAccounts.data?.map((account) => {
            const utilizationPercent = formatToPercentage(
              account.current,
              new Prisma.Decimal(account.limit ?? 0)
            );
            return (
              <div
                key={account.id}
                className="group cursor-pointer rounded-xl px-4 py-2 hover:bg-primary-light hover:text-primary-dark"
                onClick={() => void router.push(`/accounts/${account.id}`)}
              >
                <div className="flex items-center justify-between py-1">
                  <h3 className=" text-lg">{account.name}</h3>
                  <span className="flex h-fit items-center justify-center rounded-lg bg-warning-med px-2 py-1 text-xs font-bold text-warning-dark">
                    Due ???d
                  </span>
                </div>
                <div className="relative h-6 w-full rounded-md bg-primary-dark group-hover:bg-primary-med">
                  <div
                    className={`absolute h-full w-0 rounded-md bg-gradient-to-r from-secondary-dark to-secondary-med`}
                    style={{ width: utilizationPercent }}
                  ></div>
                </div>
                <div className="flex justify-between py-1 text-sm text-primary-light group-hover:text-primary-med">
                  <span>
                    {formatToCurrency(account.current)} /{" "}
                    {formatToCurrency(new Prisma.Decimal(account.limit ?? 0))}{" "}
                    limit
                  </span>
                  <span>{utilizationPercent} utilization</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
