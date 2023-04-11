import { type FC, type ReactNode } from "react";

type ButtonBarProps = {
  children: ReactNode;
};

export const ButtonBar: FC<ButtonBarProps> = ({ children }) => {
  return (
    <div className="flex w-full items-start justify-start gap-2">
      {children}
    </div>
  );
};
