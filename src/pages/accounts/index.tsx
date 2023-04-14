import { useState } from "react";
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
import { type Serie } from "@nivo/line";
import Page from "~/components/ui/Page";
import { PlaidLink } from "~/features/plaid";
import Account from "~/features/accounts";

export default function BankAccounts() {
  const [open, setOpen] = useState("");
  const accountData = api.bankAccounts.getAllData.useQuery();

  const handleOpen = (type: AccountCategory) => {
    setOpen((prev) => (prev === type ? "" : type));
  };

  const data: Serie[] = [
    {
      id: "Line",
      data: [
        { x: 1, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 3 },
        { x: 4, y: 2 },
        { x: 5, y: 5 },
        { x: 6, y: 6 },
        { x: 7, y: 8 },
        { x: 8, y: 5 },
        { x: 9, y: 9 },
        { x: 10, y: 9 },
      ],
    },
  ];

  return (
    <Page auth title="Accounts" style="basic">
      <div className="w-full px-4">
        <Header
          title="Accounts"
          subtitle={`Net worth: ${formatToCurrency(accountData.data?.total)}`}
        />
      </div>
      <div className="flex h-40 w-full flex-col">
        <LineChart data={data} />
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
