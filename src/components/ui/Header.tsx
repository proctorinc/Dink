import React, { type FC, type ReactNode } from "react";

type HeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
};

const Header: FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold">{title}</h1>
        {subtitle && (
          <h2 className="text-2xl font-light text-primary-light">{subtitle}</h2>
        )}
      </div>
    </div>
  );
};

export default Header;
