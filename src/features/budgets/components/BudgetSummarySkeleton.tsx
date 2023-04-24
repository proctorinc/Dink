import { Prisma } from "@prisma/client";
import Card, { CardSkeleton } from "~/components/ui/Card";
import { ProgressBar } from "~/components/ui/Charts";
import { TextSkeleton } from "~/components/ui/Skeleton";

export const BudgetSummarySkeleton = () => {
  return (
    <CardSkeleton>
      <Card.Body>
        <Card.Group
          className="w-full justify-between text-xl font-bold"
          horizontal
        >
          <h3>Budget</h3>
          <TextSkeleton color="primary" width={100} />
        </Card.Group>
        <TextSkeleton size="sm" color="primary" width={150} />
        <ProgressBar
          value={new Prisma.Decimal(60)}
          goal={new Prisma.Decimal(100)}
        />
      </Card.Body>
    </CardSkeleton>
  );
};
