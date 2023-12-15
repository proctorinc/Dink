import { Prisma } from "@prisma/client";
import Card, { CardSkeleton } from "~/components/ui/Card";
import { ProgressBar } from "~/components/ui/Charts";
import { TextSkeleton } from "~/components/ui/Skeleton";

export const SavingsSummarySkeleton = () => {
  return (
    <CardSkeleton>
      <Card.Body>
        <Card.Group
          className="w-full justify-between text-xl font-bold"
          horizontal
        >
          <h3>Savings</h3>
          <TextSkeleton color="primary" width={125} />
        </Card.Group>
        <TextSkeleton size="sm" color="primary" width={150} />
        <ProgressBar
          style="primary"
          value={new Prisma.Decimal(30)}
          goal={new Prisma.Decimal(100)}
        />
      </Card.Body>
    </CardSkeleton>
  );
};
