import { useSession } from "next-auth/react";
import Header from "~/components/ui/Header";
import { formatToMonthYear } from "~/utils";
import { BudgetSummary } from "~/features/budgets";
import { TransactionsSummary } from "~/features/transactions";
import { SavingsSummary } from "~/features/funds";
import { AccountSummary, CreditCardSummary } from "~/features/accounts";
import Page from "~/components/ui/Page";

export default function Home() {
  const { data: sessionData } = useSession();

  return (
    <Page auth title="Home">
      <Header
        title={`Hi, ${sessionData?.user?.nickname ?? ""}`}
        subtitle={formatToMonthYear(new Date())}
      />
      <TransactionsSummary />
      <BudgetSummary />
      <SavingsSummary />
      <AccountSummary />
      <CreditCardSummary />
    </Page>
  );
}
