import { type Prisma } from "@prisma/client";
import { type FC } from "react";
import { formatToProgressPercentage } from "~/utils";

type ProgressBarProps = {
  value?: Prisma.Decimal;
  goal?: Prisma.Decimal;
  size?: "sm";
};

export const ProgressBar: FC<ProgressBarProps> = ({ value, goal, size }) => {
  const percentComplete = formatToProgressPercentage(value, goal);

  const barHeight = size === "sm" ? "h-4" : "h-6";

  return (
    <div
      className={`${barHeight} relative w-full rounded-md bg-primary-dark group-hover:bg-primary-med`}
    >
      <div
        className="absolute h-full rounded-md bg-gradient-to-r from-secondary-dark to-secondary-med"
        style={{ width: percentComplete }}
      ></div>
    </div>
  );
};
