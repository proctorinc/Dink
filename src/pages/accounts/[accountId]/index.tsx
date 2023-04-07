import { faAngleUp, faGear, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Transaction from "~/features/transactions";
import Header from "~/components/ui/Header";
import Spinner from "~/components/ui/Spinner";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import { api } from "~/utils/api";
import Button, { ButtonBar } from "~/components/ui/Button";
import { useState } from "react";
import ConfirmDelete from "~/components/ui/ConfirmDelete";
import AuthPage from "~/components/routes/AuthPage";

const AccountPage = () => {
  const router = useRouter();
  const ctx = api.useContext();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { data: sessionData } = useSession();
  const { accountId } = router.query;
  const strAccountId = typeof accountId === "string" ? accountId : null;
  const accountData = api.bankAccounts.getById.useQuery({
    accountId: strAccountId ?? "",
  });
  const deleteAccount = api.bankAccounts.delete.useMutation({
    onSuccess: () => void ctx.invalidate(),
  });
  const addMockTransaction = api.mockData.addMockTransaction.useMutation({
    onSuccess: () => ctx.invalidate(),
  });

  const handleDeleteAccount = () => {
    deleteAccount.mutate({ accountId: accountData?.data?.id ?? "" });
    void router.push("/accounts");
  };

  if (accountData.isLoading) {
    return <Spinner />;
  }

  return (
    <AuthPage>
      <Header
        back
        title={accountData?.data?.name}
        subtitle={`Total: ${formatToCurrency(accountData?.data?.current)}`}
      />
      <div className="flex w-full flex-col gap-2">
        <span className="flex h-fit w-fit items-center rounded-lg bg-primary-med px-2 py-1 text-xs font-bold text-primary-light">
          {accountData?.data?.official_name}
        </span>
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
        <Button
          title="Transaction"
          icon={faPlus}
          style="secondary"
          onClick={() => {
            if (sessionData?.user && typeof accountId === "string") {
              void addMockTransaction.mutate({
                accountId,
                userId: sessionData?.user.id,
              });
            }
          }}
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
    </AuthPage>
  );
};

export default AccountPage;
