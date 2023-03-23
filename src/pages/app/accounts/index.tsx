import Head from "next/head";
import { useState } from "react";
import {
  accountCategories,
  AccountCategory,
  AccountCategoryIcons,
} from "~/config";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import { api } from "~/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

export default function BankAccounts() {
  const [open, setOpen] = useState("");

  const accountData = api.bankAccounts.getAllData.useQuery();

  function handleOpen(type: AccountCategory) {
    setOpen((prev) => (prev === type ? "" : type));
  }

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
                <h1 className="text-4xl font-bold">Accounts</h1>
                <h2 className="text-xl font-light text-primary-light">
                  Net worth: {formatToCurrency(accountData.data?.total)}
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

            {accountCategories.map((category) => (
              <div
                key={category}
                className="flex w-full flex-col rounded-xl bg-primary-med p-4"
              >
                <div
                  className="flex items-center justify-between"
                  onClick={() => handleOpen(category)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-secondary-dark">
                      <FontAwesomeIcon
                        className="h-6 w-6 text-secondary-med"
                        icon={AccountCategoryIcons[category]}
                      />
                    </div>
                    <h3 className="text-xl font-bold">
                      {category === AccountCategory.Cash
                        ? "Cash"
                        : formatToTitleCase(category)}
                    </h3>
                  </div>
                  <span className="text-xl font-bold text-primary-light">
                    {formatToCurrency(
                      accountData.data?.categories[category].total
                    )}
                  </span>
                </div>
                {open === category && (
                  <div className="flex flex-col gap-4 pt-5">
                    {accountData.data?.categories[category].accounts.map(
                      (account) => (
                        <div
                          key={account.id}
                          className="bg-red-500 flex w-full items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-secondary-dark">
                              <div className="h-8 w-8 rounded-full bg-secondary-med" />
                            </div>
                            <div className="flex flex-col">
                              <h3 className="text-md">
                                {account.official_name}
                              </h3>
                              <p className="text-sm text-primary-light">
                                {account.name} - {account.mask}
                              </p>
                            </div>
                          </div>
                          <span className="text-lg text-primary-light">
                            {formatToCurrency(account.current)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
