import { faBuildingColumns } from "@fortawesome/free-solid-svg-icons";
import { type InstitutionSyncItem, type BankAccount } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { type FC } from "react";
import { IconButton } from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import { formatToCurrency, formatToTitleCase } from "~/utils";

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
  invisible?: boolean;
};

const Account: FC<AccountProps> = ({ data: account, invisible }) => {
  const router = useRouter();

  return (
    <Card
      onClick={() => void router.push(`/accounts/${account?.id ?? ""}`)}
      noShadow
      invisible={invisible}
    >
      <Card.Body horizontal>
        <Card.Group horizontal>
          {!account?.institution?.logo && !account?.institution?.url && (
            <div className="flex aspect-square h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary-dark shadow-xl">
              <IconButton icon={faBuildingColumns} />
            </div>
          )}
          {account?.institution.logo && (
            <Image
              className="w-10 rounded-full shadow-xl"
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
              className="w-10 rounded-full bg-white shadow-xl"
              width={100}
              height={100}
              src={`https://s2.googleusercontent.com/s2/favicons?domain=${account.institution.url}&sz=256`}
              alt="institution-image"
            />
          )}
          <Card.Group size="sm" className="grow">
            <h3 className="text-md">{account?.name}</h3>
            <span className="text-sm text-primary-light group-hover:text-primary-med">
              {formatToTitleCase(account?.subtype, true)} - {account?.mask}
            </span>
          </Card.Group>
        </Card.Group>
        <span className="text-lg text-primary-light group-hover:text-primary-med">
          {formatToCurrency(account?.current)}
        </span>
      </Card.Body>
    </Card>
  );
};

export default Account;
