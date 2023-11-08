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
import Transaction, { TransactionsSummary } from "~/features/transactions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faGear } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import Button from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import { SavingsSummary } from "~/features/funds";

export default function Home() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { setErrorNotification } = useNotifications();
  const [open, setOpen] = useState("");
  const accountData = api.bankAccounts.getAllData.useQuery(undefined, {
    onError: () => setErrorNotification("Failed to fetch accounts"),
  });
  const transactionData = api.transactions.getAll.useQuery(undefined, {
    onError: () => setErrorNotification("Failed to fetch transactions"),
  });
  const savingsData = api.funds.getAllData.useQuery(undefined, {
    onError: () => setErrorNotification("Failed to fetch transactions"),
  });

  const handleOpen = (type: AccountCategory) => {
    setOpen((prev) => (prev === type ? "" : type));
  };

  return (
    <AuthPage>
      <Head>
        <title>Home</title>
      </Head>
      <main className="flex h-full min-h-screen flex-col items-center text-white">
        <div className="container flex max-w-md flex-grow flex-col items-center justify-center gap-12 pt-5 sm:pb-4 lg:max-w-2xl">
          <div className="flex w-full flex-grow flex-col items-center gap-4">
            <div className="flex w-full flex-col gap-4 px-4">
              <Header
                title={`Hi, ${sessionData?.user?.nickname ?? ""}`}
                subtitle={formatToMonthYear(new Date())}
              />
              {/* <div className="flex w-full grid-cols-1 gap-4 overflow-x-scroll"></div> */}
              {/* <h3 className="text-primary-light">Needs Attention</h3> */}
              {transactionData.isSuccess && (
                <TransactionsSummary data={transactionData.data} />
              )}
              {savingsData.isSuccess && (
                <SavingsSummary data={savingsData.data} />
              )}
            </div>
            <div className="flex w-full flex-grow flex-col gap-4 rounded-t-2xl bg-gray-100 p-4 pb-20 font-bold text-black">
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
                      open={open}
                      setOpen={(category) => handleOpen(category)}
                    />
                  ))}
              </div>
              <h3 className="pl-2">Recent Transactions</h3>
              <div className="grid grid-cols-1 overflow-clip rounded-xl border border-gray-300 bg-white shadow-md lg:grid-cols-2">
                {transactionData.data &&
                  transactionData.data
                    .slice(0, 5)
                    .map((transaction) => (
                      <Transaction key={transaction.id} data={transaction} />
                    ))}
                <div className="flex items-center gap-2 bg-gray-100 p-4 text-sm text-gray-600">
                  <span onClick={() => void router.push("/transactions")}>
                    All Transactions
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
