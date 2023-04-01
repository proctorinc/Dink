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
      {/* <div className="h-64 w-full rounded-xl bg-gradient-to-t from-secondary-dark to-secondary-med"></div> */}
      <TransactionsSummary />
      <BudgetSummary />
      <FundsSummary />
      <AccountSummary />
      <CreditCardSummary />
    </>
  );
}
