import { type FC, type ReactNode } from "react";
import Card from "./Card";

type CardListProps = {
  children: ReactNode;
};

export const CardList: FC<CardListProps> = ({ children }) => {
  return <Card>{children}</Card>;
};
