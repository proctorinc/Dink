import {
  faAngleUp,
  faBuildingColumns,
  faGear,
  faToggleOn,
} from "@fortawesome/free-solid-svg-icons";
import { type InstitutionSyncItem, type BankAccount } from "@prisma/client";
import Image from "next/image";
import React, { type FC, useState } from "react";
import { IconButton } from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import ConfirmDelete from "~/components/ui/ConfirmDelete";
import Modal from "~/components/ui/Modal";
import Account from "./Account";
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
    syncItem: InstitutionSyncItem | null;
  };
};

export const Institution: FC<InstitutionProps> = ({ data: institution }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(
    null
  );

  const toggleSettingsOpen = () => {
    setSettingsOpen((prev) => !prev);
  };

  return (
    <>
      <Card key={institution.id}>
        <Card.Header size="xl" onClick={toggleSettingsOpen}>
          <Card.Group horizontal>
            {!institution?.logo && !institution?.url && (
              <div className="flex aspect-square h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary-dark shadow-xl">
                <IconButton icon={faBuildingColumns} />
              </div>
            )}
            {institution.logo && (
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
            {!institution.logo && institution.url && (
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
              <h3 className="text-sm font-normal text-primary-light group-hover:text-primary-med">
                {institution.linkedAccounts.length} Linked Account
                {institution.linkedAccounts.length === 1 ? "" : "s"}
              </h3>
            </Card.Group>
          </Card.Group>
          <IconButton
            icon={settingsOpen ? faAngleUp : faGear}
            className="group-hover:text-primary-med"
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
          {institution.linkedAccounts.map((account) => (
            <AccountManage
              key={account.id}
              data={account}
              onClick={() => setSelectedAccount(account)}
            />
          ))}
        </Card.Collapse>
      </Card>
      <Modal
        title="Manage Account"
        open={!!selectedAccount}
        onClose={() => setSelectedAccount(null)}
      >
        {!!selectedAccount && (
          <Account data={{ ...selectedAccount, institution }} />
        )}
        <div className="flex flex-col gap-2">
          <h1 className="text-left text-xl font-bold">Settings:</h1>
          <Card noShadow size="sm" onClick={() => console.log("ok")}>
            <Card.Group horizontal className="justify-between">
              <h3 className="text-primary-light">Setting #1</h3>
              <IconButton icon={faToggleOn} noShadow />
            </Card.Group>
          </Card>
          <Card noShadow size="sm" onClick={() => console.log("ok")}>
            <Card.Group horizontal className="justify-between">
              <h3 className="text-primary-light">Setting #2</h3>
              <IconButton icon={faToggleOn} noShadow />
            </Card.Group>
          </Card>
          <Card noShadow size="sm" onClick={() => console.log("ok")}>
            <Card.Group horizontal className="justify-between">
              <h3 className="text-primary-light">Setting #3</h3>
              <IconButton icon={faToggleOn} noShadow />
            </Card.Group>
          </Card>
        </div>
      </Modal>
    </>
  );
};
