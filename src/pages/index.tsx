import { useSession } from "next-auth/react";
import Header from "~/components/ui/Header";
import { formatToMonthYear } from "~/utils";
import { BudgetSummary } from "~/features/budgets";
import { TransactionsSummary } from "~/features/transactions";
import { FundsSummary } from "~/features/funds";
import { AccountSummary, CreditCardSummary } from "~/features/accounts";

export default function Home() {
  const { data: sessionData } = useSession();

  return (
    <>
      <Header
        title={`Hi, ${sessionData?.user?.nickname ?? ""}`}
        subtitle={formatToMonthYear(new Date())}
      />
      <TransactionsSummary />
      <BudgetSummary />
      <FundsSummary />
      <AccountSummary />
      <CreditCardSummary />
    </>
  );
}
