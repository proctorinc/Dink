import {
  faCalendarAlt,
  faPiggyBank,
  faRedo,
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
  const categorizeTransaction =
    api.transactions.categorizeTransaction.useMutation({
      onSuccess: () => ctx.invalidate(),
    });

  const current = uncategorizedTransactions?.data
    ? uncategorizedTransactions?.data[0]
    : null;

  const selectById = (sourceId: string) => {
    categorizeTransaction.mutate({
      id: current?.id ?? "",
      type,
      sourceId,
    });
    setType(null);
  };

  return (
    <>
      <Header back title="Categorize" />

      <div className="flex w-full flex-col gap-2">
        <h2 className="text-left text-xl text-primary-light">Transaction:</h2>
        {!!uncategorizedTransactions.data && (
          <NoSourceTransaction data={uncategorizedTransactions.data[0]} />
        )}
      </div>
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
        </Card.Collapse>
        <Card.Collapse
          open={type === "budget"}
          className="max-h-64 overflow-y-scroll rounded-xl"
        >
          {budgetData?.data?.budgets.map((budget) => (
            <Budget
              key={budget.id}
              data={budget}
              onClick={() => selectById(budget.id)}
            />
          ))}
        </Card.Collapse>
        <Card.Collapse
          open={type === "fund"}
          className="max-h-64 overflow-y-scroll rounded-xl"
        >
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
        title="Undo"
        icon={faRedo}
        active
        disabled={!type}
        onClick={() => setType(null)}
      />
    </>
  );
};

export default CategorizePage;
