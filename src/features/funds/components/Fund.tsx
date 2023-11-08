import { type FC, type MouseEventHandler } from "react";
import { type Fund, type Prisma } from "@prisma/client";
import { IconButton } from "~/components/ui/Button";
import { faPiggyBank } from "@fortawesome/free-solid-svg-icons";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import useIcons from "~/hooks/useIcons";
import { useRouter } from "next/router";

type FundProps = {
  data?: Fund & {
    amount: Prisma.Decimal;
  };
  onClick?: MouseEventHandler<HTMLDivElement>;
};

const Fund: FC<FundProps> = ({ data: fund, onClick }) => {
  const router = useRouter();
  const { convertToIcon } = useIcons();
  const icon = convertToIcon(fund?.icon) ?? faPiggyBank;

  const navigateToFund = () => {
    void router.push(`/savings/${fund?.id ?? ""}`);
  };

  return (
    <div
      className="flex w-full items-center border-b border-gray-300 p-2"
      onClick={onClick ?? navigateToFund}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 text-gray-500">
            <IconButton style="secondary" size="sm" icon={icon} />
          </div>
          <h3>{formatToTitleCase(fund?.name)}</h3>
        </div>
        <span>{formatToCurrency(fund?.amount)}</span>
      </div>
    </div>
  );
};

export default Fund;
