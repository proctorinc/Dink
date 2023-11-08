import {
  faAngleDown,
  faAngleUp,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type InstitutionSyncItem, type BankAccount } from "@prisma/client";
import { type Decimal } from "@prisma/client/runtime/library";
import { useRouter } from "next/router";
import { type FC } from "react";
import { IconButton } from "~/components/ui/Button";
import { AccountCategory, AccountCategoryIcons } from "~/config";
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
  const router = useRouter();

  return (
    <div
      className={
        category === AccountCategory.Loan
          ? "text-black"
          : "border-b border-gray-300 text-black"
      }
      key={category}
    >
      <div
        className="flex items-center justify-between p-2"
        onClick={() => setOpen(category)}
      >
        <div className="flex items-center">
          <div className="p-2 text-gray-500">
            <IconButton
              style="secondary"
              size="sm"
              icon={AccountCategoryIcons[category]}
            />
          </div>
          <h3>
            {category === AccountCategory.Cash
              ? "Cash"
              : formatToTitleCase(category)}
          </h3>
        </div>
        <div className="flex gap-2 p-2">
          <span className="group-hover:text-primary-med">
            {formatToCurrency(data.total)}
          </span>
          <div className="text-gray-600">
            <FontAwesomeIcon
              icon={open === category ? faAngleUp : faAngleDown}
            />
          </div>
        </div>
      </div>
      <div
        className={
          open === category
            ? "flex flex-col border-t border-gray-300 bg-gray-100"
            : "hidden"
        }
      >
        {data.accounts.map((account) => (
          <Account key={account.id} data={account} />
        ))}
        {data.accounts.length === 0 && (
          <div className="flex items-center gap-2 bg-gray-100 p-4 text-sm text-gray-600">
            <span onClick={() => void router.push("/accounts/manage")}>
              Manage Accounts
            </span>
            <FontAwesomeIcon icon={faArrowRight} size="sm" />
          </div>
        )}
      </div>
    </div>
  );
};
