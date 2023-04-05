import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import Button from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import { ProgressBar } from "~/components/ui/Charts";
import {
  formatToCurrency,
  formatToPercentage,
  getFirstDayOfMonth,
  getLastDayOfMonth,
} from "~/utils";
import { api } from "~/utils/api";

export const BudgetSummary = () => {
  const router = useRouter();
  const today = new Date();
  const startOfMonth = getFirstDayOfMonth(today);
  const endOfMonth = getLastDayOfMonth(today);
  const budgetData = api.budgets.getDataByMonth.useQuery({
    startOfMonth,
    endOfMonth,
  });

  if (budgetData.data?.budgets.length === 0) {
    return (
      <Card onClick={() => void router.push("/budget")}>
        <Card.Body horizontal>
          <div className="flex flex-col">
            <h3 className="text-xl font-bold">Budget</h3>
            <span className="text-sm text-primary-light group-hover:text-primary-med">
              No budgets created
            </span>
          </div>
          <Button title="Add" icon={faPlus} style="secondary" />
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card onClick={() => void router.push("/budget")}>
      <Card.Body>
        <Card.Group
          className="w-full justify-between text-xl font-bold"
          horizontal
        >
          <h3>Budget</h3>
          <h3 className="text-lg text-primary-light group-hover:text-primary-med">
            {formatToPercentage(budgetData.data?.spent, budgetData.data?.goal)}{" "}
            Spent
          </h3>
        </Card.Group>
        <span className="text-sm text-primary-light group-hover:text-primary-med">
          {formatToCurrency(budgetData.data?.spent)} /{" "}
          {formatToCurrency(budgetData.data?.goal)}
        </span>
        <ProgressBar
          value={budgetData.data?.spent}
          goal={budgetData.data?.goal}
        />
      </Card.Body>
    </Card>
  );
};
