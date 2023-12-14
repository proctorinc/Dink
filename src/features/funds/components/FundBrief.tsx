import { type FC, type HTMLAttributes } from "react";
import { type Fund, type Prisma } from "@prisma/client";
import { IconButton } from "~/components/ui/Button";
import { faPiggyBank, faRetweet } from "@fortawesome/free-solid-svg-icons";
import { formatToTitleCase } from "~/utils";
import useIcons from "~/hooks/useIcons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type FundProps = HTMLAttributes<HTMLDivElement> & {
  data?: Fund & {
    amount: Prisma.Decimal;
  };
};

const FundBrief: FC<FundProps> = ({ data: fund, className, ...otherProps }) => {
  const { convertToIcon } = useIcons();
  const icon = convertToIcon(fund?.icon) ?? faPiggyBank;

  return (
    <div
      className={`flex w-full items-center border-b border-gray-300 p-4 ${
        className ?? ""
      }`}
      {...otherProps}
      onClick={() => console.log("ook")}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-gray-500">
            <IconButton style="secondary" size="sm" icon={icon} />
          </div>
          <h3>{formatToTitleCase(fund?.name)}</h3>
        </div>
        <FontAwesomeIcon icon={faRetweet} className="text-gray-600" />
      </div>
    </div>
  );
};

export default FundBrief;
