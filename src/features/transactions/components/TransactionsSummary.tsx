import { useRouter } from "next/router";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Button from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import {
  type BankAccount,
  type Transaction,
  type TransactionCategory,
  type TransactionLocation,
  type TransactionPaymentMetadata,
  type TransactionPersonalFinanceCategory,
} from "@prisma/client";
import { type FC } from "react";

type TransactionsSummaryProps = {
  data: (Transaction & {
    account: BankAccount | null;
    personalFinanceCategory: TransactionPersonalFinanceCategory | null;
    paymentMetadata: TransactionPaymentMetadata | null;
    location: TransactionLocation | null;
    category: TransactionCategory[];
  })[];
};

export const TransactionsSummary: FC<TransactionsSummaryProps> = ({
  data: transactions,
}) => {
  const router = useRouter();

  return (
    <Card
      onClick={() => void router.push("/transactions")}
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
