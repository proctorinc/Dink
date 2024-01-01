import { type Fund, type Budget, type Prisma } from "@prisma/client";
import { type MouseEventHandler, type FC } from "react";
import { formatToCurrency } from "~/utils";
import { IconButton } from "~/components/ui/Button";
import { faCheckCircle, faSackDollar } from "@fortawesome/free-solid-svg-icons";
import useIcons from "~/hooks/useIcons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type SavingsBudget = {
  data: Budget & {
    spent: Prisma.Decimal;
    leftover: Prisma.Decimal;
    savingsFund: Fund | null;
  };
};

export const SavingsBudget: FC<SavingsBudget> = ({ data: budget }) => {
  const { convertToIcon, convertToColor } = useIcons();
  const color = convertToColor(budget.color);

  return (
    <div className="flex w-full border-b border-gray-300 p-4">
      <div className="flex w-full items-center gap-1">
        <button
          className="h-8 w-8 rounded-lg border shadow-md"
          style={{
            backgroundColor: color?.primary,
            color: color?.secondary,
          }}
        >
          <FontAwesomeIcon
            size="lg"
            icon={convertToIcon(budget.icon) ?? faSackDollar}
          />
        </button>
        <div className="flex w-full flex-col gap-1 pl-2">
          <div className="flex justify-between group-hover:text-primary-med">
            <h3>{budget?.savingsFund?.name}</h3>
            <span>
              <span>{formatToCurrency(budget.goal)}</span>
              {Number(budget.spent) > 0 && (
                <IconButton size="sm" icon={faCheckCircle} />
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
