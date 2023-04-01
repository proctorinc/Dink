import {
  faChevronLeft,
  faChevronRight,
  faGear,
  faPlus,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Prisma } from "@prisma/client";
import Budget from "~/components/budgets";
import { useMonthContext } from "~/components/hooks/useMonthContext";
import { ButtonBar } from "~/components/ui/Button";
import Button from "~/components/ui/Button/Button";
import Header from "~/components/ui/Header";
import MonthYearSelector from "~/components/ui/MonthSelector";
import Spinner from "~/components/ui/Spinner";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";

export default function Budgets() {
  const {
    month,
    year,
    setCurrentMonth,
    startOfMonth,
    endOfMonth,
    isCurrentMonth,
  } = useMonthContext();
  const budgetData = api.budgets.getDataByMonth.useQuery({
    startOfMonth,
    endOfMonth,
  });
  const income = {
    spent: new Prisma.Decimal(0),
    leftover: new Prisma.Decimal(0),
    id: "income",
    goal: new Prisma.Decimal(0),
    icon: "",
    name: "Income",
    userId: "",
  };

  return (
    <>
      <Header title={`Budget`} subtitle={`${month} ${year}`} />
      <div className="flex w-full items-center justify-center gap-2">
        <div className="p-2">
          <button className="invisible h-8 w-8 rounded-full text-primary-light hover:bg-primary-light hover:text-primary-med">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </div>
        <div className="flex w-full w-3/5 items-center justify-center">
          <div className="relative flex aspect-square w-full items-center justify-center rounded-full bg-primary-med">
            <div className="z-20 flex aspect-square w-[75%] flex-col items-center justify-center gap-1 rounded-full bg-primary-dark">
              <h2 className="text-3xl font-bold">Overall</h2>
              <span className="text-center text-sm text-primary-light">
                {formatToCurrency(budgetData.data?.spent)} /{" "}
                {formatToCurrency(budgetData.data?.goal)}
              </span>
            </div>
            <div className="absolute bottom-0 h-[50%] w-full rounded-bl-full rounded-br-full bg-gradient-to-t from-secondary-dark to-secondary-med" />
            <div className="absolute right-0 h-full w-[50%] rounded-br-full rounded-tr-full bg-gradient-to-t from-secondary-dark to-secondary-med" />
          </div>
        </div>
        <div className="p-2">
          <button className="invisible h-8 w-8 rounded-full text-primary-light hover:bg-primary-light hover:text-primary-med">
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
      <ButtonBar>
        <Button icon={faGear} />
        {isCurrentMonth && <Button title="Budget" icon={faPlus} active />}
        {!isCurrentMonth && (
          <Button
            title="Current"
            icon={faRedo}
            onClick={setCurrentMonth}
            active
          />
        )}
      </ButtonBar>
      <MonthYearSelector />
      <Budget data={income} />
      {budgetData.isLoading && <Spinner />}
      {budgetData.data?.budgets.map((budget) => (
        <Budget key={budget.id} data={budget} />
      ))}
    </>
  );
}
