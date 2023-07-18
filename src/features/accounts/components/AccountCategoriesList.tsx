import { type InstitutionSyncItem, type BankAccount } from "@prisma/client";
import { type Decimal } from "@prisma/client/runtime/library";
import { type FC } from "react";
import { IconButton } from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import { AccountCategory, AccountCategoryIcons } from "~/config";
import { PlaidLink } from "~/features/plaid";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import Account from "./Account";

type AccountCategoriesListProps = {
  category: AccountCategory;
  data: {
    total: Decimal;
    accounts: (BankAccount & {
      institution: {
        id: string;
        name: string | null;
        logo: string | null;
        url: string | null;
        primaryColor: string | null;
        userId: string;
        syncItem: InstitutionSyncItem | null;
      };
    })[];
  };
  open: string;
  setOpen: (category: AccountCategory) => void;
};

export const AccountCategoriesList: FC<AccountCategoriesListProps> = ({
  category,
  data,
  open,
  setOpen,
}) => {
  return (
    <Card key={category}>
      <Card.Header size="xl" onClick={() => setOpen(category)}>
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
          {formatToCurrency(data.total)}
        </span>
      </Card.Header>
      <Card.Collapse open={open === category}>
        {data.accounts.map((account) => (
          <Account key={account.id} data={account} invisible />
        ))}
        {data.accounts.length === 0 && (
          <Card size="sm" noShadow>
            <Card.Body>
              <PlaidLink />
            </Card.Body>
          </Card>
        )}
      </Card.Collapse>
    </Card>
  );
};
