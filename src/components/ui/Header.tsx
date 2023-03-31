import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { type FC, type ReactNode } from "react";

type HeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  back?: boolean;
};

const Header: FC<HeaderProps> = ({ title, subtitle, back }) => {
  const router = useRouter();

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex gap-4">
        {back && (
          <FontAwesomeIcon
            className="pt-2"
            icon={faArrowLeft}
            size="xl"
            onClick={() => void router.back()}
          />
        )}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold">{title}</h1>
          {subtitle && (
            <h2 className="text-2xl font-light text-primary-light">
              {subtitle}
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
