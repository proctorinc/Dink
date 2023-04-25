import { faBuildingColumns, faGear } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "~/components/ui/Button";
import Card, { CardSkeleton } from "~/components/ui/Card";
import { TextSkeleton } from "~/components/ui/Skeleton";

export const InstitutionSkeletons = () => {
  const InstitutionSkeleton = () => (
    <CardSkeleton>
      <Card.Header>
        <Card.Group horizontal>
          <div className="flex aspect-square h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary-dark shadow-xl">
            <IconButton icon={faBuildingColumns} />
          </div>
          <Card.Group size="sm">
            <TextSkeleton width={80} />
            <TextSkeleton width={125} color="primary" />
          </Card.Group>
        </Card.Group>
        <IconButton icon={faGear} noShadow size="sm" />
      </Card.Header>
      <Card.Body>
        <TextSkeleton width={150} color="primary" />
      </Card.Body>
    </CardSkeleton>
  );

  return (
    <>
      <InstitutionSkeleton />
      <InstitutionSkeleton />
      <InstitutionSkeleton />
      <InstitutionSkeleton />
    </>
  );
};
