import { faBuildingColumns } from "@fortawesome/free-solid-svg-icons";
import { type InstitutionSyncItem, type BankAccount } from "@prisma/client";
import Image from "next/image";
import { type FC } from "react";
import { IconButton } from "~/components/ui/Button";
import { formatToCurrency } from "~/utils";

type AccountProps = {
  data: BankAccount & {
    institution: {
      id: string;
      name: string | null;
      logo: string | null;
      url: string | null;
      primaryColor: string | null;
      userId: string;
      syncItem: InstitutionSyncItem | null;
    };
  };
};

const Account: FC<AccountProps> = ({ data: account }) => {
  return (
    <div className="border-b border-gray-300 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!account?.institution?.logo && !account?.institution?.url && (
            <div className="flex aspect-square h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary-dark shadow-xl">
              <IconButton icon={faBuildingColumns} />
            </div>
          )}
          {account?.institution.logo && (
            <Image
              className="h-8 w-8 rounded-full shadow-xl"
              width={100}
              height={100}
              src={`data:image/jpeg;base64,${
                account?.institution?.logo?.toString() ?? ""
              }`}
              alt="logo"
            />
          )}
          {!account?.institution.logo && account.institution.url && (
            <Image
              className="h-8 w-8 rounded-full bg-white shadow-xl"
              width={100}
              height={100}
              src={`https://s2.googleusercontent.com/s2/favicons?domain=${account.institution.url}&sz=256`}
              alt="institution-image"
            />
          )}
          <div className="grow">
            <h3 className="text-sm">{account?.name}</h3>
            <span className="text-sm text-gray-500 group-hover:text-primary-med">
              {account?.mask} | {account?.institution.name}
            </span>
          </div>
        </div>
        <span className="text-gray-600 group-hover:text-primary-med">
          {formatToCurrency(account?.current)}
        </span>
      </div>
    </div>
  );
};

export default Account;
