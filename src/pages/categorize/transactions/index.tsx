import {
  faArrowLeft,
  faArrowRight,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { DetailedTransaction } from "~/features/transactions";
import Button from "~/components/ui/Button";
import { api } from "~/utils/api";
import { type FormEvent, useState } from "react";
import useNotifications from "~/hooks/useNotifications";
import Head from "next/head";
import AuthPage from "~/components/routes/AuthPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearchParams } from "next/navigation";
import { FundPickerModal } from "~/features/funds";
import { type Prisma, type Fund as FundType } from "@prisma/client";
import FundBrief from "~/features/funds/components/FundBrief";
import Budget, { BudgetPickerModal } from "~/features/budgets";

const CategorizeTransactionsPage = () => {
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [isIncome, setIsIncome] = useState(false);
  const [search, setSearch] = useState("");
  const [includeSavings, setIncludeSavings] = useState(false);
  const [openTransaction, setOpenTransaction] = useState("");
  const [selectedFund, setSelectedFund] = useState<
    | (FundType & {
        amount: Prisma.Decimal;
      })
    | null
  >(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedBudget, setSelectedBudget] = useState<
    | (Budget & {
        spent: Prisma.Decimal;
        leftover: Prisma.Decimal;
      })
    | null
  >(null);

  const searchParams = useSearchParams();
  const ctx = api.useContext();

  const fundId = searchParams.get("fundId");
  const budgetId = searchParams.get("budgetId");
  const accountId = searchParams.get("accountId");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const handleOpenTransaction = (transactionId: string) => {
    setOpenTransaction((prev) => (prev === transactionId ? "" : transactionId));
  };

  const transactionData = api.transactions.search.useQuery(
    {
      filterMonthly: !!start || !!end,
      startOfMonth: start ? new Date(start) : null,
      endOfMonth: end ? new Date(end) : null,
      includeSavings: includeSavings,
      includeCategorized: false,
      includeUncategorized: true,
      includeIncome: false,
      fundId,
      budgetId,
      accountId,
      searchText: search,
      size: 100,
    },
    {
      onError: () => setErrorNotification("Failed to fetch transactions"),
    }
  );
  const categorizeAsBudget = api.transactions.categorizeAsBudget.useMutation({
    onSuccess: () => {
      void ctx.invalidate();
      setSelectedBudget(null);
    },
  });
  const categorizeAsFund = api.transactions.categorizeAsFund.useMutation({
    onSuccess: () => {
      void ctx.invalidate();
      setSelectedFund(null);
    },
  });

  const { setErrorNotification } = useNotifications();

  const transactions = transactionData.data?.transactions;
  const currentTransaction = transactions ? transactions[selectedIndex] : null;

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentTransaction && selectedFund && !selectedBudget) {
      categorizeAsFund.mutate({
        transactionId: currentTransaction.id,
        fundId: selectedFund.id,
      });
    } else if (currentTransaction && selectedBudget && !selectedFund) {
      categorizeAsBudget.mutate({
        transactionId: currentTransaction.id,
        budgetId: selectedBudget.id,
      });
    }

    if (transactions && selectedIndex > transactions.length) {
      setSelectedIndex(transactions.length);
    }
  };

  return (
    <AuthPage>
      <Head>
        <title>Categorize Transactions</title>
      </Head>
      <main className="flex h-full min-h-screen flex-col items-center text-white">
        <div className="container flex max-w-md flex-grow flex-col items-center justify-center gap-12 pt-5 sm:pb-4 lg:max-w-2xl">
          <div className="flex w-full flex-grow flex-col items-center gap-4">
            <div className="flex w-full flex-col">
              <div className="flex w-full items-center justify-center py-4 px-8">
                {transactionData?.data &&
                  transactionData.data.transactions.length === 0 && (
                    <div className="flex items-center justify-center px-4 py-2 font-bold text-gray-600">
                      No transactions to categorize
                    </div>
                  )}
                {currentTransaction && transactionData.isSuccess && (
                  <DetailedTransaction
                    key={currentTransaction.id}
                    data={currentTransaction}
                    // open={openTransaction}
                  />
                )}
              </div>
              <div className="flex w-full justify-center text-primary-light">
                <div className="flex w-full max-w-xs items-center justify-around">
                  <button
                    onClick={() => setSelectedIndex((prev) => prev - 1)}
                    className={selectedIndex === 0 ? "invisible p-2" : "p-2"}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </button>
                  <span>
                    {selectedIndex + 1} /{" "}
                    {transactions ? transactions.length : 0}
                  </span>
                  <button>
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      onClick={() => setSelectedIndex((prev) => prev + 1)}
                      className={
                        transactions &&
                        selectedIndex === transactions.length - 1
                          ? "invisible p-2"
                          : "p-2"
                      }
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-grow flex-col overflow-clip rounded-t-2xl bg-gray-100 p-4 pb-20 font-bold text-black">
              <form
                onSubmit={submitForm}
                className="flex flex-col gap-4 overflow-clip rounded-xl border border-gray-300 bg-white p-4 text-black lg:grid-cols-2"
              >
                <h3 className="pl-1">Choose category:</h3>
                <div className="flex w-full text-left">
                  {!selectedFund && !selectedBudget && (
                    <div className="flex w-full flex-col gap-4">
                      <Button
                        title="Fund"
                        style="secondary"
                        className="w-full"
                        onClick={(event) => {
                          event.preventDefault();
                          setFundModalOpen(true);
                        }}
                      />
                      <Button
                        title="Budget"
                        style="secondary"
                        className="w-full"
                        onClick={(event) => {
                          event.preventDefault();
                          setBudgetModalOpen(true);
                        }}
                      />
                      <Button
                        title="Income"
                        style="secondary"
                        className="w-full"
                        onClick={(event) => {
                          event.preventDefault();
                          setIsIncome(true);
                        }}
                      />
                    </div>
                  )}
                  {(selectedBudget || selectedFund) && (
                    <button className="p-2">
                      <FontAwesomeIcon
                        icon={faXmarkCircle}
                        size="xl"
                        onClick={(event) => {
                          event.preventDefault();
                          setSelectedBudget(null);
                          setSelectedFund(null);
                        }}
                      />
                    </button>
                  )}
                  {selectedFund && (
                    <FundBrief
                      data={selectedFund}
                      className="rounded-xl border border-gray-300 bg-gray-100 shadow-md"
                      onClick={() => setFundModalOpen(true)}
                    />
                  )}
                  {selectedBudget && (
                    <Budget
                      data={selectedBudget}
                      className="rounded-xl border border-gray-300 bg-gray-100 shadow-md"
                      onSelection={() => setBudgetModalOpen(true)}
                    />
                  )}
                </div>
                <h3 className="pl-1">Add Note:</h3>
                <textarea className="rounded-xl border border-gray-300 bg-gray-100"></textarea>
                <div className="mt-5 flex w-full justify-center">
                  <Button
                    style="secondary"
                    type="submit"
                    title="Categorize"
                    className="w-full"
                    disabled={!selectedFund && !selectedBudget}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <FundPickerModal
        open={fundModalOpen}
        onClose={() => setFundModalOpen(false)}
        onSelect={(fund) => {
          setSelectedFund(fund);
          setFundModalOpen(false);
        }}
      />
      <BudgetPickerModal
        open={budgetModalOpen}
        onClose={() => setBudgetModalOpen(false)}
        onSelect={(budget) => {
          setSelectedBudget(budget);
          setBudgetModalOpen(false);
        }}
      />
    </AuthPage>
  );
};

export default CategorizeTransactionsPage;
