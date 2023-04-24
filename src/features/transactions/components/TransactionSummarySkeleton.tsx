import Button from "~/components/ui/Button";
import Card, { CardSkeleton } from "~/components/ui/Card";
import { TextSkeleton } from "~/components/ui/Skeleton";

export const TransactionsSummarySkeleton = () => {
  return (
    <CardSkeleton>
      <Card.Body horizontal>
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-white/60">Transactions</h3>
          <TextSkeleton color="primary" width={125} />
        </div>
        <Button className="w-36" style="secondary" />
      </Card.Body>
    </CardSkeleton>
  );
};
