import { type FC, type ReactNode } from "react";

export type CardGroupProps = {
  children: ReactNode;
  size?: "sm" | "xl";
  horizontal?: boolean;
  className?: string;
};

const CardGroup: FC<CardGroupProps> = ({
  size,
  horizontal,
  children,
  className,
}) => {
  const gap = size === "sm" ? "" : "gap-3";
  const orientation = horizontal ? "items-center" : "flex-col";

  return (
    <div className={`${orientation} ${gap} flex flex-wrap ${className ?? ""}`}>
      {children}
    </div>
  );
};

export default CardGroup;
