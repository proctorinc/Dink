import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Transaction from "~/features/transactions";
import Header from "~/components/ui/Header";
import Spinner from "~/components/ui/Spinner";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import { api } from "~/utils/api";

const AccountPage = () => {
  const router = useRouter();
  const ctx = api.useContext();
  const { data: sessionData } = useSession();
  const { accountId } = router.query;
  const strAccountId = typeof accountId === "string" ? accountId : null;
  const accountData = api.bankAccounts.getById.useQuery({
    accountId: strAccountId ?? "",
  });
  const addMockTransaction = api.mockData.addMockTransaction.useMutation({
    onSuccess: () => ctx.invalidate(),
  });

  if (accountData.isLoading) {
    return <Spinner />;
  }

  return (
    <>
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
        <button
          className="flex h-fit w-fit items-center gap-2 rounded-lg bg-secondary-med py-2 px-5 font-bold text-secondary-dark hover:bg-secondary-light hover:text-secondary-med hover:ring hover:ring-secondary-med group-hover:text-secondary-light"
          disabled={!sessionData?.user && typeof accountId !== "string"}
          onClick={() => {
            if (sessionData?.user && typeof accountId === "string") {
              void addMockTransaction.mutate({
                accountId,
                userId: sessionData?.user.id,
              });
            }
          }}
        >
          <FontAwesomeIcon className="h-4 w-4" icon={faPlus} />
          <span>Transaction</span>
        </button>
      </div>
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
    </>
  );
};

export default AccountPage;
