import { type FC, type HTMLAttributes } from "react";
import { type Fund, type Prisma } from "@prisma/client";
import {
  faCoins,
  faPencil,
  faPiggyBank,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import useIcons from "~/hooks/useIcons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type IconColor } from "~/config";

type FundProps = HTMLAttributes<HTMLDivElement> & {
  data: Fund & {
    amount: Prisma.Decimal;
  };
  open?: string;
  onSelection?: (
    fundId: Fund & {
      amount: Prisma.Decimal;
    }
  ) => void;
  onEdit: () => void;
};

const Fund: FC<FundProps> = ({
  data: fund,
  open,
  onSelection,
  onEdit,
  className,
}) => {
  const { convertToIcon, convertToColor, defaultColor } = useIcons();
  const icon = convertToIcon(fund?.icon) ?? faPiggyBank;
  const color: IconColor = convertToColor(fund?.color) ?? defaultColor;

  return (
    <>
      <div
        className={`flex w-full items-center p-4 ${className ?? ""} ${
          open === fund?.id ? "bg-gray-100" : "border-b border-gray-300"
        }`}
        onClick={() => (onSelection ? onSelection(fund) : null)}
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
      {open === fund.id && (
        <div className="flex justify-around border-b border-gray-300 bg-gray-100 p-4 text-gray-600">
          <FontAwesomeIcon icon={faPencil} onClick={() => onEdit()} />
          <FontAwesomeIcon icon={faCoins} />
          <FontAwesomeIcon icon={faReceipt} />
        </div>
      )}
    </>
  );
};

export default Fund;
