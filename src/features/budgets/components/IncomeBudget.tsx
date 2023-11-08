import { type FC } from "react";
import { formatToCurrency } from "~/utils";
import Card from "~/components/ui/Card";
import { ProgressBar } from "~/components/ui/Charts";
import { api } from "~/utils/api";
import { useMonthContext } from "~/hooks/useMonthContext";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Button from "~/components/ui/Button";
import { useRouter } from "next/router";

export const IncomeBudget: FC = () => {
  const router = useRouter();
  const { startOfMonth, endOfMonth } = useMonthContext();
  const userPreferences = api.users.getUserPreferences.useQuery();
  const income = api.transactions.getIncomeByMonth.useQuery({
    startOfMonth,
    endOfMonth,
  });

  const targetIncome = userPreferences.data?.targetIncome;

  if (Number(targetIncome) === 0) {
    return (
      <Card size="sm" onClick={() => void router.push("/profile")}>
        <Card.Body horizontal>
          <div className="flex flex-col">
            <h3 className="text-xl font-bold">Income</h3>
            <span className="text-sm text-primary-light group-hover:text-primary-med">
              Not setup yet
            </span>
          </div>
          <Button title="Fix" icon={faArrowRight} style="secondary" iconRight />
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header size="sm">
        <h3 className="text-xl">Income</h3>
        <span className="text-sm text-primary-light">
          {formatToCurrency(income?.data)} / {formatToCurrency(targetIncome)}
        </span>
      </Card.Header>
      <Card.Body>
        <ProgressBar
          style="primary"
          size="sm"
          value={income.data}
          goal={targetIncome}
        />
      </Card.Body>
    </Card>
  );
};
