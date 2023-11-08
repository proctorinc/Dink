import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type BankAccount } from "@prisma/client";
import { type MouseEventHandler, type FC } from "react";
import { formatToCurrency } from "~/utils";

type AccountManageProps = {
  data: BankAccount;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export const AccountManage: FC<AccountManageProps> = ({
  data: account,
  onClick,
}) => {
  return (
    <div className="border-b border-gray-300 bg-gray-100 p-4" onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grow">
            <h3 className="text-sm">{account?.name}</h3>
            <span className="text-sm text-gray-500 group-hover:text-primary-med">
              ...{account?.mask}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6 text-gray-600">
          <span className="group-hover:text-primary-med">
            {formatToCurrency(account?.current)}
          </span>
          <FontAwesomeIcon icon={faEllipsisVertical} size="sm" />
        </div>
      </div>
    </div>
  );
};
