import { useRouter } from "next/router";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Button from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import { type Prisma } from "@prisma/client";
import { type FC } from "react";

type TransactionsSummaryProps = {
  data: Prisma.TransactionGetPayload<{
    include: {
      source: true;
    };
  }>[];
};

export const TransactionsSummary: FC<TransactionsSummaryProps> = ({
  data: transactions,
}) => {
  const router = useRouter();

  return (
    <Card
      onClick={() => void router.push("/categorize/transactions")}
      className="justify-center"
    >
      <Card.Body horizontal>
        <div className="flex flex-col">
          <h3 className="text-xl font-bold">Transactions</h3>
          <span className="text-sm text-primary-light group-hover:text-primary-med">
            {transactions.length ?? ""} uncategorized
          </span>
        </div>
        <Button
          title="Categorize"
          icon={faArrowRight}
          style="secondary"
          iconRight
        />
      </Card.Body>
    </Card>
  );
};
