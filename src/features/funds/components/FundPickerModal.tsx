import { type Fund as FundType, type Prisma } from "@prisma/client";
import { type FC } from "react";
import Modal from "~/components/ui/Modal";
import { api } from "~/utils/api";
import Fund from "./Fund";

type FundPickerModalProps = {
  open: boolean;
  onSelect: (fund: FundType & { amount: Prisma.Decimal }) => void;
  onClose: () => void;
};

export const FundPickerModal: FC<FundPickerModalProps> = ({
  open,
  onSelect,
  onClose,
}) => {
  const fundsData = api.funds.getAllData.useQuery();

  return (
    <Modal title="Choose Savings Fund" open={open} onClose={onClose}>
      <div className="grid max-h-72 grid-cols-1 overflow-clip overflow-y-scroll rounded-xl border border-gray-300 bg-white shadow-md lg:grid-cols-2">
        {fundsData?.data?.funds.map((fund) => (
          <Fund key={fund.id} data={fund} onSelect={() => onSelect(fund)} />
        ))}
      </div>
    </Modal>
  );
};
