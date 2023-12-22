import {
  faAngleDown,
  faAngleUp,
  faPlus,
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

  const handleOnClick = () => {
    if (data.accounts.length === 0) {
      void router.push("/accounts/manage");
    } else {
      setOpen(category);
    }
  };

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
        onClick={handleOnClick}
      >
        <div className="flex items-center">
          <div className="flex h-10 w-10 items-center justify-center p-2 text-primary-med">
            <FontAwesomeIcon icon={AccountCategoryIcons[category]} size="lg" />
          </div>
          <h3>
            {category === AccountCategory.Cash
              ? "Cash"
              : formatToTitleCase(category)}
          </h3>
        </div>
        {data.accounts.length > 0 && (
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
        )}
        {data.accounts.length === 0 && (
          <div className="flex items-center gap-2 px-2 text-sm text-gray-600">
            <span>Add</span>
            <FontAwesomeIcon icon={faPlus} />
          </div>
        )}
      </div>
      {data.accounts.length > 0 && (
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
        </div>
      )}
    </div>
  );
};
