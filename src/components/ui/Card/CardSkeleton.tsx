import { type FC, type ReactNode } from "react";
import Card from "./Card";

type CardSkeletonProps = {
  children: ReactNode;
};

export const CardSkeleton: FC<CardSkeletonProps> = ({ children }) => {
  return <Card className="animate-pulse bg-primary-med/50">{children}</Card>;
};
