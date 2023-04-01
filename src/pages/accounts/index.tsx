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
import { faGear, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ButtonBar } from "~/components/ui/Button";
import Button from "~/components/ui/Button/Button";
import Card from "~/components/ui/Card";

export default function BankAccounts() {
  const router = useRouter();
  const [open, setOpen] = useState("");
  const accountData = api.bankAccounts.getAllData.useQuery();

  const handleOpen = (type: AccountCategory) => {
    setOpen((prev) => (prev === type ? "" : type));
  };

  return (
    <>
      <Header
        title="Accounts"
        subtitle={`Net worth: ${formatToCurrency(accountData.data?.total)}`}
      />

      {/* Chart block component */}
      <div className="h-52 w-full rounded-xl bg-gradient-to-t from-secondary-dark to-secondary-med"></div>

      <ButtonBar>
        <Button icon={faGear} />
        <Button icon={faPlus} title="Account" active />
      </ButtonBar>

      {accountCategories.map((category) => (
        <Card key={category}>
          <Card.Header style="xl" onClick={() => handleOpen(category)}>
            <div className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-secondary-dark group-hover:bg-secondary-med">
                <FontAwesomeIcon
                  className="text-secondary-med group-hover:text-secondary-light"
                  size="lg"
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
          </Card.Header>
          <Card.Collapse open={open === category}>
            <div className="flex flex-col">
              {accountData.data?.categories[category].accounts.map(
                (account) => (
                  <Card
                    key={account.id}
                    onClick={() => void router.push(`/accounts/${account.id}`)}
                  >
                    <Card.Body horizontal>
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
                    </Card.Body>
                  </Card>
                )
              )}
            </div>
          </Card.Collapse>
        </Card>
      ))}
    </>
  );
}
