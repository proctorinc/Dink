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
      void ctx.invalidate();
    },
  });
  const categorizeAsFund = api.transactions.categorizeAsFund.useMutation({
    onSuccess: () => {
      void ctx.invalidate();
    },
  });
  const categorizeAsIncome = api.transactions.categorizeAsIncome.useMutation({
    onSuccess: () => {
      void ctx.invalidate();
    },
  });

  const current = uncategorizedTransactions
    ? uncategorizedTransactions[0]
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

  return (
    <div className="flex flex-col items-center justify-center gap-4 overflow-y-scroll">
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
              <Card size="sm" noShadow onClick={() => setType("fund")}>
                <Card.Body horizontal>
                  <Card.Group horizontal>
                    <IconButton icon={faPiggyBank} style="secondary" />
                    <h3 className="text-xl font-bold">Fund</h3>
                  </Card.Group>
                </Card.Body>
              </Card>
              <Card size="sm" noShadow onClick={() => setType("budget")}>
                <Card.Body horizontal>
                  <Card.Group horizontal>
                    <IconButton icon={faCalendarAlt} style="secondary" />
                    <h3 className="text-xl font-bold">Budget</h3>
                  </Card.Group>
                </Card.Body>
              </Card>
              <Card size="sm" noShadow onClick={selectIncome}>
                <Card.Body horizontal>
                  <Card.Group horizontal>
                    <IconButton icon={faSackDollar} style="secondary" />
                    <h3 className="text-xl font-bold">Income</h3>
                  </Card.Group>
                </Card.Body>
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
