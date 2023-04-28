import { faBuildingColumns, faGear } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "~/components/ui/Button";
import Card, { CardSkeleton } from "~/components/ui/Card";
import { TextSkeleton } from "~/components/ui/Skeleton";

export const InstitutionSkeletons = () => {
  const InstitutionSkeleton = () => (
    <CardSkeleton>
      <Card.Header size="xl">
        <Card.Group horizontal>
          <div className="flex aspect-square h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary-dark shadow-xl">
            <IconButton icon={faBuildingColumns} />
          </div>
          <Card.Group size="sm">
            <TextSkeleton width={90} size="xl" />
            <TextSkeleton width={125} size="sm" color="primary" />
          </Card.Group>
        </Card.Group>
        <IconButton icon={faGear} noShadow size="sm" />
      </Card.Header>
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
