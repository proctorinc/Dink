import { useEffect, useState } from "react";
import {
  accountCategories,
  AccountCategory,
  AccountCategoryIcons,
} from "~/config";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import { api } from "~/utils/api";
import Header from "~/components/ui/Header";
import { ButtonBar, IconButton } from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import { LineChart } from "~/components/ui/Charts";
import Page from "~/components/ui/Page";
import { PlaidLink } from "~/features/plaid";
import Account from "~/features/accounts";
import useNotifications from "~/hooks/useNotifications";

export default function BankAccounts() {
  const [open, setOpen] = useState("");
  const { clearNotification, setErrorNotification, setLoadingNotification } =
    useNotifications();
  const accountData = api.bankAccounts.getAllData.useQuery(undefined, {
    onSuccess: () => clearNotification(),
    onError: () => setErrorNotification("Failed to fetch accounts"),
  });

  const handleOpen = (type: AccountCategory) => {
    setOpen((prev) => (prev === type ? "" : type));
  };

  useEffect(() => {
    if (accountData.isFetching) {
      setLoadingNotification("Loading Accounts...");
    }
  }, [accountData, setLoadingNotification]);

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
        {accountCategories.map((category) => (
          <Card key={category}>
            <Card.Header size="xl" onClick={() => handleOpen(category)}>
              <Card.Group size="xl" horizontal>
                <IconButton
                  icon={AccountCategoryIcons[category]}
                  size="sm"
                  iconSize="sm"
                  style="secondary"
                />
                <h3 className="text-lg font-bold">
                  {category === AccountCategory.Cash
                    ? "Cash"
                    : formatToTitleCase(category)}
                </h3>
              </Card.Group>
              <span className="text-lg font-bold text-primary-light group-hover:text-primary-med">
                {formatToCurrency(accountData.data?.categories[category].total)}
              </span>
            </Card.Header>
            <Card.Collapse open={open === category}>
              {accountData.data?.categories[category].accounts.map(
                (account) => (
                  <Account key={account.id} data={account} />
                )
              )}
              {accountData.data?.categories[category].accounts.length === 0 && (
                <Card size="sm">
                  <Card.Body>
                    <PlaidLink />
                  </Card.Body>
                </Card>
              )}
            </Card.Collapse>
          </Card>
        ))}
      </div>
    </Page>
  );
}
