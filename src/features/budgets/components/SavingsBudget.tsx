import { type Fund, type Budget, type Prisma } from "@prisma/client";
import { type MouseEventHandler, type FC } from "react";
import { formatToCurrency } from "~/utils";
import Card from "~/components/ui/Card";
import { IconButton } from "~/components/ui/Button";
import { faCheckCircle, faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import useIcons from "~/hooks/useIcons";

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
  const { convertToIcon } = useIcons();

  const navigateToBudget = () => {
    void router.push(`/budget/${budget?.id ?? ""}`);
  };

  return (
    <Card onClick={onClick ?? navigateToBudget}>
      <Card.Body horizontal>
        <Card.Group size="sm">
          <Card.Group horizontal>
            <IconButton
              icon={convertToIcon(budget.icon) ?? faSackDollar}
              size="sm"
              style="secondary"
            />
            <h3 className="text-lg font-bold">{budget?.savingsFund?.name}</h3>
          </Card.Group>
        </Card.Group>
        <Card.Group horizontal size="sm">
          <span className="font-bold text-primary-light">
            {formatToCurrency(budget.goal)}
          </span>
          {Number(budget.spent) > 0 && (
            <IconButton size="sm" icon={faCheckCircle} />
          )}
        </Card.Group>
      </Card.Body>
    </Card>
  );
};
