import { type MouseEventHandler, type FC, type ReactNode } from "react";

export type CardHeaderProps = {
  children: ReactNode;
  style?: "sm" | "xl";
  onClick?: MouseEventHandler<HTMLDivElement>;
};

const CardHeader: FC<CardHeaderProps> = ({ style, children, onClick }) => {
  let verticalPadding = "pt-4";

  const clickable = !!onClick
    ? "group hover:bg-primary-light hover:text-primary-dark cursor-pointer"
    : "";

  if (style === "xl") {
    verticalPadding = "py-4";
  } else if (style === "sm") {
    verticalPadding = "pt-2";
  }

  return (
    <div
      className={`${clickable} ${verticalPadding} flex w-full justify-between rounded-xl px-4 text-xl font-bold`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default CardHeader;
