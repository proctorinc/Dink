import { type FC, type ReactNode } from "react";
import Card, { type CardProps } from "./Card";

type CardSkeletonProps = {
  children: ReactNode;
} & CardProps;

export const CardSkeleton: FC<CardSkeletonProps> = ({
  children,
  ...cardProps
}) => {
  return (
    <Card className="animate-pulse bg-primary-med/50" {...cardProps}>
      {children}
    </Card>
  );
};
