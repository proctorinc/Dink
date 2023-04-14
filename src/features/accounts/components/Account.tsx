import { faBuildingColumns } from "@fortawesome/free-solid-svg-icons";
import { type PlaidItem, type BankAccount } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { type FC } from "react";
import { IconButton } from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import { formatToCurrency, formatToTitleCase } from "~/utils";

type AccountProps = {
  data:
    | (BankAccount & {
        item: PlaidItem & {
          institution: {
            id: string;
            itemId: string;
            name: string | null;
            logo: string | Buffer | null;
            url: string | null;
            primary_color: string | null;
          } | null;
        };
      })
    | null;
};

const Account: FC<AccountProps> = ({ data: account }) => {
  const router = useRouter();

  return (
    <Card onClick={() => void router.push(`/accounts/${account?.id ?? ""}`)}>
      <Card.Body horizontal>
        <Card.Group horizontal>
          {!account?.item.institution?.logo &&
            !account?.item.institution?.url && (
              <div className="flex aspect-square h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-primary-light bg-primary-dark">
                <IconButton icon={faBuildingColumns} />
              </div>
            )}
          {account?.item.institution?.logo !== "null" && (
            <Image
              className="w-10 rounded-full border border-primary-light"
              width={100}
              height={100}
              src={`data:image/jpeg;base64,${
                account?.item.institution?.logo?.toString() ?? ""
              }`}
              alt="logo"
            />
          )}
          {account?.item.institution?.logo === "null" &&
            account.item.institution?.url && (
              <Image
                className="w-10 rounded-full border border-primary-light bg-white"
                width={100}
                height={100}
                src={`https://s2.googleusercontent.com/s2/favicons?domain=${account.item.institution.url}&sz=256`}
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
