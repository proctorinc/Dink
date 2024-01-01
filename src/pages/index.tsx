import { useSession } from "next-auth/react";
import { accountCategories, type AccountCategory } from "~/config";
import Head from "next/head";
import AuthPage from "~/components/routes/AuthPage";
import Header from "~/components/ui/Header";
import { AccountCategoriesList } from "~/features/accounts";
import useNotifications from "~/hooks/useNotifications";
import { formatToMonthYear } from "~/utils";
import { api } from "~/utils/api";
import { useState } from "react";
import Transaction, {
  TransactionsSummary,
  TransactionsSummarySkeleton,
} from "~/features/transactions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faGear } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { SavingsSummary, SavingsSummarySkeleton } from "~/features/funds";

export default function Home() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { setErrorNotification } = useNotifications();
  const [openAccount, setOpenAccount] = useState("");
  const [openTransaction, setOpenTransaction] = useState("");
  const accountData = api.bankAccounts.getAllData.useQuery(undefined, {
    onError: () => setErrorNotification("Failed to fetch accounts"),
  });
  const syncInstitutions = api.plaid.syncInstitutions.useQuery();
  const transactionData = api.transactions.search.useQuery(
    {
      filterMonthly: false,
      includeSavings: false,
      includeCategorized: true,
      includeUncategorized: true,
      includeIncome: true,
      size: 5,
    },
    {
      onError: () => setErrorNotification("Failed to fetch transactions"),
    }
  );
  const savingsData = api.funds.getAllData.useQuery(undefined, {
    onError: () => setErrorNotification("Failed to fetch transactions"),
  });

  const handleOpenAccount = (type: AccountCategory) => {
    setOpenAccount((prev) => (prev === type ? "" : type));
  };
  const handleOpenTransaction = (transactionId: string) => {
    setOpenTransaction((prev) => (prev === transactionId ? "" : transactionId));
  };

  const dataIsLoaded = transactionData.isSuccess && savingsData.isSuccess;

  return (
    <AuthPage>
      <Head>
        <title>Home</title>
      </Head>
      <main className="flex h-full min-h-screen flex-col items-center text-white">
        <div className="container flex max-w-md flex-grow flex-col items-center justify-center gap-12 pt-5 sm:pb-4 lg:max-w-2xl">
          <div className="flex w-full flex-grow flex-col items-center gap-4">
            <div className="sticky top-20 z-10 flex w-full flex-col gap-4 px-4">
              <Header
                title={`Hi, ${sessionData?.user?.nickname ?? ""}`}
                subtitle={formatToMonthYear(new Date())}
              />
              {dataIsLoaded && (
                <>
                  <TransactionsSummary
                    data={transactionData.data.transactions}
                  />
                  <SavingsSummary data={savingsData.data} />
                </>
              )}
              {!dataIsLoaded && (
                <>
                  <TransactionsSummarySkeleton />
                  <SavingsSummarySkeleton />
                </>
              )}
            </div>
            <div className="z-20 flex w-full flex-grow flex-col gap-4 rounded-t-2xl bg-gray-100 p-4 pb-20 font-bold text-black">
              <div className="flex items-center justify-between px-2">
                <h3>Accounts</h3>
                <FontAwesomeIcon
                  icon={faGear}
                  size="sm"
                  onClick={() => void router.push("/accounts/manage")}
                />
              </div>
              <div className="grid grid-cols-1 overflow-clip rounded-xl border border-gray-300 bg-white shadow-md lg:grid-cols-2">
                {accountData.data &&
                  accountCategories.map((category) => (
                    <AccountCategoriesList
                      key={category}
                      category={category}
                      data={accountData.data.categories[category]}
                      open={openAccount}
                      setOpen={(category) => handleOpenAccount(category)}
                    />
                  ))}
              </div>
              <h3 className="pl-2">Recent Transactions</h3>
              <div className="grid grid-cols-1 overflow-clip rounded-xl border border-gray-300 bg-white shadow-md lg:grid-cols-2">
                {transactionData.data &&
                  transactionData.data.transactions.map((transaction) => (
                    <Transaction
                      key={transaction.id}
                      data={transaction}
                      open={openTransaction}
                      onClick={(transactionId) =>
                        handleOpenTransaction(transactionId)
                      }
                    />
                  ))}
                <div className="flex items-center justify-end gap-2 bg-gray-100 p-4 text-sm text-gray-600">
                  <span onClick={() => void router.push("/transactions")}>
                    View Transactions
                  </span>
                  <FontAwesomeIcon icon={faArrowRight} size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AuthPage>
  );
}
