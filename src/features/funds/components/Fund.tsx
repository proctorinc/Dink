import { useState, type FC, type HTMLAttributes } from "react";
import { type Fund, type Prisma } from "@prisma/client";
import { faPiggyBank } from "@fortawesome/free-solid-svg-icons";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import useIcons from "~/hooks/useIcons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type IconColor } from "~/config";
import FundDetailDrawer from "./FundDetailDrawer";

type FundProps = HTMLAttributes<HTMLDivElement> & {
  data: Fund & {
    amount: Prisma.Decimal;
  };
  onSelection?: (
    fund: Fund & {
      amount: Prisma.Decimal;
    }
  ) => void;
};

const Fund: FC<FundProps> = ({ data: fund, onSelection, className }) => {
  const { convertToIcon, convertToColor, defaultColor } = useIcons();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const icon = convertToIcon(fund?.icon) ?? faPiggyBank;
  const color: IconColor = convertToColor(fund?.color) ?? defaultColor;
  return (
    <>
      <div
        className={`flex w-full items-center border-b border-gray-300 p-4 ${
          className ?? ""
        }`}
        onClick={() =>
          onSelection ? onSelection(fund) : setIsDetailOpen(true)
        }
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
            <h3>{formatToTitleCase(fund.name)}</h3>
          </div>
          <span>{formatToCurrency(fund.amount)}</span>
        </div>
      </div>
      <FundDetailDrawer
        open={isDetailOpen}
        fund={fund}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  );
};

export default Fund;
