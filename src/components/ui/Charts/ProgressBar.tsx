import { type Prisma } from "@prisma/client";
import { type FC } from "react";
import { formatToProgressPercentage } from "~/utils";

type ProgressBarProps = {
  value?: Prisma.Decimal;
  goal?: Prisma.Decimal;
  size?: "sm";
  className?: string;
};

export const ProgressBar: FC<ProgressBarProps> = ({
  value,
  goal,
  size,
  className,
}) => {
  const percentComplete = formatToProgressPercentage(value, goal);

  const barHeight = size === "sm" ? "h-4" : "h-6";

  return (
    <div
      className={`${barHeight} relative w-full rounded-md bg-primary-dark shadow-inner group-hover:bg-primary-med`}
    >
      <div
        className={`absolute h-full rounded-md bg-gradient-to-r from-secondary-dark to-secondary-med ${
          className ?? ""
        }`}
        style={{ width: percentComplete }}
      ></div>
    </div>
  );
};
