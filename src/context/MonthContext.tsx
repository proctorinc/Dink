import { type FC, type ReactNode, createContext, useState } from "react";
import { getFirstDayOfMonth, getLastDayOfMonth } from "~/utils";

type MonthProviderProps = {
  children: ReactNode;
};

type MonthContext = {
  month: string;
  year: string;
  startOfMonth: Date;
  endOfMonth: Date;
  isCurrentMonth: boolean;
  hasNextMonth: boolean;
  hasPreviousMonth: boolean;
  setCurrentMonth: () => void;
  getNextMonth: () => void;
  getPreviousMonth: () => void;
};

const MonthContext = createContext<MonthContext>({
  month: "",
  year: "",
  startOfMonth: new Date(),
  endOfMonth: new Date(),
  isCurrentMonth: true,
  hasNextMonth: true,
  hasPreviousMonth: true,
  setCurrentMonth: () => null,
  getNextMonth: () => null,
  getPreviousMonth: () => null,
});

export const MonthProvider: FC<MonthProviderProps> = ({ children }) => {
  const [date, setDate] = useState(getFirstDayOfMonth(new Date()));
  const today = new Date();

  const getNextMonth = () => {
    if (hasNextMonth) {
      setDate(
        (prevDate) => new Date(prevDate.setMonth(prevDate.getMonth() + 1))
      );
    }
  };
  const getPreviousMonth = () => {
    setDate((prevDate) => new Date(prevDate.setMonth(prevDate.getMonth() - 1)));
  };
  const setCurrentMonth = () => {
    setDate(getFirstDayOfMonth(new Date()));
  };
  const isCurrentMonth = date.getMonth() === today.getMonth();
  // If year is not this year, there is another month
  // Otherwise there is a next month unless the month is the next month
  const hasNextMonth =
    date.getFullYear() !== today.getFullYear() ||
    (date.getFullYear() === today.getFullYear() &&
      date.getMonth() <= today.getMonth());

  const hasPreviousMonth = true;
  const month = date.toLocaleString("en-US", {
    month: "long",
  });
  const year = date.toLocaleString("en-US", {
    year: "numeric",
  });
  const startOfMonth = getFirstDayOfMonth(date);
  const endOfMonth = getLastDayOfMonth(date);

  const contextData = {
    month,
    year,
    startOfMonth,
    endOfMonth,
    setCurrentMonth,
    isCurrentMonth,
    hasNextMonth,
    hasPreviousMonth,
    getNextMonth,
    getPreviousMonth,
  };

  return (
    <MonthContext.Provider value={contextData}>
      {children}
    </MonthContext.Provider>
  );
};

export default MonthContext;
