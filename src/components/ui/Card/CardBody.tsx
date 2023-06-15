import { type FC, type ReactNode } from "react";

export type CardBodyProps = {
  children: ReactNode;
  size?: "sm";
  horizontal?: boolean;
  className?: string;
};

const CardBody: FC<CardBodyProps> = ({
  size,
  horizontal,
  className,
  children,
}) => {
  const verticalPadding = size === "sm" ? "py-2" : "py-4";
  const orientation = horizontal
    ? "items-center justify-between"
    : "flex-col justify-center";

  return (
    <div
      className={`${orientation} ${verticalPadding} flex w-full gap-1 px-4 ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
};

export default CardBody;
