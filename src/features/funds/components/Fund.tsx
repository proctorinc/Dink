import { type FC, type MouseEventHandler } from "react";
import { type Fund, type Prisma } from "@prisma/client";
import { IconButton } from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import { faMoneyBill1 } from "@fortawesome/free-solid-svg-icons";
import { formatToCurrency, formatToTitleCase } from "~/utils";

type FundProps = {
  data?: Fund & {
    amount: Prisma.Decimal;
  };
  onClick?: MouseEventHandler<HTMLDivElement>;
};

const Fund: FC<FundProps> = ({ data: fund, onClick }) => {
  return (
    <Card onClick={onClick}>
      <Card.Header size="xl">
        <div className="flex items-center gap-3">
          <IconButton icon={faMoneyBill1} size="sm" style="secondary" />
          <h3 className="text-lg font-bold">{formatToTitleCase(fund?.name)}</h3>
        </div>
        <span className="text-lg font-bold text-primary-light group-hover:text-primary-med">
          {formatToCurrency(fund?.amount)}
        </span>
      </Card.Header>
    </Card>
  );
};

export default Fund;
