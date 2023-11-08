import { useState } from "react";
import { accountCategories, type AccountCategory } from "~/config";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";
import Header from "~/components/ui/Header";
import Button from "~/components/ui/Button";
import { LineChart } from "~/components/ui/Charts";
import Page from "~/components/ui/Page";
import { PlaidLink } from "~/features/plaid";
import useNotifications from "~/hooks/useNotifications";
import {
  AccountCategoriesList,
  AccountCategorySkeleton,
  Institution,
  InstitutionSkeletons,
} from "~/features/accounts";
import { TextSkeleton } from "~/components/ui/Skeleton";
import { useSession } from "next-auth/react";
import { Notification } from "~/components/ui/Notification/Notification";

export default function BankAccounts() {
  const { data: sessionData } = useSession();
  const [open, setOpen] = useState("");
  const { setErrorNotification } = useNotifications();
  const [isAccountsTab, setisAccountsTab] = useState(true);

  const accountData = api.bankAccounts.getAllData.useQuery(undefined, {
    onError: () => setErrorNotification("Failed to fetch accounts"),
  });
  const institutions = api.bankAccounts.getInstitutions.useQuery(undefined, {
    onError: () => setErrorNotification("Failed to fetch Institutions"),
  });

  const handleOpen = (type: AccountCategory) => {
    setOpen((prev) => (prev === type ? "" : type));
  };

  return (
    <Page auth title="Accounts" style="basic">
      {sessionData?.user.role === "demo" && (
        <div className="w-full px-3">
          <Notification
            type="info"
            message="Only sample accounts are available for the demo"
          />
        </div>
      )}
      <div className="flex w-full justify-center gap-2">
        <Button
          title="Accounts"
          className="text-primary-light"
          style={isAccountsTab ? "invisible" : "primary"}
          noShadow={isAccountsTab}
          onClick={() => setisAccountsTab(true)}
        />
        <Button
          title="Institutions"
          className="text-primary-light"
          style={isAccountsTab ? "primary" : "invisible"}
          noShadow={!isAccountsTab}
          onClick={() => setisAccountsTab(false)}
        />
      </div>
      {isAccountsTab && (
        <>
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
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
            </div>
            {!accountData.data &&
              accountCategories.map((category) => (
                <AccountCategorySkeleton key={category} category={category} />
              ))}
          </div>
        </>
      )}
      {!isAccountsTab && (
        <div className="flex w-full flex-col gap-4 px-4">
          <Header
            title="Institutions"
            subtitle={
              accountData.data ? (
                `${accountData.data?.count} linked accounts`
              ) : (
                <TextSkeleton width={200} size="xl" color="primary" />
              )
            }
          />
          <PlaidLink style="secondary" />
          {institutions?.data &&
            institutions.data.map((institution) => (
              <Institution key={institution.id} data={institution} />
            ))}
          {!institutions.data && <InstitutionSkeletons />}
        </div>
      )}
    </Page>
  );
}
