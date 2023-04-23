import { useRouter } from "next/router";

const useNavigate = () => {
  const router = useRouter();

  return {
    toHome: () => router.push("/"),
    toProfile: () => router.push("/profile"),
    toBudgets: () => router.push("/budget"),
    toFunds: () => router.push("/savings"),
    toFund: (fundId: string) => router.push(`savings/${fundId}`),
    toAccounts: () => router.push("/accounts"),
    toAccount: (accountId: string) => router.push(`/accounts/${accountId}`),
    toTransactions: () => router.push("/transactions"),
    toCategorizeTransactions: () => router.push("/transactions/categorize"),
  };
};

export default useNavigate;
