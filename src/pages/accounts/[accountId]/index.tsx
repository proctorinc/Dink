import { faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "~/components/ui/Header";
import { formatToCurrency } from "~/utils";
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

  return (
    <>
      <div className="w-full">
        <FontAwesomeIcon
          icon={faArrowLeft}
          size="xl"
          onClick={() => void router.back()}
        />
      </div>
      <Header
        title={accountData?.data?.name}
        subtitle={formatToCurrency(accountData?.data?.current)}
      />
      <span>
        {accountData?.data?.official_name} {accountData?.data?.mask} |{" "}
        {accountData?.data?.type} : {accountData?.data?.subtype}
      </span>
      <button
        className="flex h-fit items-center gap-2 rounded-lg bg-secondary-med py-2 px-5 font-bold text-secondary-dark hover:bg-secondary-light hover:text-secondary-med hover:ring hover:ring-secondary-med group-hover:text-secondary-light"
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
        <span>Add Demo Transaction</span>
      </button>
      <h2 className="text-xl text-primary-light">Transactions</h2>
      {accountData.data &&
        accountData.data.transactions.map((transaction) => {
          return (
            <div
              key={transaction.id}
              className="group flex w-full cursor-pointer items-center justify-between rounded-xl bg-primary-med p-4 hover:bg-primary-light hover:text-primary-dark"
            >
              <span>{transaction.name}</span>
              <span>{formatToCurrency(transaction.amount)}</span>
              <span>{transaction.date.toLocaleDateString()}</span>
            </div>
          );
        })}
    </>
  );
};

export default AccountPage;
