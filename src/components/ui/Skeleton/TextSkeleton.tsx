import { useMemo, type FC } from "react";

type TextSkeletonProps = {
  size?: "2xl" | "xl" | "lg" | "sm" | "xs";
  color?: "black" | "white" | "primary" | "secondary";
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
    height = "h-3";
  } else if (size === "xl") {
    height = "h-6";
  } else if (size === "2xl") {
    height = "h-8";
  }

  let textWidth = width;
  let textColor = "bg-black/10";
  let padding = "py-0.5";

  if (!width && minWidth && maxWidth) {
    textWidth = randomWidth;
  }

  if (color === "white") {
    textColor = "bg-white/60";
  } else if (color === "primary") {
    textColor = "bg-primary-light/50";
  } else if (color === "secondary") {
    textColor = "bg-secondary-light/50";
  }

  if (size === "xl") {
    padding = "py-1";
  }

  return (
    <div className={padding}>
      <div
        style={{ width: textWidth ?? "100%" }}
        className={`${height} ${textColor} w-28 animate-pulse rounded-md`}
      />
    </div>
  );
};
