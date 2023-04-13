import {
  faArrowLeft,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import React, { type FC, type ReactNode } from "react";
import Button, { IconButton } from "./Button";

type HeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: IconDefinition;
  back?: boolean;
};

const Header: FC<HeaderProps> = ({ title, subtitle, icon, back }) => {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col">
      {back && (
        <div className="w-full pb-8">
          <Button
            title="Back"
            icon={faArrowLeft}
            onClick={() => void router.back()}
          />
        </div>
      )}
      <div className="flex gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {icon && <IconButton icon={icon} style="secondary" />}
            <h1 className="text-4xl font-bold">{title}</h1>
          </div>
          {subtitle && (
            <h2 className="text-2xl text-primary-light">{subtitle}</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
