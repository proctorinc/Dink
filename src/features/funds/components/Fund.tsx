import { useState, type FC, type HTMLAttributes } from "react";
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
import Modal from "~/components/ui/Modal";

type FundProps = HTMLAttributes<HTMLDivElement> & {
  data: Fund & {
    amount: Prisma.Decimal;
  };
  open?: string;
  onSelection?: (
    fund: Fund & {
      amount: Prisma.Decimal;
    }
  ) => void;
  onEdit?: () => void;
};

const Fund: FC<FundProps> = ({
  data: fund,
  onSelection,
  onEdit,
  className,
}) => {
  const { convertToIcon, convertToColor, defaultColor } = useIcons();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const icon = convertToIcon(fund?.icon) ?? faPiggyBank;
  const color: IconColor = convertToColor(fund?.color) ?? defaultColor;

  return (
    <>
      <div
        className={`flex w-full items-center border-b border-gray-300 p-4 ${
          className ?? ""
        }`}
        onClick={() => (onSelection ? onSelection(fund) : setIsModalOpen(true))}
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
      <Modal
        title={
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
            {fund.name}
          </div>
        }
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="flex justify-around p-4 text-gray-600">
          {onEdit && (
            <div
              className="flex flex-col gap-2 text-sm"
              onClick={() => onEdit()}
            >
              <FontAwesomeIcon size="lg" icon={faPencil} />
              <span>Edit</span>
            </div>
          )}
          <div className="flex flex-col gap-2 text-sm">
            <FontAwesomeIcon size="lg" icon={faCoins} />
            <span>Allocate</span>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <FontAwesomeIcon size="lg" icon={faReceipt} />
            <span>Transactions</span>
          </div>
        </div>
      </Modal>
      {/* {open === fund.id && (
        <div className="flex justify-around border-b border-gray-300 bg-gray-200 p-4 text-gray-600">
          {onEdit && (
            <FontAwesomeIcon icon={faPencil} onClick={() => onEdit()} />
          )}
          <FontAwesomeIcon icon={faCoins} />
          <FontAwesomeIcon icon={faReceipt} />
        </div>
      )} */}
    </>
  );
};

export default Fund;
