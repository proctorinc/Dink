import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { formatToCurrency } from "~/utils";
import Card from "~/components/ui/Card";
import { ProgressBar } from "~/components/ui/Charts";
import { type FC } from "react";
import {
  type Transaction,
  type TransactionSource,
  type Prisma,
} from "@prisma/client";

type SavingsSummaryProps = {
  data: {
    total: Prisma.Decimal;
    available: Prisma.Decimal;
    unallocatedTotal: Prisma.Decimal;
    funds: {
      sourceTransactions: (TransactionSource & {
        transaction: Transaction;
      })[];
      amount: Prisma.Decimal;
      id: string;
      icon: string | null;
      name: string;
      userId: string;
    }[];
  };
};

export const SavingsSummary: FC<SavingsSummaryProps> = ({
  data: fundsData,
}) => {
  const router = useRouter();

  if (fundsData.funds.length === 0) {
    return (
      <Card onClick={() => void router.push("/savings")}>
        <Card.Body horizontal>
          <Card.Action
            title="Savings"
            subtitle="No saving funds created"
            actionIcon={faPlus}
            actionText="Add"
          />
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card onClick={() => void router.push("/savings")}>
      <Card.Body>
        <Card.Group
          className="w-full justify-between text-xl font-bold"
          horizontal
        >
          <h3 className="text-xl font-bold">Savings</h3>
          <h3 className="text-lg font-bold text-primary-light group-hover:text-primary-med">
            {formatToCurrency(fundsData.total)}
          </h3>
        </Card.Group>
        <span className="text-sm text-primary-light group-hover:text-primary-med">
          {formatToCurrency(fundsData.unallocatedTotal)} unallocated
        </span>
        <ProgressBar value={fundsData.total} goal={fundsData.available} />
      </Card.Body>
    </Card>
  );
};
