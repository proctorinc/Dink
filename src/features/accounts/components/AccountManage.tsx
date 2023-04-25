import { faGear, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { type BankAccount } from "@prisma/client";
import { type FC } from "react";
import { IconButton } from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import { formatToCurrency, formatToTitleCase } from "~/utils";

type AccountManageProps = {
  data: BankAccount;
};

export const AccountManage: FC<AccountManageProps> = ({ data: account }) => {
  return (
    <Card noShadow onClick={() => console.log("Account Settings Modal")}>
      <Card.Body horizontal>
        <Card.Group horizontal className="w-full">
          <Card.Group size="sm" className="grow">
            <h3 className="font-bold">{account?.name}</h3>
            <span className="text-sm text-primary-light group-hover:text-primary-med">
              {formatToTitleCase(account?.subtype, true)} - {account?.mask}
            </span>
          </Card.Group>
        </Card.Group>
        <Card.Group horizontal>
          <span className="text-lg text-primary-light group-hover:text-primary-med">
            {formatToCurrency(account?.current)}
          </span>
          <IconButton icon={faGear} noShadow size="sm" />
        </Card.Group>
      </Card.Body>
    </Card>
  );
};
