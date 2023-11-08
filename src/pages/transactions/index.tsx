import {
  faFilter,
  faMagnifyingGlass,
  faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { useMonthContext } from "~/hooks/useMonthContext";
import Transaction, { CategorizeTransactions } from "~/features/transactions";
import Button, { IconButton } from "~/components/ui/Button";
import { api } from "~/utils/api";
import Card from "~/components/ui/Card";
import { useState } from "react";
import useNotifications from "~/hooks/useNotifications";
import Modal from "~/components/ui/Modal";
import Head from "next/head";
import AuthPage from "~/components/routes/AuthPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TransactionsPage = () => {
  const { startOfMonth, endOfMonth } = useMonthContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [includeSavings, setIncludeSavings] = useState(false);
  const [includeCategorized, setIncludeCategorized] = useState(true);
  const [includeUncategorized, setIncludeUncategorized] = useState(true);
  const [includeIncome, setIncludeIncome] = useState(true);

  const transactionData = api.transactions.search.useQuery(
    {
      filterMonthly: false,
      startOfMonth,
      endOfMonth,
      includeSavings,
      includeCategorized,
      includeUncategorized,
      includeIncome,
      searchText: search,
    },
    { onError: () => setErrorNotification("Failed to fetch transactions") }
  );

  const { setErrorNotification } = useNotifications();

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
    <AuthPage>
      <Head>
        <title>Transactions</title>
      </Head>
      <main className="flex h-full min-h-screen flex-col items-center text-white">
        <div className="container flex max-w-md flex-grow flex-col items-center justify-center gap-12 pt-5 sm:pb-4 lg:max-w-2xl">
          <div className="flex w-full flex-grow flex-col items-center gap-4">
            <div className="flex w-full flex-col gap-4 px-4">
              <Card size="sm">
                <Card.Body>
                  <Card.Group horizontal>
                    <span className="text-2xl font-bold text-primary-light">
                      <IconButton icon={faMagnifyingGlass} size="xs" />
                    </span>
                    <input
                      id="name-input"
                      autoFocus
                      placeholder="Search transactions..."
                      className="text-md flex-grow bg-transparent font-bold text-primary-light placeholder-primary-light"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                    <span className="text-2xl font-bold text-primary-light">
                      <FontAwesomeIcon
                        icon={faFilter}
                        className={
                          filtersOpen
                            ? "text-secondary-med"
                            : "text-primary-light"
                        }
                        size="xs"
                        onClick={() => setFiltersOpen((prev) => !prev)}
                      />
                    </span>
                  </Card.Group>
                </Card.Body>
              </Card>
              {filtersOpen && (
                <Card>
                  <Card.Body>
                    <Card.Group>
                      <Card.Group horizontal className="flex-wrap">
                        <Button
                          title="All"
                          size="sm"
                          icon={allIncluded ? faSquareCheck : faSquare}
                          style={allIncluded ? "secondary" : "invisible"}
                          noShadow={!allIncluded}
                          onClick={handleToggleAll}
                        />
                        <Button
                          title="Categorized"
                          size="sm"
                          icon={includeCategorized ? faSquareCheck : faSquare}
                          style={includeCategorized ? "secondary" : "invisible"}
                          noShadow={!includeCategorized}
                          onClick={() => setIncludeCategorized((prev) => !prev)}
                        />
                        <Button
                          title="Uncategorized"
                          size="sm"
                          icon={includeUncategorized ? faSquareCheck : faSquare}
                          style={
                            includeUncategorized ? "secondary" : "invisible"
                          }
                          noShadow={!includeUncategorized}
                          onClick={() =>
                            setIncludeUncategorized((prev) => !prev)
                          }
                        />
                        <Button
                          title="Savings"
                          size="sm"
                          icon={includeSavings ? faSquareCheck : faSquare}
                          style={includeSavings ? "secondary" : "invisible"}
                          noShadow={!includeSavings}
                          onClick={() => setIncludeSavings((prev) => !prev)}
                        />
                        <Button
                          title="Income"
                          size="sm"
                          icon={includeIncome ? faSquareCheck : faSquare}
                          style={includeIncome ? "secondary" : "invisible"}
                          noShadow={!includeIncome}
                          onClick={() => setIncludeIncome((prev) => !prev)}
                        />
                      </Card.Group>
                    </Card.Group>
                  </Card.Body>
                </Card>
              )}
            </div>
            <div className="flex w-full flex-grow flex-col rounded-t-2xl bg-white pb-20 font-bold text-black">
              <div className="grid h-full w-full grid-cols-1 overflow-clip rounded-xl border border-gray-300 bg-white text-black lg:grid-cols-2">
                {transactionData?.data && transactionData.data.length === 0 && (
                  <div className="flex items-center justify-center px-4 py-2 font-bold text-gray-600">
                    No transactions match this search
                  </div>
                )}
                {transactionData.data &&
                  transactionData.isSuccess &&
                  transactionData.data.map((transaction, index) => (
                    <>
                      {(index === 0 ||
                        transactionData.data[index - 1]?.date.getMonth() !==
                          transaction.date.getMonth()) && (
                        <div
                          key="Not found"
                          className="h-fit border-b border-gray-300 bg-gray-100 px-4 py-2 font-bold text-gray-600"
                        >
                          {transaction.date.toLocaleString("en-US", {
                            month: "long",
                          })}
                        </div>
                      )}
                      <Transaction key={transaction.id} data={transaction} />
                    </>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Modal
        open={modalOpen}
        title="Categorize"
        onClose={() => setModalOpen(false)}
      >
        <CategorizeTransactions transactions={transactionData.data ?? []} />
      </Modal>
    </AuthPage>
  );
};

export default TransactionsPage;
