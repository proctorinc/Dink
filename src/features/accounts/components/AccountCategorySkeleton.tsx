import { type FC } from "react";
import { IconButton } from "~/components/ui/Button";
import Card, { CardSkeleton } from "~/components/ui/Card";
import { TextSkeleton } from "~/components/ui/Skeleton";
import { AccountCategory, AccountCategoryIcons } from "~/config";
import { formatToTitleCase } from "~/utils";

type AccountCategorySkeletonProps = {
  category: AccountCategory;
};

export const AccountCategorySkeleton: FC<AccountCategorySkeletonProps> = ({
  category,
}) => {
  return (
    <CardSkeleton>
      <Card.Header size="xl">
        <Card.Group size="xl" horizontal>
          <IconButton
            icon={AccountCategoryIcons[category]}
            size="sm"
            iconSize="sm"
            style="secondary"
            className="bg-secondary-dark/50 text-secondary-med/50"
          />
          <h3 className="text-lg font-bold text-white/75">
            {category === AccountCategory.Cash
              ? "Cash"
              : formatToTitleCase(category)}
          </h3>
        </Card.Group>
        <TextSkeleton color="primary" maxWidth={125} minWidth={50} />
      </Card.Header>
    </CardSkeleton>
  );
};
