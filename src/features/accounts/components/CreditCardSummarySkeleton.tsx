import { Prisma } from "@prisma/client";
import Card, { CardSkeleton } from "~/components/ui/Card";
import { TextSkeleton } from "~/components/ui/Skeleton";
import { ProgressBar } from "~/components/ui/Charts";

export const CreditCardSummarySkeleton = () => {
  const CreditCardSkeleton = () => (
    <div>
      <Card.Header>
        <TextSkeleton width={150} />
      </Card.Header>
      <Card.Body>
        <ProgressBar
          value={new Prisma.Decimal(30)}
          goal={new Prisma.Decimal(100)}
        />
        <div className="flex justify-between py-1 text-sm text-primary-light group-hover:text-primary-med">
          <TextSkeleton width={175} size="sm" color="primary" />
          <TextSkeleton width={100} size="sm" color="primary" />
        </div>
      </Card.Body>
    </div>
  );

  return (
    <CardSkeleton className="lg:col-span-2">
      <Card.Header size="xl">
        <h3>Credit Cards</h3>
      </Card.Header>
      <div className="grid grid-flow-col lg:grid-cols-2">
        <CreditCardSkeleton />
        <CreditCardSkeleton />
      </div>
    </CardSkeleton>
  );
};
