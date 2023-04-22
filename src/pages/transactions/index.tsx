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
import { useEffect, useState } from "react";
import Page from "~/components/ui/Page";
import useNotifications from "~/hooks/useNotifications";

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
  const [includeIncome, setIncludeIncome] = useState(true);

  const transactionData = api.transactions.search.useQuery(
    {
      filterMonthly,
      startOfMonth,
      endOfMonth,
      includeSavings,
      includeCategorized,
      includeUncategorized,
      includeIncome,
      searchText: search,
    },
    {
      onSuccess: () => clearNotification(),
      onError: () => setErrorNotification("Failed to fetch transactions"),
    }
  );

  const { setLoadingNotification, clearNotification, setErrorNotification } =
    useNotifications();

  useEffect(() => {
    if (transactionData.isFetching) {
      setLoadingNotification("Loading Transactions...");
    }
  }, [transactionData, setLoadingNotification]);

  const allIncluded =
    includeCategorized &&
    includeSavings &&
    includeUncategorized &&
    includeIncome;

  const handleToggleAll = () => {
    if (allIncluded) {
      setIncludeCategorized(false);
      setIncludeSavings(false);
      setIncludeUncategorized(false);
      setIncludeIncome(false);
    } else {
      setIncludeCategorized(true);
      setIncludeSavings(true);
      setIncludeUncategorized(true);
      setIncludeIncome(true);
    }
  };

  return (
    <Page auth title="Transactions">
      <Header
        title="Transactions"
        subtitle={filterMonthly ? `${month} ${year}` : "All"}
      />
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
                  noShadow={filterMonthly}
                  onClick={() => setFilterMonthly(false)}
                />
                <Button
                  title="Monthly"
                  size="sm"
                  icon={filterMonthly ? faSquareCheck : faSquare}
                  style={filterMonthly ? "secondary" : "primary"}
                  noShadow={!filterMonthly}
                  onClick={() => setFilterMonthly(true)}
                />
              </Card.Group>
              <span className="text-md font-bold">Include Types</span>
              <Card.Group horizontal className="flex-wrap">
                <Button
                  title="All"
                  size="sm"
                  icon={allIncluded ? faSquareCheck : faSquare}
                  style={allIncluded ? "secondary" : "primary"}
                  noShadow={!allIncluded}
                  onClick={handleToggleAll}
                />
                <Button
                  title="Categorized"
                  size="sm"
                  icon={includeCategorized ? faSquareCheck : faSquare}
                  style={includeCategorized ? "secondary" : "primary"}
                  noShadow={!includeCategorized}
                  onClick={() => setIncludeCategorized((prev) => !prev)}
                />
                <Button
                  title="Uncategorized"
                  size="sm"
                  icon={includeUncategorized ? faSquareCheck : faSquare}
                  style={includeUncategorized ? "secondary" : "primary"}
                  noShadow={!includeUncategorized}
                  onClick={() => setIncludeUncategorized((prev) => !prev)}
                />
                <Button
                  title="Savings"
                  size="sm"
                  icon={includeSavings ? faSquareCheck : faSquare}
                  style={includeSavings ? "secondary" : "primary"}
                  noShadow={!includeSavings}
                  onClick={() => setIncludeSavings((prev) => !prev)}
                />
                <Button
                  title="Income"
                  size="sm"
                  icon={includeIncome ? faSquareCheck : faSquare}
                  style={includeIncome ? "secondary" : "primary"}
                  noShadow={!includeIncome}
                  onClick={() => setIncludeIncome((prev) => !prev)}
                />
              </Card.Group>
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
                <span className="text-lg">No Transactions</span>
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
    </Page>
  );
};

export default TransactionsPage;
