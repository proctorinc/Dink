import { faCalendarAlt, faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Prisma } from "@prisma/client";
import { ProgressBar } from "~/components/ui/Charts";
import { TextSkeleton } from "~/components/ui/Skeleton";

const SpendingBudgetSkeleton = () => (
  <div className="flex w-full border-b border-gray-300 p-4">
    <div className="flex w-full items-center gap-1">
      <button className="h-8 w-8 rounded-lg bg-secondary-dark text-secondary-med shadow-md">
        <FontAwesomeIcon size="lg" icon={faCalendarAlt} />
      </button>
      <div className="flex w-full flex-col gap-1 pl-2">
        <div className="flex justify-between group-hover:text-primary-med">
          <TextSkeleton maxWidth={125} minWidth={50} />
          <span>
            <TextSkeleton maxWidth={125} minWidth={50} />
          </span>
        </div>
        <ProgressBar
          size="sm"
          value={new Prisma.Decimal(50)}
          goal={new Prisma.Decimal(100)}
        />
      </div>
    </div>
  </div>
);

const SavingsBudgetSkeleton = () => (
  <div className="flex w-full border-b border-gray-300 p-4">
    <div className="flex w-full items-center gap-1">
      <button className="h-8 w-8 rounded-lg border bg-secondary-dark text-secondary-med shadow-md">
        <FontAwesomeIcon size="lg" icon={faSackDollar} />
      </button>
      <div className="flex w-full flex-col gap-1 pl-2">
        <div className="flex justify-between group-hover:text-primary-med">
          <TextSkeleton maxWidth={125} minWidth={50} />
          <span>
            <TextSkeleton maxWidth={125} minWidth={50} />
          </span>
        </div>
      </div>
    </div>
  </div>
);

export const SpendingBudgetSkeletons = () => {
  return (
    <>
      <SpendingBudgetSkeleton />
      <SpendingBudgetSkeleton />
      <SpendingBudgetSkeleton />
    </>
  );
};

export const SavingsBudgetSkeletons = () => {
  return (
    <>
      <SavingsBudgetSkeleton />
      <SavingsBudgetSkeleton />
      <SavingsBudgetSkeleton />
    </>
  );
};
