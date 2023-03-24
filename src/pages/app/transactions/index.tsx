import Header from "~/components/ui/Header";
import MonthYearSelector from "~/components/ui/MonthYearSelector";

const TransactionsPage = () => {
  return (
    <>
      <Header title="Transactions" subtitle="???" />
      <div className="flex w-full items-center gap-2">
        <button
          disabled
          className="flex h-fit items-center gap-1 rounded-lg bg-gradient-to-t from-secondary-dark to-secondary-med py-2 px-5 font-bold text-primary-dark group-hover:text-secondary-light"
        >
          <span>All</span>
        </button>
        <button
          disabled
          className="flex h-fit items-center gap-1 rounded-lg bg-gradient-to-t from-secondary-dark to-secondary-med py-2 px-5 font-bold text-primary-dark group-hover:text-secondary-light"
        >
          <span>Uncategorized</span>
        </button>
        <button
          disabled
          className="flex h-fit items-center gap-1 rounded-lg bg-gradient-to-t from-secondary-dark to-secondary-med py-2 px-5 font-bold text-primary-dark group-hover:text-secondary-light"
        >
          <span>Categorized</span>
        </button>
      </div>
      <MonthYearSelector />
    </>
  );
};

export default TransactionsPage;
