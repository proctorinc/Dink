import { useState } from "react";

import { capitalizeFirstLetter } from "@/utils";
import { useActiveMonths } from "@/features/summary";
import { Loader } from "@/components/Elements/Loader";

import { ListBoxInput } from ".";

export const ActiveMonthsListBox = ({ initialMonth, onSelect }) => {
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const monthsQuery = useActiveMonths();

  console.log(monthsQuery.data);

  const renderMonthAndYear = ({ month, year }) => {
    return `${capitalizeFirstLetter(month)} ${year}`;
  };

  if (monthsQuery.isLoading) {
    return <Loader />;
  }

  const handleSelect = (newMonth) => {
    setSelectedMonth(newMonth);
    onSelect(newMonth);
  };

  return (
    <div className="pb-3">
      <ListBoxInput
        selected={selectedMonth}
        setSelected={handleSelect}
        choices={monthsQuery.data}
        renderItem={renderMonthAndYear}
        itemKey={(item) => `${item.month} ${item.year}`}
      />
    </div>
  );
};
