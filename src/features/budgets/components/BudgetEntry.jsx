import { useNavigate } from "react-router-dom";

import { formatCurrency } from "@/utils/currency";
import { IconFromText } from "@/components/Misc/IconFromText/IconFromText";
import { AnimatedCard } from "@/components/Elements/AnimatedCard";

import { BudgetProgressBar } from "./BudgetProgressBar";

const BudgetEntry = ({ budget, date }) => {
  const navigate = useNavigate();
  const spent = formatCurrency(budget.spent);
  const goal = formatCurrency(budget.goal);
  const leftover = formatCurrency(budget.goal - budget.spent);

  const navigateToBudget = () => {
    navigate(`/budgets/${budget._id}/${date.month}/${date.year}`);
  };

  return (
    <AnimatedCard onClick={navigateToBudget}>
      <IconFromText text={budget.icon} className="h-8" />
      <div className="flex flex-col w-full px-3">
        <h3 className="text-lg font-semibold">{budget.name}</h3>
        <BudgetProgressBar goal={budget.goal} spent={budget.spent} />
        <p className="w-full text-sm">
          {spent} of {goal}
          <span className="float-right">{leftover} left</span>
        </p>
      </div>
    </AnimatedCard>
  );
};

export default BudgetEntry;
