import { useNavigate } from "react-router-dom";

import { AnimatedCard } from "@/components/Elements/AnimatedCard";
import { IconFromText } from "@/components/Misc/IconFromText/IconFromText";
import { formatCurrency } from "@/utils/currency";

const FundEntry = ({ fund }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (fund._id !== "Unallocated") {
      navigate(`/funds/${fund._id}`);
    }
  };

  return (
    <AnimatedCard onClick={handleClick} className="py-4 sm:py-2">
      <IconFromText text={fund.icon} className="h-6 pr-2" />
      <p className="text-xl">{fund.name}</p>
      <div className="flex justify-end flex-grow">
        <p className="text-xl">{formatCurrency(fund.amount)}</p>
      </div>
    </AnimatedCard>
  );
};

export default FundEntry;
