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
  hasNextMonth: () => boolean;
  hasPreviousMonth: () => boolean;
  getNextMonth: () => void;
  getPreviousMonth: () => void;
};

const MonthContext = createContext<MonthContext>({
  month: "",
  year: "",
  startOfMonth: new Date(),
  endOfMonth: new Date(),
  hasNextMonth: () => true,
  hasPreviousMonth: () => true,
  getNextMonth: () => null,
  getPreviousMonth: () => null,
});

export const MonthProvider: FC<MonthProviderProps> = ({ children }) => {
  const [date, setDate] = useState(new Date());
  const today = new Date();

  const getNextMonth = () => {
    if (hasNextMonth()) {
      setDate(
        (prevDate) => new Date(prevDate.setMonth(prevDate.getMonth() + 1))
      );
    }
  };
  const getPreviousMonth = () => {
    setDate((prevDate) => new Date(prevDate.setMonth(prevDate.getMonth() - 1)));
  };

  const hasNextMonth = () => {
    return (
      date.getFullYear() !== today.getFullYear() ||
      (date.getFullYear() === today.getFullYear() &&
        date.getMonth() <= today.getMonth())
    );
  };

  const hasPreviousMonth = () => {
    return true;
  };

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
