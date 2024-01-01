import { type Budget, type Prisma } from "@prisma/client";
import { type FC } from "react";
import Modal from "~/components/ui/Modal";
import { api } from "~/utils/api";
import BudgetBrief from "./BudgetBrief";
import { SavingsBudget } from "./SavingsBudget";

type BudgetPickerModalProps = {
  open: boolean;
  onSelect: (
    budget: Budget & {
      spent: Prisma.Decimal;
      leftover: Prisma.Decimal;
    }
  ) => void;
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
      <div className="grid grid-cols-1 overflow-clip overflow-y-scroll rounded-xl border border-gray-300 bg-white shadow-md lg:grid-cols-2">
        {budgetData?.data?.spending.map((budget) => (
          <BudgetBrief
            key={budget.id}
            data={budget}
            onSelection={() => onSelect(budget)}
          />
        ))}
      </div>
    </Modal>
  );
};
