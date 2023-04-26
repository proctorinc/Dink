import {
  faCalendarAlt,
  faPiggyBank,
  faRedo,
  faSackDollar,
} from "@fortawesome/free-solid-svg-icons";
import { type FC, useMemo, useState } from "react";
import { useMonthContext } from "~/hooks/useMonthContext";
import { api } from "~/utils/api";
import { DetailedTransaction } from "~/features/transactions";
import Card from "~/components/ui/Card";
import Budget from "~/features/budgets";
import Fund from "~/features/funds";
import Button, { IconButton } from "~/components/ui/Button";
import { type Transaction, type TransactionSource } from "@prisma/client";
import Spinner from "~/components/ui/Spinner";

type CategorizeTransactionsProps = {
  transactions: (Transaction & {
    source:
      | (TransactionSource & {
          budget: Budget | null;
          fund: Fund | null;
        })
      | null;
  })[];
};

export const CategorizeTransactions: FC<CategorizeTransactionsProps> = ({
  transactions,
}) => {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<string | null>(null);
  const ctx = api.useContext();
  const fundsData = api.funds.getAllData.useQuery();
  const { startOfMonth, endOfMonth } = useMonthContext();
  const budgetData = api.budgets.getDataByMonth.useQuery({
    startOfMonth,
    endOfMonth,
  });
  const uncategorizedTransactions = useMemo(() => {
    return transactions.filter((transaction) => transaction.source === null);
  }, [transactions]);
  const categorizeAsBudget = api.transactions.categorizeAsBudget.useMutation({
    onSuccess: () => {
      setLoading(false);
      void ctx.invalidate();
    },
  });
  const categorizeAsFund = api.transactions.categorizeAsFund.useMutation({
    onSuccess: () => {
      setLoading(false);
      void ctx.invalidate();
    },
  });
  const categorizeAsIncome = api.transactions.categorizeAsIncome.useMutation({
    onSuccess: () => {
      setLoading(false);
      void ctx.invalidate();
    },
  });

  const current = uncategorizedTransactions
    ? uncategorizedTransactions[0]
    : null;

  const selectById = (sourceId: string) => {
    setLoading(true);
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
    setLoading(true);
    categorizeAsIncome.mutate({ id: current?.id ?? "" });
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!uncategorizedTransactions) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div>No Transactions</div>
      </div>
    );
  }

  return (
    <div className="flex h-96 flex-col items-center justify-center gap-4 overflow-y-scroll">
      <div className="flex w-full flex-col gap-2">
        {uncategorizedTransactions?.length > 0 &&
          uncategorizedTransactions[0] && (
            <DetailedTransaction data={uncategorizedTransactions[0]} />
          )}
      </div>
      {uncategorizedTransactions.length === 0 && (
        <Card noShadow>
          <Card.Header size="xl">No Transactions</Card.Header>
        </Card>
      )}
      {uncategorizedTransactions.length > 0 && (
        <div className="w-full">
          <Card noShadow>
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
              <Card noShadow onClick={() => setType("budget")}>
                <Card.Header size="xl">
                  <Card.Group horizontal>
                    <IconButton icon={faCalendarAlt} style="secondary" />
                    <h3>Budget</h3>
                  </Card.Group>
                </Card.Header>
              </Card>
              <Card noShadow onClick={selectIncome}>
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
                  noShadow
                  onClick={() => selectById(budget.id)}
                />
              ))}
            </Card.Collapse>
            <Card.Collapse open={type === "fund"} className="rounded-xl">
              {fundsData?.data?.funds.map((fund) => (
                <Fund
                  key={fund.id}
                  data={fund}
                  noShadow
                  onClick={() => selectById(fund.id)}
                />
              ))}
            </Card.Collapse>
          </Card>
          {type && (
            <Button
              title="Reselect"
              icon={faRedo}
              style="secondary"
              disabled={!type}
              onClick={() => setType(null)}
            />
          )}
        </div>
      )}
    </div>
  );
};
