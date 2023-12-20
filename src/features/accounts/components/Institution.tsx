import {
  faAngleDown,
  faAngleUp,
  faArrowRight,
  faBuildingColumns,
  faChainBroken,
  faRefresh,
  faToggleOn,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type InstitutionSyncItem, type BankAccount } from "@prisma/client";
import Image from "next/image";
import React, { type FC, useState } from "react";
import Button, { IconButton } from "~/components/ui/Button";
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
      <div key={institution.id}>
        <div
          className="flex items-center justify-between border-b border-gray-300 p-4"
          onClick={toggleSettingsOpen}
        >
          <div className="flex gap-2">
            {!institution?.logo && !institution?.url && (
              <div className="flex aspect-square h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary-dark shadow-xl">
                <IconButton icon={faBuildingColumns} />
              </div>
            )}
            {institution.logo && (
              <Image
                className="h-10 w-10 rounded-full border shadow-xl"
                style={{ borderColor: institution.primaryColor ?? "#FFF" }}
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
                className="h-10 w-10 rounded-full border bg-white shadow-xl"
                style={{ borderColor: institution.primaryColor ?? "#FFF" }}
                width={100}
                height={100}
                src={`https://s2.googleusercontent.com/s2/favicons?domain=${institution.url}&sz=256`}
                alt="institution-image"
              />
            )}
            <div>
              <h3>{institution.name}</h3>
              <h3 className="text-sm font-normal group-hover:text-primary-med">
                {institution.linkedAccounts.length} Linked
              </h3>
            </div>
          </div>
          <FontAwesomeIcon
            icon={settingsOpen ? faAngleUp : faAngleDown}
            className="group-hover:text-primary-med"
          />
        </div>
        <div className={settingsOpen ? "flex flex-col" : "hidden"}>
          <div className="flex items-center gap-2 border-b border-gray-300 bg-gray-100 p-4 text-sm">
            <Button icon={faChainBroken} style="danger" title="Unlink All" />
            {/* <Button icon={faRefresh} style="secondary" title="Fix Connection" /> */}
          </div>
          {institution.linkedAccounts.map((account) => (
            <AccountManage
              key={account.id}
              data={account}
              onClick={() => setSelectedAccount(account)}
            />
          ))}
        </div>
      </div>
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
          <div onClick={() => console.log("ok")}>
            <div className="justify-between">
              <h3 className="text-primary-light">Setting #1</h3>
              <IconButton icon={faToggleOn} noShadow />
            </div>
          </div>
          <div onClick={() => console.log("ok")}>
            <div className="justify-between">
              <h3 className="text-primary-light">Setting #2</h3>
              <IconButton icon={faToggleOn} noShadow />
            </div>
          </div>
          <div onClick={() => console.log("ok")}>
            <div className="justify-between">
              <h3 className="text-primary-light">Setting #3</h3>
              <IconButton icon={faToggleOn} noShadow />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
