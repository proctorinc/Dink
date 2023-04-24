import { useMemo, type FC } from "react";

type TextSkeletonProps = {
  size?: "xl" | "lg" | "sm" | "xs";
  color?: "white" | "primary" | "secondary";
  width?: number;
  minWidth?: number;
  maxWidth?: number;
};

export const TextSkeleton: FC<TextSkeletonProps> = ({
  size,
  color,
  width,
  minWidth,
  maxWidth,
}) => {
  let height = "h-5";
  const randomWidth = useMemo(() => {
    if (maxWidth && minWidth) {
      return Math.floor(Math.random() * (maxWidth - minWidth + 1) + minWidth);
    }
    return 0;
  }, [maxWidth, minWidth]);

  if (size === "sm") {
    height = "h-4";
  } else if (size === "xs") {
    height = "h-2";
  } else if (size === "xl") {
    height = "h-6";
  }

  let textWidth = width;
  let textColor = "bg-white/75";

  if (!width && minWidth && maxWidth) {
    textWidth = randomWidth;
  }

  if (color === "primary") {
    textColor = "bg-primary-light/50";
  } else if (color === "secondary") {
    textColor = "bg-secondary-light/50";
  }

  return (
    <div
      style={{ width: textWidth ?? "100%" }}
      className={`${height} ${textColor} w-28 animate-pulse rounded-md`}
    />
  );
};
