import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { type BankAccount, Prisma } from "@prisma/client";
import { useRouter } from "next/router";
import { formatToCurrency, formatToPercentage } from "~/utils";
import Card from "~/components/ui/Card";
import { ProgressBar } from "~/components/ui/Charts";
import { type FC } from "react";

type CreditCardSummaryProps = {
  data: BankAccount[];
};

export const CreditCardSummary: FC<CreditCardSummaryProps> = ({
  data: creditAccounts,
}) => {
  const router = useRouter();

  if (creditAccounts.length === 0) {
    return (
      <Card onClick={() => void router.push("/accounts")}>
        <Card.Body horizontal>
          <Card.Action
            title="Credit Cards"
            subtitle="No linked credit cards"
            actionIcon={faArrowRight}
            actionText="Link"
          />
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header size="xl">
        <h3>Credit Cards</h3>
      </Card.Header>
      {creditAccounts.map((account) => {
        const utilizationPercent = formatToPercentage(
          account.current,
          new Prisma.Decimal(account.creditLimit ?? 1)
        );
        return (
          <Card
            key={account.id}
            size="sm"
            noShadow
            onClick={() => void router.push(`/accounts/${account.id}`)}
          >
            <Card.Header>
              <h3 className="text-lg">{account.name}</h3>
            </Card.Header>
            <Card.Body>
              {account.current && account.creditLimit && (
                <ProgressBar
                  value={account.current}
                  goal={new Prisma.Decimal(account.creditLimit)}
                />
              )}
              <div className="flex justify-between py-1 text-sm text-primary-light group-hover:text-primary-med">
                <span>
                  {formatToCurrency(account.current)} /{" "}
                  {formatToCurrency(
                    new Prisma.Decimal(account.creditLimit ?? 0)
                  )}{" "}
                  limit
                </span>
                <span>{utilizationPercent} utilization</span>
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </Card>
  );
};
