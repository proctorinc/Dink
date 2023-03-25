import Header from "~/components/ui/Header";
import MonthYearSelector from "~/components/ui/MonthYearSelector";

const TransactionsPage = () => {
  return (
    <>
      <Header title="Transactions" subtitle="???" />
      <div className="flex w-full items-center gap-2">
        <button
          disabled
          className="flex h-fit items-center gap-2 rounded-lg bg-secondary-med py-2 px-5 font-bold text-secondary-dark group-hover:text-secondary-light"
        >
          <span>All</span>
        </button>
        <button
          disabled
          className="flex h-fit items-center gap-2 rounded-lg bg-secondary-med py-2 px-5 font-bold text-secondary-dark group-hover:text-secondary-light"
        >
          <span>Uncategorized</span>
        </button>
        <button
          disabled
          className="flex h-fit items-center gap-2 rounded-lg bg-secondary-med py-2 px-5 font-bold text-secondary-dark group-hover:text-secondary-light"
        >
          <span>Categorized</span>
        </button>
      </div>
      <MonthYearSelector />
    </>
  );
};

export default TransactionsPage;
