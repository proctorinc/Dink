import Card, { CardSkeleton } from "~/components/ui/Card";
import { TextSkeleton } from "~/components/ui/Skeleton";

const TransactionSkeleton = () => (
  <CardSkeleton>
    <Card.Body horizontal size="sm">
      <Card.Group>
        <TextSkeleton width={175} />
        <TextSkeleton size="sm" color="primary" width={80} />
      </Card.Group>
      <Card.Group className="items-end">
        <TextSkeleton size="sm" width={75} />
        <TextSkeleton size="sm" color="primary" width={50} />
      </Card.Group>
    </Card.Body>
  </CardSkeleton>
);

export const TransactionSkeletons = () => {
  return (
    <>
      <TransactionSkeleton />
      <TransactionSkeleton />
      <TransactionSkeleton />
      <TransactionSkeleton />
      <TransactionSkeleton />
    </>
  );
};
