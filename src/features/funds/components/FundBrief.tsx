import { type FC, type HTMLAttributes } from "react";
import { type Fund, type Prisma } from "@prisma/client";
import { IconButton } from "~/components/ui/Button";
import { faPiggyBank, faRetweet } from "@fortawesome/free-solid-svg-icons";
import { formatToTitleCase } from "~/utils";
import useIcons from "~/hooks/useIcons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconColor } from "~/config";

type FundProps = HTMLAttributes<HTMLDivElement> & {
  data?: Fund & {
    amount: Prisma.Decimal;
  };
  onClick?: () => void;
  className?: string;
};

const FundBrief: FC<FundProps> = ({
  data: fund,
  className,
  onClick,
  ...otherProps
}) => {
  const { convertToIcon, convertToColor, defaultColor } = useIcons();
  const icon = convertToIcon(fund?.icon) ?? faPiggyBank;
  const color: IconColor = convertToColor(fund?.color) ?? defaultColor;

  return (
    <div
      className={`flex w-full items-center border-b border-gray-300 p-4 ${
        className ?? ""
      }`}
      {...otherProps}
      onClick={onClick ? () => onClick() : () => null}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="h-8 w-8 rounded-lg shadow-md"
            style={{
              backgroundColor: color?.primary,
              color: color?.secondary,
            }}
          >
            <FontAwesomeIcon size="lg" icon={icon} />
          </button>
          <h3>{formatToTitleCase(fund?.name)}</h3>
        </div>
        <FontAwesomeIcon icon={faRetweet} className="text-gray-600" />
      </div>
    </div>
  );
};

export default FundBrief;
