import { Prisma } from "@prisma/client";
import Card, { CardSkeleton } from "~/components/ui/Card";
import { ProgressBar } from "~/components/ui/Charts";
import { TextSkeleton } from "~/components/ui/Skeleton";

export const IncomeBudgetSkeleton = () => {
  return (
    <CardSkeleton>
      <Card.Header size="sm">
        <h3 className="text-xl text-white/50">Income</h3>
        <TextSkeleton size="sm" width={150} color="primary" />
      </Card.Header>
      <Card.Body>
        <ProgressBar
          size="sm"
          value={new Prisma.Decimal(30)}
          goal={new Prisma.Decimal(100)}
          className="bg-gradient-to-r from-secondary-dark/75 to-secondary-med/75"
        />
      </Card.Body>
    </CardSkeleton>
  );
};
