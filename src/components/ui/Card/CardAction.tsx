import { type FC } from "react";
import { type IconDefinition } from "@fortawesome/free-solid-svg-icons";
import Button from "~/components/ui/Button";

export type CardActionProps = {
  title: string;
  subtitle?: string;
  actionIcon: IconDefinition;
  actionText: string;
};

const CardAction: FC<CardActionProps> = ({
  title,
  subtitle,
  actionText,
  actionIcon,
}) => {
  return (
    <>
      <div className="flex flex-col">
        <h3 className="text-xl font-bold">{title}</h3>
        {subtitle && (
          <span className="text-sm text-primary-light group-hover:text-primary-med">
            {subtitle}
          </span>
        )}
      </div>
      <Button title={actionText} icon={actionIcon} active iconRight />
    </>
  );
};

export default CardAction;
