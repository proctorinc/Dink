import { api } from "~/utils/api";
import Header from "~/components/ui/Header";
import useNotifications from "~/hooks/useNotifications";
import { Institution } from "~/features/accounts";
import AuthPage from "~/components/routes/AuthPage";
import Head from "next/head";
import { PlaidLink } from "~/features/plaid";

export default function BankAccounts() {
  const { setErrorNotification } = useNotifications();
  const accountData = api.bankAccounts.getAllData.useQuery();
  const institutions = api.bankAccounts.getInstitutions.useQuery(undefined, {
    onError: () => setErrorNotification("Failed to fetch Institutions"),
  });

  return (
    <AuthPage>
      <Head>
        <title>Accounts</title>
      </Head>
      <main className="flex h-full min-h-screen flex-col items-center text-white">
        <div className="container flex max-w-md flex-grow flex-col items-center justify-center gap-12 pt-5 sm:pb-4 lg:max-w-2xl">
          <div className="flex w-full flex-grow flex-col items-center gap-4">
            <div className="flex w-full flex-col gap-4 px-4">
              <Header
                title="Manage Accounts"
                subtitle={`${accountData?.data?.count ?? 0} Accounts linked`}
              />
            </div>
            <div className="flex w-full flex-grow flex-col gap-4 rounded-t-2xl bg-gray-100 p-4 pb-20 font-bold text-black">
              <h3 className="pl-2">Linked Accounts</h3>
              <div className="grid grid-cols-1 overflow-clip rounded-xl border border-gray-300 bg-white shadow-md lg:grid-cols-2">
                {institutions?.data &&
                  institutions.data.map((institution) => (
                    <Institution key={institution.id} data={institution} />
                  ))}
                <div className="flex items-center gap-2 bg-gray-100 p-4 text-sm text-gray-600">
                  <PlaidLink />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AuthPage>
  );
}
