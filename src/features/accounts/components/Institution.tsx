import {
  faAngleDown,
  faAngleUp,
  faBuildingColumns,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { type BankAccount } from "@prisma/client";
import Image from "next/image";
import React, { type FC, useState } from "react";
import { IconButton } from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import ConfirmDelete from "~/components/ui/ConfirmDelete";
import { AccountManage } from "./AccountManage";

type InstitutionProps = {
  data: {
    logo: string | null;
    id: string;
    name: string;
    url: string | null;
    primaryColor: string | null;
    userId: string;
    linkedAccounts: BankAccount[];
  };
};

export const Institution: FC<InstitutionProps> = ({ data: institution }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [accountsOpen, setAccountsOpen] = useState(false);

  const toggleAccountsOpen = () => {
    setAccountsOpen((prev) => !prev);
  };
  const toggleSettingsOpen = () => {
    setSettingsOpen((prev) => !prev);
  };

  return (
    <Card key={institution.id}>
      <Card.Header>
        <Card.Group horizontal>
          {!institution?.logo && !institution?.url && (
            <div className="flex aspect-square h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary-dark shadow-xl">
              <IconButton icon={faBuildingColumns} />
            </div>
          )}
          {institution.logo !== "null" && (
            <Image
              className="w-10 rounded-full shadow-xl"
              width={100}
              height={100}
              src={`data:image/jpeg;base64,${
                institution?.logo?.toString() ?? ""
              }`}
              alt="logo"
            />
          )}
          {institution.logo === "null" && institution.url && (
            <Image
              className="w-10 rounded-full bg-white shadow-xl"
              width={100}
              height={100}
              src={`https://s2.googleusercontent.com/s2/favicons?domain=${institution.url}&sz=256`}
              alt="institution-image"
            />
          )}
          <Card.Group size="sm">
            <h3>{institution.name}</h3>
            <h3 className="text-sm font-normal text-primary-light">
              {institution.linkedAccounts.length} Linked Account
              {institution.linkedAccounts.length === 1 ? "" : "s"}
            </h3>
          </Card.Group>
        </Card.Group>
        <IconButton
          icon={settingsOpen ? faAngleUp : faGear}
          noShadow
          size="sm"
          onClick={toggleSettingsOpen}
        />
      </Card.Header>
      <Card.Collapse open={settingsOpen}>
        <Card.Body>
          <h4 className="font-bold text-primary-light">Settings</h4>
          <ConfirmDelete
            confirmationText={`Delete my ${institution.name}`}
            onDelete={() => console.log("delete")}
          />
        </Card.Body>
      </Card.Collapse>
      <Card.Body>
        <div className="flex gap-1" onClick={toggleAccountsOpen}>
          <IconButton
            icon={accountsOpen ? faAngleUp : faAngleDown}
            size="xs"
            noShadow
          />
          <h3 className="w-full text-left text-sm font-bold text-primary-light">
            {accountsOpen ? "Hide" : "Show"} Accounts
          </h3>
        </div>
      </Card.Body>
      <Card.Collapse open={accountsOpen}>
        {institution.linkedAccounts.map((account) => (
          <AccountManage key={account.id} data={account} />
        ))}
      </Card.Collapse>
    </Card>
  );
};
