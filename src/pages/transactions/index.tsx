import {
  faFilter,
  faMagnifyingGlass,
  faSquareCheck,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/router";
import { useMonthContext } from "~/hooks/useMonthContext";
import Transaction from "~/features/transactions";
import Button, { ButtonBar, IconButton } from "~/components/ui/Button";
import Header from "~/components/ui/Header";
import MonthYearSelector from "~/components/ui/MonthSelector";
import Spinner from "~/components/ui/Spinner";
import { api } from "~/utils/api";
import Card from "~/components/ui/Card";
import { useState } from "react";
import AuthPage from "~/components/routes/AuthPage";

const TransactionsPage = () => {
  const router = useRouter();
  const { month, year, startOfMonth, endOfMonth } = useMonthContext();
  const [search, setSearch] = useState("");
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
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
    <AuthPage>
      <Header title="Transactions" subtitle={`${month} ${year}`} />
      <ButtonBar>
        <Button
          icon={faMagnifyingGlass}
          style={searchEnabled ? "secondary" : "primary"}
          onClick={() => setSearchEnabled((prev) => !prev)}
        />
        <Button
          icon={faFilter}
          style={filtersOpen ? "secondary" : "primary"}
          onClick={() => setFiltersOpen((prev) => !prev)}
        />
        <Button
          title="Categorize"
          icon={faTags}
          style="secondary"
          onClick={() => {
            void router.push("/transactions/categorize");
          }}
        />
      </ButtonBar>
      {filtersOpen && (
        <Card>
          <Card.Body>
            <Card.Group>
              <span className="text-md font-bold">Time</span>
              <Card.Group horizontal>
                <Button
                  title="All"
                  size="sm"
                  icon={filterMonthly ? faSquare : faSquareCheck}
                  style={filterMonthly ? "primary" : "secondary"}
                  onClick={() => setFilterMonthly(false)}
                />
                <Button
                  title="Monthly"
                  size="sm"
                  icon={filterMonthly ? faSquareCheck : faSquare}
                  style={filterMonthly ? "secondary" : "primary"}
                  onClick={() => setFilterMonthly(true)}
                />
              </Card.Group>
              <span className="text-md font-bold">Include Types</span>
              <Card.Group horizontal>
                <Button
                  title="All"
                  size="sm"
                  icon={
                    includeCategorized && includeSavings && includeUncategorized
                      ? faSquareCheck
                      : faSquare
                  }
                  style={
                    includeCategorized && includeSavings && includeUncategorized
                      ? "secondary"
                      : "primary"
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
                  title="Categorized"
                  size="sm"
                  icon={includeCategorized ? faSquareCheck : faSquare}
                  style={includeCategorized ? "secondary" : "primary"}
                  onClick={() => setIncludeCategorized((prev) => !prev)}
                />
                <Button
                  title="Uncategorized"
                  size="sm"
                  icon={includeUncategorized ? faSquareCheck : faSquare}
                  style={includeUncategorized ? "secondary" : "primary"}
                  onClick={() => setIncludeUncategorized((prev) => !prev)}
                />
                <Button
                  title="Savings"
                  size="sm"
                  icon={includeSavings ? faSquareCheck : faSquare}
                  style={includeSavings ? "secondary" : "primary"}
                  onClick={() => setIncludeSavings((prev) => !prev)}
                />
              </Card.Group>
            </Card.Group>
          </Card.Body>
        </Card>
      )}
      {searchEnabled && (
        <Card size="sm">
          <Card.Body>
            <Card.Group horizontal>
              <span className="text-2xl font-bold text-primary-light">
                <IconButton icon={faMagnifyingGlass} size="xs" />
              </span>
              <input
                id="name-input"
                autoFocus
                placeholder="Enter name..."
                className="text-md flex-grow bg-primary-med font-bold text-primary-light placeholder-primary-light"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </Card.Group>
          </Card.Body>
        </Card>
      )}
      {filterMonthly && <MonthYearSelector />}
      <div className="flex w-full flex-col gap-3">
        {transactionData.isLoading && <Spinner />}
        {transactionData?.data?.length === 0 && (
          <Card>
            <Card.Header size="xl">
              <Card.Group>
                <span>None</span>
                <span className="text-xs text-primary-light">
                  Try using different filters
                </span>
              </Card.Group>
            </Card.Header>
          </Card>
        )}
        {transactionData.data &&
          transactionData.isSuccess &&
          transactionData.data.map((transaction) => (
            <Transaction key={transaction.id} data={transaction} />
          ))}
      </div>
    </AuthPage>
  );
};

export default TransactionsPage;
