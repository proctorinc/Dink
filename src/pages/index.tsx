import { useSession } from "next-auth/react";
import Header from "~/components/ui/Header";
import {
  formatToMonthYear,
  getFirstDayOfMonth,
  getLastDayOfMonth,
} from "~/utils";
import { BudgetSummary, BudgetSummarySkeleton } from "~/features/budgets";
import {
  TransactionsSummary,
  TransactionsSummarySkeleton,
} from "~/features/transactions";
import { SavingsSummary, SavingsSummarySkeleton } from "~/features/funds";
import {
  AccountSummary,
  AccountSummarySkeleton,
  CreditCardSummary,
} from "~/features/accounts";
import Page from "~/components/ui/Page";
import { api } from "~/utils/api";
import { CreditCardSummarySkeleton } from "~/features/accounts/components/CreditCardSummarySkeleton";

export default function Home() {
  const { data: sessionData } = useSession();
  const today = new Date();
  const startOfMonth = getFirstDayOfMonth(today);
  const endOfMonth = getLastDayOfMonth(today);

  const transactionData = api.transactions.getUncategorized.useQuery();
  const budgetData = api.budgets.getDataByMonth.useQuery({
    startOfMonth,
    endOfMonth,
  });
  const fundsData = api.funds.getAllData.useQuery();
  const accountData = api.bankAccounts.getAllData.useQuery();
  const creditAccounts = api.bankAccounts.getCreditAccounts.useQuery();

  return (
    <Page auth title="Home">
      <Header
        title={`Hi, ${sessionData?.user?.nickname ?? ""}`}
        subtitle={formatToMonthYear(new Date())}
      />
      {transactionData?.data && (
        <TransactionsSummary data={transactionData.data} />
      )}
      {!transactionData.data && <TransactionsSummarySkeleton />}
      {budgetData.data && <BudgetSummary data={budgetData.data} />}
      {!budgetData.data && <BudgetSummarySkeleton />}
      {fundsData.data && <SavingsSummary data={fundsData.data} />}
      {!fundsData.data && <SavingsSummarySkeleton />}
      {accountData.data && <AccountSummary data={accountData.data} />}
      {!accountData.data && <AccountSummarySkeleton />}
      {creditAccounts.data && <CreditCardSummary data={creditAccounts.data} />}
      {!creditAccounts.data && <CreditCardSummarySkeleton />}
    </Page>
  );
}
