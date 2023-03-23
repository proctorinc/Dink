import React, { type FC, type ReactNode } from "react";

type HeaderProps = {
  title: ReactNode;
  subtitle: ReactNode;
  icon?: ReactNode;
};

const Header: FC<HeaderProps> = ({ title, subtitle, icon }) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold">{title}</h1>
        <h2 className="text-xl font-light text-primary-light">{subtitle}</h2>
      </div>
      {icon && (
        <div className="relative flex items-center justify-center">{icon}</div>
      )}
    </div>
  );
};

export default Header;
