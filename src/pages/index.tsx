import { useSession } from "next-auth/react";
import AccountSummary from "~/components/accounts/AccountSummary";
import CreditCardSummary from "~/components/accounts/CreditCardSummary";
import BudgetSummary from "~/components/budgets/BudgetSummary";
import FundsSummary from "~/components/funds/FundsSummary";
import TransactionsSummary from "~/components/transactions/TransactionsSummary";
import Header from "~/components/ui/Header";
import { formatToMonthYear } from "~/utils";

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
