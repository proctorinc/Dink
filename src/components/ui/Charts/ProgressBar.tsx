import { type Prisma } from "@prisma/client";
import { type FC } from "react";

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
  const percentComplete = (Number(value) / Number(goal)) * 100;
  let formattedPercent = percentComplete;
  let barColor = "from-secondary-dark to-secondary-med";

  const barHeight = size === "sm" ? "h-4" : "h-6";

  if (percentComplete > 100) {
    formattedPercent = 100;
    barColor = "from-danger-dark to-danger-med";
  }
  if (percentComplete > 90 && percentComplete < 100) {
    barColor = "from-warning-dark to-warning-med";
  }

  if (percentComplete < 0) {
    formattedPercent = 0;
  }

  return (
    <div
      className={`${barHeight} relative w-full rounded-md bg-primary-dark shadow-inner group-hover:bg-primary-med`}
    >
      <div
        className={`${barColor} absolute h-full rounded-md bg-gradient-to-r ${
          className ?? ""
        }`}
        style={{ width: `${formattedPercent}%` }}
      ></div>
    </div>
  );
};
