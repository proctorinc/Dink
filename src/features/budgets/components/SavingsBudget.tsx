import { type Fund, type Budget, type Prisma } from "@prisma/client";
import { type MouseEventHandler, type FC } from "react";
import { formatToCurrency } from "~/utils";
import Card from "~/components/ui/Card";
import { IconButton } from "~/components/ui/Button";
import { faCheckCircle, faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import useIcons from "~/hooks/useIcons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type SavingsBudget = {
  data: Budget & {
    spent: Prisma.Decimal;
    leftover: Prisma.Decimal;
    savingsFund: Fund | null;
  };
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export const SavingsBudget: FC<SavingsBudget> = ({ data: budget, onClick }) => {
  const router = useRouter();
  const { convertToIcon, convertToColor } = useIcons();
  const color = convertToColor(budget.color);

  const navigateToBudget = () => {
    void router.push(`/budget/${budget?.id ?? ""}`);
  };

  return (
    <div
      className="flex w-full border-b border-gray-300 p-4"
      onClick={onClick ?? navigateToBudget}
    >
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
