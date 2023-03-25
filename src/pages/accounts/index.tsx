import { useState } from "react";
import {
  accountCategories,
  AccountCategory,
  AccountCategoryIcons,
} from "~/config";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import { api } from "~/utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "~/components/ui/Header";
import { useRouter } from "next/router";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function BankAccounts() {
  const router = useRouter();
  const [open, setOpen] = useState("");
  const accountData = api.bankAccounts.getAllData.useQuery();

  function handleOpen(type: AccountCategory) {
    setOpen((prev) => (prev === type ? "" : type));
  }

  return (
    <>
      <Header
        title="Accounts"
        subtitle={`Net worth: ${formatToCurrency(accountData.data?.total)}`}
      />

      {/* Chart block component */}
      <div className="h-64 w-full rounded-xl bg-gradient-to-t from-secondary-dark to-secondary-med"></div>

      {accountCategories.map((category) => (
        <div
          key={category}
          className="flex w-full flex-col rounded-xl bg-primary-med"
        >
          <div
            className="group flex items-center justify-between rounded-xl p-4 hover:bg-primary-light hover:text-primary-dark"
            onClick={() => handleOpen(category)}
          >
            <div className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-secondary-dark group-hover:bg-secondary-med">
                <FontAwesomeIcon
                  className="h-5 w-5 text-secondary-med group-hover:text-secondary-light"
                  icon={AccountCategoryIcons[category]}
                />
              </div>
              <h3 className="text-lg font-bold">
                {category === AccountCategory.Cash
                  ? "Cash"
                  : formatToTitleCase(category)}
              </h3>
            </div>
            <span className="text-lg font-bold text-primary-light group-hover:text-primary-med">
              {formatToCurrency(accountData.data?.categories[category].total)}
            </span>
          </div>
          {open === category && (
            <div className="flex flex-col">
              {accountData.data?.categories[category].accounts.map(
                (account) => (
                  <div
                    key={account.id}
                    className="bg-red-500 group flex w-full items-center justify-between rounded-xl p-4 hover:bg-primary-light hover:text-primary-dark"
                    onClick={() => void router.push(`/accounts/${account.id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-secondary-dark">
                        <div className="h-8 w-8 rounded-full bg-secondary-med" />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-md">{account.name}</h3>
                        <span className="text-sm text-primary-light group-hover:text-primary-med">
                          {account.official_name} - {account.mask}
                        </span>
                      </div>
                    </div>
                    <span className="text-lg text-primary-light group-hover:text-primary-med">
                      {formatToCurrency(account.current)}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      ))}
      <button className="flex h-fit items-center gap-2 rounded-lg bg-secondary-med py-2 px-5 font-bold text-secondary-dark hover:bg-secondary-light hover:text-secondary-med hover:ring hover:ring-secondary-med group-hover:text-secondary-light">
        <FontAwesomeIcon className="h-4 w-4" icon={faPlus} />
        <span>Account</span>
      </button>
    </>
  );
}
