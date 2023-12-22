import { type Budget as BudgetType } from "@prisma/client";
import { type FC } from "react";
import Modal from "~/components/ui/Modal";
import { api } from "~/utils/api";
import Budget from "./Budget";

type BudgetPickerModalProps = {
  open: boolean;
  onSelect: (budget: Budget) => void;
  onClose: () => void;
};

export const BudgetPickerModal: FC<BudgetPickerModalProps> = ({
  open,
  onSelect,
  onClose,
}) => {
  const budgetData = api.budgets.getAllData.useQuery();

  return (
    <Modal title="Choose Budget" open={open} onClose={onClose}>
      <h3 className="pl-1">Spending</h3>
      <div className="grid grid-cols-1 overflow-clip overflow-y-scroll rounded-xl border border-gray-300 bg-white shadow-md lg:grid-cols-2">
        {budgetData?.data?.spending.map((budget) => (
          <Budget
            key={budget.id}
            data={budget}
            onSelection={() => onSelect(budget)}
          />
        ))}
      </div>
      <h3 className="pl-1">Savings</h3>
      <div className="grid grid-cols-1 overflow-clip overflow-y-scroll rounded-xl border border-gray-300 bg-white shadow-md lg:grid-cols-2">
        {budgetData?.data?.saving.map((budget) => (
          <Budget
            key={budget.id}
            data={budget}
            onSelection={() => onSelect(budget)}
          />
        ))}
      </div>
    </Modal>
  );
};
