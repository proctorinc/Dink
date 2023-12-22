import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { type Fund as FundType, type Prisma } from "@prisma/client";
import { type FC, useState, type FormEvent } from "react";
import Button from "~/components/ui/Button";
import Drawer from "~/components/ui/Drawer";
import CurrencyInput from "~/components/ui/Inputs/CurrencyInput";
import FundBrief from "~/features/funds/components/FundBrief";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";
import { FundPickerModal } from "./FundPickerModal";

type AllocateSavingsDrawerProps = {
  open: boolean;
  fund?: FundType & { amount: Prisma.Decimal };
  onClose: () => void;
};

const AllocateSavingsDrawer: FC<AllocateSavingsDrawerProps> = ({
  open,
  fund,
  onClose,
}) => {
  const ctx = api.useContext();
  const fundsData = api.funds.getAllData.useQuery();
  const createAllocation = api.transactions.createFundAllocation.useMutation({
    onSuccess: () => void ctx.invalidate(),
  });
  const [selectedFund, setSelectedFund] = useState<
    (FundType & { amount: Prisma.Decimal }) | null
  >(fund ?? null);
  const [amount, setAmount] = useState(0);
  const [name, setName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const isValidData = fundsData.data && !!selectedFund && !!name && amount > 0;

  const handleAllocateFunds = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValidData) {
      createAllocation.mutate({ fundId: selectedFund.id, amount, name });
      closeOutDrawer();
    }
  };

  const closeOutDrawer = () => {
    setAmount(0);
    setName("");
    setSelectedFund(null);
    onClose();
  };

  if (!open) {
    return <></>;
  }

  return (
    <Drawer title="Allocate Savings" open={open} onClose={closeOutDrawer}>
      <form onSubmit={handleAllocateFunds} className="flex flex-col gap-4">
        <div className="flex flex-col py-4 text-left">
          {selectedFund && (
            <FundBrief
              data={selectedFund}
              className="rounded-xl border border-gray-300 bg-gray-100 shadow-md"
              onClick={() => setModalOpen(true)}
            />
          )}
          {!selectedFund && (
            <Button
              title="Select Fund"
              style="secondary"
              icon={faPlus}
              onClick={() => setModalOpen(true)}
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="px-2" htmlFor="amount">
              Amount:
            </label>
            <span className="text-sm font-normal text-gray-500">
              Unallocated: {formatToCurrency(fundsData.data?.unallocatedTotal)}
            </span>
          </div>
          <CurrencyInput
            id="amount"
            className="w-full rounded-xl border border-gray-300 p-4"
            onValueChange={(value) => setAmount(value)}
          />
        </div>
        <div className="flex flex-col gap-2 text-left">
          <label className="px-2" htmlFor="name">
            Label:
          </label>
          <input
            id="name"
            placeholder="What are you saving this for?"
            className="w-full rounded-xl border border-gray-300 p-4 font-bold placeholder-gray-500"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="mt-5 flex w-full justify-center">
          <Button
            style="secondary"
            title="Allocate"
            type="submit"
            className="w-full"
            disabled={selectedFund === null || amount <= 0}
          />
        </div>
      </form>
      <FundPickerModal
        open={modalOpen && selectedFund === null}
        onClose={() => setModalOpen(false)}
        onSelect={(fund) => setSelectedFund(fund)}
      />
    </Drawer>
  );
};

export default AllocateSavingsDrawer;
