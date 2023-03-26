import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { type FC, type ReactNode } from "react";

type HeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
};

const BackHeader: FC<HeaderProps> = ({ title, subtitle }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 text-center">
      <div className="flex items-center gap-5">
        <FontAwesomeIcon
          icon={faArrowLeft}
          size="xl"
          onClick={() => void router.back()}
        />
        <h1 className="text-2xl">{title}</h1>
      </div>
      {subtitle && (
        <h2 className="w-full text-4xl font-bold text-primary-light">
          {subtitle}
        </h2>
      )}
    </div>
  );
};

export default BackHeader;
