import {
  faCalendarAlt,
  faPiggyBank,
  faRedo,
  faSackDollar,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useMonthContext } from "~/hooks/useMonthContext";
import Header from "~/components/ui/Header";
import { api } from "~/utils/api";
import { NoSourceTransaction } from "~/features/transactions";
import Card from "~/components/ui/Card";
import Budget from "~/features/budgets";
import Fund from "~/features/funds";
import Button, { IconButton } from "~/components/ui/Button";
import Spinner from "~/components/ui/Spinner";
import Page from "~/components/ui/Page";

const CategorizePage = () => {
  const [type, setType] = useState<string | null>(null);
  const ctx = api.useContext();
  const fundsData = api.funds.getAllData.useQuery();
  const { startOfMonth, endOfMonth } = useMonthContext();
  const budgetData = api.budgets.getDataByMonth.useQuery({
    startOfMonth,
    endOfMonth,
  });
  const uncategorizedTransactions =
    api.transactions.getUncategorized.useQuery();
  const categorizeAsBudget = api.transactions.categorizeAsBudget.useMutation({
    onSuccess: () => ctx.invalidate(),
  });
  const categorizeAsFund = api.transactions.categorizeAsFund.useMutation({
    onSuccess: () => ctx.invalidate(),
  });
  const categorizeAsIncome = api.transactions.categorizeAsIncome.useMutation({
    onSuccess: () => ctx.invalidate(),
  });

  const current = uncategorizedTransactions?.data
    ? uncategorizedTransactions?.data[0]
    : null;

  const selectById = (sourceId: string) => {
    if (type === "fund") {
      categorizeAsFund.mutate({
        transactionId: current?.id ?? "",
        fundId: sourceId,
      });
    } else if (type === "budget") {
      categorizeAsBudget.mutate({
        transactionId: current?.id ?? "",
        budgetId: sourceId,
      });
    }
    setType(null);
  };

  const selectIncome = () => {
    categorizeAsIncome.mutate({ id: current?.id ?? "" });
  };

  if (!uncategorizedTransactions.data) {
    return <Spinner />;
  }

  const test = uncategorizedTransactions?.data[0];
  console.log(test);

  return (
    <Page auth title="Categorize">
      <Header back title="Categorize" />
      <div className="flex w-full flex-col gap-2">
        <h2 className="text-left text-xl text-primary-light">Transaction:</h2>
        {uncategorizedTransactions?.data?.length > 0 &&
          uncategorizedTransactions?.data[0] && (
            <NoSourceTransaction data={uncategorizedTransactions?.data[0]} />
          )}
      </div>
      {uncategorizedTransactions.data.length === 0 && (
        <Card>
          <Card.Header size="xl">No Transactions</Card.Header>
        </Card>
      )}
      {uncategorizedTransactions.data.length > 0 && (
        <>
          <Card>
            <Card.Header>
              <h3>Choose a {type ?? "category"}:</h3>
            </Card.Header>
            <Card.Collapse open={!type}>
              <Card onClick={() => setType("fund")}>
                <Card.Header size="xl">
                  <Card.Group horizontal>
                    <IconButton icon={faPiggyBank} style="secondary" />
                    <h3>Fund</h3>
                  </Card.Group>
                </Card.Header>
              </Card>
              <Card onClick={() => setType("budget")}>
                <Card.Header size="xl">
                  <Card.Group horizontal>
                    <IconButton icon={faCalendarAlt} style="secondary" />
                    <h3>Budget</h3>
                  </Card.Group>
                </Card.Header>
              </Card>
              <Card onClick={selectIncome}>
                <Card.Header size="xl">
                  <Card.Group horizontal>
                    <IconButton icon={faSackDollar} style="secondary" />
                    <h3>Income</h3>
                  </Card.Group>
                </Card.Header>
              </Card>
            </Card.Collapse>
            <Card.Collapse open={type === "budget"} className="rounded-xl">
              {budgetData?.data?.spending.budgets.map((budget) => (
                <Budget
                  key={budget.id}
                  data={budget}
                  onClick={() => selectById(budget.id)}
                />
              ))}
            </Card.Collapse>
            <Card.Collapse open={type === "fund"} className="rounded-xl">
              {fundsData?.data?.funds.map((fund) => (
                <Fund
                  key={fund.id}
                  data={fund}
                  onClick={() => selectById(fund.id)}
                />
              ))}
            </Card.Collapse>
          </Card>
          <Button
            title="Reselect"
            icon={faRedo}
            style="secondary"
            disabled={!type}
            onClick={() => setType(null)}
          />
        </>
      )}
    </Page>
  );
};

export default CategorizePage;
