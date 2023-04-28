import {
  faAngleUp,
  faCalendarAlt,
  faSackDollar,
} from "@fortawesome/free-solid-svg-icons";
import { Prisma } from "@prisma/client";
import { IconButton } from "~/components/ui/Button";
import Card, { CardSkeleton } from "~/components/ui/Card";
import { ProgressBar } from "~/components/ui/Charts";
import { TextSkeleton } from "~/components/ui/Skeleton";
import { IncomeBudgetSkeleton } from "./IncomeBudgetSkeleton";

const BudgetSkeleton = () => (
  <CardSkeleton>
    <Card.Body size="sm" horizontal>
      <IconButton
        className="bg-secondary-dark/50 text-secondary-med/50"
        icon={faCalendarAlt}
        style="secondary"
      />
      <Card.Group size="sm" className="w-full gap-1 pl-2">
        <TextSkeleton width={100} />
        <div className="py-0.5">
          <ProgressBar
            size="sm"
            value={new Prisma.Decimal(60)}
            goal={new Prisma.Decimal(100)}
            className="bg-gradient-to-r from-secondary-dark/75 to-secondary-med/75"
          />
        </div>
        <div className="flex justify-between text-sm text-primary-light group-hover:text-primary-med">
          <TextSkeleton size="sm" color="primary" width={125} />
          <TextSkeleton size="sm" color="primary" width={100} />
        </div>
      </Card.Group>
    </Card.Body>
  </CardSkeleton>
);

const SavingsBudgetSkeleton = () => (
  <CardSkeleton>
    <Card.Body horizontal>
      <Card.Group size="sm">
        <Card.Group horizontal>
          <IconButton icon={faSackDollar} size="sm" style="secondary" />
          <TextSkeleton width={125} color="primary" />
        </Card.Group>
      </Card.Group>
      <Card.Group horizontal size="sm">
        <TextSkeleton color="primary" width={125} />
      </Card.Group>
    </Card.Body>
  </CardSkeleton>
);

export const BudgetSkeletons = () => {
  return (
    <>
      <IncomeBudgetSkeleton />
      <div className="flex w-full items-center justify-between">
        <div className="flex gap-1">
          <IconButton
            icon={faAngleUp}
            noShadow
            className="text-primary-light/75"
          />
          <h3 className="w-full text-left text-xl font-bold text-primary-light/75">
            Spending
          </h3>
        </div>
        <TextSkeleton width={50} color="primary" />
      </div>
      <div className="flex w-full flex-col gap-3">
        <BudgetSkeleton />
        <BudgetSkeleton />
        <BudgetSkeleton />
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex gap-1">
          <IconButton
            icon={faAngleUp}
            noShadow
            className="text-primary-light/75"
          />
          <h3 className="w-full text-left text-xl font-bold text-primary-light/75">
            Savings
          </h3>
        </div>
        <TextSkeleton width={50} color="primary" />
      </div>
      <div className="flex w-full flex-col gap-3">
        <SavingsBudgetSkeleton />
        <SavingsBudgetSkeleton />
        <SavingsBudgetSkeleton />
      </div>
    </>
  );
};
