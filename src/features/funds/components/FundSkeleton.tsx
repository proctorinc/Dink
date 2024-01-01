import { faPiggyBank } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextSkeleton } from "~/components/ui/Skeleton";

export const FundSkeletons = () => {
  const FundSkeleton = () => (
    <div className="flex w-full animate-pulse items-center border-b border-gray-300 bg-white/50 p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="h-8 w-8 rounded-lg bg-secondary-dark text-secondary-med shadow-md">
            <FontAwesomeIcon size="lg" icon={faPiggyBank} />
          </button>
          <TextSkeleton maxWidth={125} minWidth={50} />
        </div>
        <TextSkeleton maxWidth={125} minWidth={50} />
      </div>
    </div>
  );

  return (
    <>
      <FundSkeleton />
      <FundSkeleton />
      <FundSkeleton />
      <FundSkeleton />
      <FundSkeleton />
    </>
  );
};
