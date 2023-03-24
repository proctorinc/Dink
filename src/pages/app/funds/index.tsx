import { faGear, faMoneyBill1 } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "~/components/ui/Header";
import { formatToCurrency, formatToTitleCase } from "~/utils";
import { api } from "~/utils/api";

export default function Funds() {
  const funds = api.funds.getAll.useQuery();

  return (
    <>
      <Header
        title="Funds"
        subtitle={"Total: $165,972.35"}
        icon={
          <FontAwesomeIcon
            className="h-6 w-6 text-primary-light hover:text-white"
            icon={faGear}
          />
        }
      />

      {/* Chart block component */}
      <div className="h-64 w-full rounded-xl bg-gradient-to-t from-secondary-dark to-secondary-med"></div>

      {funds?.data?.map((fund) => (
        <div
          key={fund.id}
          className="group flex w-full flex-col rounded-xl bg-primary-med p-4 hover:bg-primary-light hover:text-primary-dark"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-secondary-dark group-hover:bg-secondary-med">
                <FontAwesomeIcon
                  className="h-5 w-5 text-secondary-med group-hover:text-secondary-light"
                  icon={faMoneyBill1}
                />
              </div>
              <h3 className="text-lg font-bold">
                {formatToTitleCase(fund.name)}
              </h3>
            </div>
            <span className="text-lg font-bold text-primary-light group-hover:text-primary-med">
              {formatToCurrency(fund.initial_amount)}
            </span>
          </div>
        </div>
      ))}
    </>
  );
}
