import { type FC, type ReactNode } from "react";

export type CardCollapseProps = {
  children: ReactNode;
  open: boolean;
};

const CardCollapse: FC<CardCollapseProps> = ({ open, children }) => {
  return <>{open && <div>{children}</div>}</>;
};

export default CardCollapse;
