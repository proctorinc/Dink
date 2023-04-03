import { type MouseEventHandler, type FC, type ReactNode } from "react";

export type CardHeaderProps = {
  children: ReactNode;
  size?: "sm" | "xl";
  onClick?: MouseEventHandler<HTMLDivElement>;
};

const CardHeader: FC<CardHeaderProps> = ({ size, children, onClick }) => {
  let verticalPadding = "pt-4";

  const clickable = !!onClick
    ? "group hover:bg-primary-light hover:text-primary-dark cursor-pointer"
    : "";

  if (size === "xl") {
    verticalPadding = "py-4";
  } else if (size === "sm") {
    verticalPadding = "pt-2";
  }

  return (
    <div
      className={`${clickable} ${verticalPadding} flex w-full items-center justify-between rounded-xl px-4 text-xl font-bold`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default CardHeader;
