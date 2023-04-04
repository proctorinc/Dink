import {
  faMagnifyingGlass,
  faSquareCheck,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/router";
import { useMonthContext } from "~/hooks/useMonthContext";
import Transaction from "~/features/transactions";
import Button, { ButtonBar } from "~/components/ui/Button";
import Header from "~/components/ui/Header";
import MonthYearSelector from "~/components/ui/MonthSelector";
import Spinner from "~/components/ui/Spinner";
import { api } from "~/utils/api";
import Card from "~/components/ui/Card";
import { useState } from "react";

const TransactionsPage = () => {
  const router = useRouter();
  const { month, year, startOfMonth, endOfMonth } = useMonthContext();
  const [filterMonthly, setFilterMonthly] = useState(true);
  const [includeSavings, setIncludeSavings] = useState(false);
  const [includeCategorized, setIncludeCategorized] = useState(true);
  const [includeUncategorized, setIncludeUncategorized] = useState(true);

  const transactionData = api.transactions.search.useQuery({
    filterMonthly,
    startOfMonth,
    endOfMonth,
    includeSavings,
    includeCategorized,
    includeUncategorized,
  });

  return (
    <>
      <Header title="Transactions" subtitle={`${month} ${year}`} />
      <ButtonBar>
        <Button title="Search" icon={faMagnifyingGlass} />
        <Button
          title="Categorize"
          icon={faTags}
          onClick={() => {
            void router.push("/transactions/categorize");
          }}
        />
      </ButtonBar>
      <div className="flex w-full flex-col gap-2">
        <div className="flex gap-2">
          <Button
            title="All"
            size="sm"
            icon={filterMonthly ? faSquare : faSquareCheck}
            active={!filterMonthly}
            onClick={() => setFilterMonthly(false)}
          />
          <Button
            title="Monthly"
            size="sm"
            icon={filterMonthly ? faSquareCheck : faSquare}
            active={filterMonthly}
            onClick={() => setFilterMonthly(true)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            title="Any"
            size="sm"
            icon={
              includeCategorized && includeSavings && includeUncategorized
                ? faSquareCheck
                : faSquare
            }
            active={
              includeCategorized && includeSavings && includeUncategorized
            }
            onClick={() => {
              if (
                includeCategorized &&
                includeSavings &&
                includeUncategorized
              ) {
                setIncludeCategorized(false);
                setIncludeSavings(false);
                setIncludeUncategorized(false);
              } else {
                setIncludeCategorized(true);
                setIncludeSavings(true);
                setIncludeUncategorized(true);
              }
            }}
          />
          <Button
            title="Savings"
            size="sm"
            icon={includeSavings ? faSquareCheck : faSquare}
            active={includeSavings}
            onClick={() => setIncludeSavings((prev) => !prev)}
          />
          <Button
            title="Categorized"
            size="sm"
            icon={includeCategorized ? faSquareCheck : faSquare}
            active={includeCategorized}
            onClick={() => setIncludeCategorized((prev) => !prev)}
          />
          <Button
            title="Uncategorized"
            size="sm"
            icon={includeUncategorized ? faSquareCheck : faSquare}
            active={includeUncategorized}
            onClick={() => setIncludeUncategorized((prev) => !prev)}
          />
        </div>
      </div>
      {filterMonthly && <MonthYearSelector />}
      <div className="flex w-full flex-col gap-3">
        {transactionData.isLoading && <Spinner />}
        {transactionData?.data?.length === 0 && (
          <Card>
            <Card.Header size="xl">
              <p>None</p>
            </Card.Header>
          </Card>
        )}
        {transactionData.data &&
          transactionData.isSuccess &&
          transactionData.data.map((transaction) => (
            <Transaction key={transaction.id} data={transaction} />
          ))}
      </div>
    </>
  );
};

export default TransactionsPage;
