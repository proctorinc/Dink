import { useState } from "react";
import { accountCategories, type AccountCategory } from "~/config";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";
import Header from "~/components/ui/Header";
import Button, { ButtonBar } from "~/components/ui/Button";
import { LineChart } from "~/components/ui/Charts";
import Page from "~/components/ui/Page";
import { PlaidLink } from "~/features/plaid";
import useNotifications from "~/hooks/useNotifications";
import {
  AccountCategoriesList,
  AccountCategorySkeleton,
} from "~/features/accounts";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { TextSkeleton } from "~/components/ui/Skeleton";

export default function BankAccounts() {
  const router = useRouter();
  const [open, setOpen] = useState("");
  const { setErrorNotification } = useNotifications();
  const accountData = api.bankAccounts.getAllData.useQuery(undefined, {
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
          subtitle={
            accountData.data ? (
              `Net worth: ${formatToCurrency(accountData.data?.total)}`
            ) : (
              <TextSkeleton width={250} size="xl" color="primary" />
            )
          }
        />
      </div>
      <div className="flex h-40 w-full flex-col">
        {accountData.data?.chartData && (
          <LineChart data={accountData.data.chartData} />
        )}
      </div>
      <div className="flex w-full flex-col gap-4 px-4">
        <ButtonBar>
          <Button
            icon={faGear}
            onClick={() => void router.push("/accounts/manage")}
          />
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
