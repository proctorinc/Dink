import { type FC, type ReactNode } from "react";

export type CardCollapseProps = {
  children: ReactNode;
  open: boolean;
  className?: string;
};

const CardCollapse: FC<CardCollapseProps> = ({ open, children, className }) => {
  return <>{open && <div className={className}>{children}</div>}</>;
};

export default CardCollapse;
