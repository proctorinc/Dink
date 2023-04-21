import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/router";
import { formatToCurrency, formatToPercentage } from "~/utils";
import { api } from "~/utils/api";
import Card from "~/components/ui/Card";

export const CreditCardSummary = () => {
  const router = useRouter();

  const creditAccounts = api.bankAccounts.getCreditAccounts.useQuery();

  if (creditAccounts?.data?.length === 0) {
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
      {creditAccounts.data?.map((account) => {
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
              <div className="relative h-6 w-full rounded-md bg-primary-dark group-hover:bg-primary-med">
                <div
                  className={`absolute h-full w-0 rounded-md bg-gradient-to-r from-secondary-dark to-secondary-med`}
                  style={{ width: utilizationPercent }}
                ></div>
              </div>
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
