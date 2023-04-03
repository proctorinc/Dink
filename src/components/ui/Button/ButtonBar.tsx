import { type FC, type ReactNode } from "react";

type ButtonBarProps = {
  children: ReactNode;
};

export const ButtonBar: FC<ButtonBarProps> = ({ children }) => {
  return (
    <div className="-m-1 flex w-full items-start justify-start gap-2 overflow-y-visible overflow-x-scroll p-1">
      {children}
    </div>
  );
};
