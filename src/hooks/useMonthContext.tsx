import { useContext } from "react";
import MonthContext from "~/context/MonthContext";

export const useMonthContext = () => {
  return useContext(MonthContext);
};
