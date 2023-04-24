import Button from "~/components/ui/Button";
import Card, { CardSkeleton } from "~/components/ui/Card";
import { TextSkeleton } from "~/components/ui/Skeleton";

export const AccountSummarySkeleton = () => {
  return (
    <CardSkeleton>
      <Card.Body horizontal>
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-white/60">Accounts</h3>
          <TextSkeleton color="primary" width={125} />
        </div>
        <Button className="w-24" style="secondary" iconRight />
      </Card.Body>
    </CardSkeleton>
  );
};
