import { type FC, type ReactNode } from "react";
import Card, { type CardProps } from "./Card";

type CardSkeletonProps = {
  children: ReactNode;
  className?: string;
} & CardProps;

export const CardSkeleton: FC<CardSkeletonProps> = ({
  children,
  className,
  ...cardProps
}) => {
  return (
    <Card
      className={`animate-pulse justify-center bg-primary-med/50 ${
        className ?? ""
      }`}
      {...cardProps}
    >
      {children}
    </Card>
  );
};
