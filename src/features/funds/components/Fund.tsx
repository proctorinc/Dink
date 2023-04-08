import { type FC, type MouseEventHandler } from "react";
import { type Fund, type Prisma } from "@prisma/client";
import { IconButton } from "~/components/ui/Button";
import Card from "~/components/ui/Card";
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
    void router.push(`/funds/${fund?.id ?? ""}`);
  };

  return (
    <Card onClick={onClick ?? navigateToFund}>
      <Card.Body horizontal>
        <Card.Group horizontal size="xl">
          <IconButton size="sm" icon={icon} style="secondary" />
          <h3 className="overflow-hidden text-ellipsis text-lg font-bold">
            {formatToTitleCase(fund?.name)}
          </h3>
        </Card.Group>
        <span className="h-fit text-lg font-bold text-primary-light group-hover:text-primary-med">
          {formatToCurrency(fund?.amount)}
        </span>
      </Card.Body>
    </Card>
  );
};

export default Fund;
