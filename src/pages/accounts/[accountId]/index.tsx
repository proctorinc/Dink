import {
  faAngleUp,
  faBuildingColumns,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import Transaction from "~/features/transactions";
import Header from "~/components/ui/Header";
import Spinner from "~/components/ui/Spinner";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import { api } from "~/utils/api";
import Button, { ButtonBar, IconButton } from "~/components/ui/Button";
import { useState } from "react";
import ConfirmDelete from "~/components/ui/ConfirmDelete";
import Page from "~/components/ui/Page";
import Image from "next/image";

const AccountPage = () => {
  const router = useRouter();
  const ctx = api.useContext();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { accountId } = router.query;
  const strAccountId = typeof accountId === "string" ? accountId : null;
  const accountData = api.bankAccounts.getById.useQuery({
    accountId: strAccountId ?? "",
  });
  const institutionQuery = api.plaid.getInstitution.useQuery(
    {
      institutionId: accountData.data?.item.institutionId ?? "",
    },
    {
      enabled: !!accountData.data?.item.institutionId,
    }
  );
  const deleteAccount = api.bankAccounts.delete.useMutation({
    onSuccess: () => void ctx.invalidate(),
  });

  const handleDeleteAccount = () => {
    deleteAccount.mutate({ accountId: accountData?.data?.id ?? "" });
    void router.push("/accounts");
  };

  if (accountData.isLoading) {
    return <Spinner />;
  }

  const Icon = () => {
    return (
      <>
        {!institutionQuery.data && (
          <div className="flex aspect-square h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-primary-light bg-primary-dark">
            <IconButton size="xs" icon={faBuildingColumns} />
          </div>
        )}
        {!!institutionQuery.data?.logo && (
          <Image
            className="h-10 w-10 rounded-full border border-primary-light"
            width={100}
            height={100}
            src={`data:image/jpeg;base64,${institutionQuery.data.logo}`}
            alt="user-image"
          />
        )}
        {!institutionQuery.data?.logo && !!institutionQuery.data?.url && (
          <Image
            className="h-10 w-10 rounded-full border border-primary-light"
            width={100}
            height={100}
            src={`https://s2.googleusercontent.com/s2/favicons?domain=${institutionQuery.data.url}&sz=256`}
            alt="user-image"
          />
        )}
      </>
    );
  };

  return (
    <Page auth title="Account">
      <Header
        back
        title={
          <div className="flex gap-2">
            <Icon />
            <h3>{accountData?.data?.name}</h3>
          </div>
        }
        subtitle={`Total: ${formatToCurrency(accountData?.data?.current)}`}
      />
      <div className="flex w-full flex-col gap-2">
        {accountData?.data?.official_name && (
          <span className="flex h-fit w-fit items-center rounded-lg bg-primary-med px-2 py-1 text-xs font-bold text-primary-light">
            {accountData?.data?.official_name}
          </span>
        )}
        <span className="text-md text-primary-light">
          {formatToTitleCase(accountData?.data?.type)} /{" "}
          {formatToTitleCase(accountData?.data?.subtype)} /{" "}
          {accountData?.data?.mask}
        </span>
      </div>
      <ButtonBar>
        <Button
          icon={settingsOpen ? faAngleUp : faGear}
          onClick={() => setSettingsOpen((prev) => !prev)}
        />
      </ButtonBar>
      {settingsOpen && (
        <ButtonBar>
          <ConfirmDelete
            confirmationText={accountData?.data?.name ?? "delete account"}
            onDelete={handleDeleteAccount}
          />
        </ButtonBar>
      )}
      <div className="w-full">
        <h2 className="text-left text-xl text-primary-light">Transactions</h2>
      </div>
      {!accountData?.data?.transactions.length && (
        <div className="group flex w-full items-center justify-between rounded-xl bg-primary-med px-4 py-2">
          None
        </div>
      )}
      <div className="flex w-full flex-col gap-3">
        {accountData.data &&
          accountData.data.transactions.map((transaction) => (
            <Transaction key={transaction.id} data={transaction} />
          ))}
      </div>
    </Page>
  );
};

export default AccountPage;
