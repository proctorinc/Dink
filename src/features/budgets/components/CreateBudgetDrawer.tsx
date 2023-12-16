import { faPlus, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Prisma, type Fund } from "@prisma/client";
import { type FC, useState, type FormEvent } from "react";
import Button from "~/components/ui/Button";
import Drawer from "~/components/ui/Drawer";
import IconPickerModal from "~/components/ui/Icons/IconPickerModal";
import CurrencyInput from "~/components/ui/Inputs/CurrencyInput";
import Modal from "~/components/ui/Modal";
import { IconColor } from "~/config";
import { FundPickerModal } from "~/features/funds";
import FundBrief from "~/features/funds/components/FundBrief";
import useIcons from "~/hooks/useIcons";
import { api } from "~/utils/api";

type CreateBudgetDrawerProps = {
  open: string;
  onClose: () => void;
};

const CreateBudgetDrawer: FC<CreateBudgetDrawerProps> = ({ open, onClose }) => {
  const { convertToIcon, defaultColor } = useIcons();
  const ctx = api.useContext();
  const [icon, setIcon] = useState<string | null>(null);
  const [color, setColor] = useState<IconColor>(defaultColor);
  const [iconModalOpen, setIconModalOpen] = useState(false);
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [budgetType, setBudgetType] = useState(open);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState(0);
  const [fund, setFund] = useState<(Fund & { amount: Prisma.Decimal }) | null>(
    null
  );

  const createSpending = api.budgets.createSpending.useMutation({
    onSuccess: () => {
      void ctx.invalidate();
      onClose();
    },
  });
  const createSavings = api.budgets.createSavings.useMutation({
    onSuccess: () => {
      void ctx.invalidate();
      onClose();
    },
  });

  const handleCreateBudget = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValidSpendingData && budgetType === "spending") {
      createSpending.mutate({
        name,
        goal,
        icon,
        color: color?.name,
      });
    } else if (isValidSavingsData && !!fund && budgetType === "savings") {
      createSavings.mutate({
        goal,
        fundId: fund.id,
      });
    }
  };

  const isValidSpendingData =
    budgetType === "spending" && !!name && !!icon && goal != 0;
  const isValidSavingsData =
    budgetType === "savings" && !!fund && goal != 0 && goal != 0;

  if (open === "") {
    return <></>;
  }

  return (
    <Drawer title="Create Budget" open={!!open} onClose={onClose}>
      <div className="grid w-full grid-cols-2 gap-2 text-sm">
        <div
          className={`flex items-center justify-center gap-2 rounded-xl border border-gray-300 p-2 ${
            budgetType === "spending" ? "bg-gray-100" : "bg-white"
          }`}
          onClick={() => setBudgetType("spending")}
        >
          <h3>Spending</h3>
        </div>
        <div
          className={`flex items-center justify-center gap-2 rounded-xl border border-gray-300 p-2 ${
            budgetType === "savings" ? "bg-gray-100" : "bg-white"
          }`}
          onClick={() => setBudgetType("savings")}
        >
          <h3>Savings</h3>
        </div>
      </div>
      <form onSubmit={handleCreateBudget}>
        {budgetType === "savings" && (
          <>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="px-2" htmlFor="amount">
                  Amount:
                </label>
              </div>
              <CurrencyInput
                id="amount"
                className="w-full rounded-xl border border-gray-300 p-4"
                onValueChange={(value) => setGoal(value)}
              />
            </div>
            <div className="flex flex-col gap-2 text-left">
              <label className="px-2" htmlFor="amount">
                Fund:
              </label>
              {fund && (
                <FundBrief
                  data={fund}
                  className="rounded-xl border border-gray-300 bg-gray-100 shadow-md"
                  onClick={() => setFundModalOpen(true)}
                />
              )}
              {!fund && (
                <Button
                  title="Select Fund"
                  style="secondary"
                  icon={faPlus}
                  onClick={() => setFundModalOpen(true)}
                />
              )}
            </div>
          </>
        )}
        {budgetType === "spending" && (
          <>
            <div className="flex flex-col gap-2 text-left">
              <label className="px-2" htmlFor="fund-name">
                Name:
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="fund-name"
                  placeholder="What are you budgeting for?"
                  className="w-full rounded-xl border border-gray-300 p-4 font-bold placeholder-gray-500"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <button
                  className="h-8 w-8 rounded-lg shadow-md"
                  style={{
                    backgroundColor: color?.primary,
                    color: color?.secondary,
                  }}
                >
                  <FontAwesomeIcon
                    size="lg"
                    icon={convertToIcon(icon) ?? faPlusCircle}
                    onClick={() => setIconModalOpen(true)}
                  />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="px-2" htmlFor="amount">
                  Amount:
                </label>
              </div>
              <CurrencyInput
                id="amount"
                className="w-full rounded-xl border border-gray-300 p-4"
                onValueChange={(value) => setGoal(value)}
              />
            </div>
          </>
        )}
        <div className="mt-5 flex w-full justify-center">
          <Button
            style="secondary"
            type="submit"
            title="Create"
            className="w-full"
            disabled={!isValidSavingsData && !isValidSpendingData}
          />
        </div>
      </form>
      <IconPickerModal
        open={iconModalOpen}
        onSelect={(iconName, iconColor) => {
          setIcon(iconName);
          setColor(iconColor);
          setIconModalOpen(false);
        }}
        onClose={() => setIconModalOpen(false)}
      />
      <FundPickerModal
        open={fundModalOpen && fund === null}
        onSelect={(fund) => setFund(fund)}
        onClose={() => setFundModalOpen(false)}
      />
    </Drawer>
  );
};

export default CreateBudgetDrawer;
