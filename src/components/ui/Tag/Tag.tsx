import { type FC } from "react";

type TagProps = {
  text: string;
  color: "primary" | "secondary" | "danger" | "warning";
};

export const Tag: FC<TagProps> = ({ text, color }) => {
  let tagColor = "bg-secondary-med text-secondary-dark";

  if (color === "warning") {
    tagColor = "bg-warning-med text-warning-dark";
  } else if (color === "danger") {
    tagColor = "bg-danger-med text-danger-dark";
  } else if (color === "primary") {
    tagColor = "bg-primary-light text-primary-med";
  }

  return (
    <>
      {text && (
        <span
          className={`${tagColor} flex h-fit items-center justify-center rounded-lg  px-2 py-1 text-xs font-bold`}
        >
          {text}
        </span>
      )}
    </>
  );
};
