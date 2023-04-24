import { faPiggyBank } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "~/components/ui/Button";
import Card, { CardSkeleton } from "~/components/ui/Card";
import { TextSkeleton } from "~/components/ui/Skeleton";

export const FundSkeletons = () => {
  const FundSkeleton = () => (
    <CardSkeleton>
      <Card.Body horizontal>
        <Card.Group size="xl" horizontal>
          <IconButton
            icon={faPiggyBank}
            size="sm"
            style="secondary"
            className="bg-secondary-dark/50 text-secondary-med/50"
          />
          <TextSkeleton maxWidth={125} minWidth={50} />
        </Card.Group>
        <TextSkeleton color="primary" maxWidth={125} minWidth={50} />
      </Card.Body>
    </CardSkeleton>
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
