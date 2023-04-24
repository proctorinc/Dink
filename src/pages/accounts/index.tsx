import { useState } from "react";
import { accountCategories, type AccountCategory } from "~/config";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";
import Header from "~/components/ui/Header";
import { ButtonBar } from "~/components/ui/Button";
import { LineChart } from "~/components/ui/Charts";
import Page from "~/components/ui/Page";
import { PlaidLink } from "~/features/plaid";
import useNotifications from "~/hooks/useNotifications";
import {
  AccountCategoriesList,
  AccountCategorySkeleton,
} from "~/features/accounts";

export default function BankAccounts() {
  const [open, setOpen] = useState("");
  const { clearNotification, setErrorNotification } = useNotifications();
  const accountData = api.bankAccounts.getAllData.useQuery(undefined, {
    onSuccess: () => clearNotification(),
    onError: () => setErrorNotification("Failed to fetch accounts"),
  });

  const handleOpen = (type: AccountCategory) => {
    setOpen((prev) => (prev === type ? "" : type));
  };

  return (
    <Page auth title="Accounts" style="basic">
      <div className="w-full px-4">
        <Header
          title="Accounts"
          subtitle={`Net worth: ${formatToCurrency(accountData.data?.total)}`}
        />
      </div>
      <div className="flex h-40 w-full flex-col">
        {accountData.data?.chartData && (
          <LineChart data={accountData.data.chartData} />
        )}
      </div>
      <div className="flex w-full flex-col gap-4 px-4">
        <ButtonBar>
          <PlaidLink />
        </ButtonBar>
        {accountData.data &&
          accountCategories.map((category) => (
            <AccountCategoriesList
              key={category}
              category={category}
              data={accountData.data.categories[category]}
              open={open}
              setOpen={(category) => handleOpen(category)}
            />
          ))}
        {!accountData.data &&
          accountCategories.map((category) => (
            <AccountCategorySkeleton key={category} category={category} />
          ))}
      </div>
    </Page>
  );
}
