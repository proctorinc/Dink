import { type FC, type MouseEventHandler } from "react";
import { type Fund, type Prisma } from "@prisma/client";
import { IconButton } from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import { faPiggyBank } from "@fortawesome/free-solid-svg-icons";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import useIcons from "~/hooks/useIcons";

type FundProps = {
  data?: Fund & {
    amount: Prisma.Decimal;
  };
  onClick?: MouseEventHandler<HTMLDivElement>;
};

const Fund: FC<FundProps> = ({ data: fund, onClick }) => {
  const { convertToIcon } = useIcons();
  const icon = convertToIcon(fund?.icon) ?? faPiggyBank;

  return (
    <Card onClick={onClick}>
      <Card.Header size="xl">
        <Card.Group horizontal size="xl">
          <IconButton icon={icon} size="sm" style="secondary" />
          <h3 className="text-lg font-bold">{formatToTitleCase(fund?.name)}</h3>
        </Card.Group>
        <span className="h-fit text-lg font-bold text-primary-light group-hover:text-primary-med">
          {formatToCurrency(fund?.amount)}
        </span>
      </Card.Header>
    </Card>
  );
};

export default Fund;
