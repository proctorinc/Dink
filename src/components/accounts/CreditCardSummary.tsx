import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/router";
import { formatToCurrency, formatToPercentage } from "~/utils";
import { api } from "~/utils/api";

const CreditCardSummary = () => {
  const router = useRouter();

  const creditAccounts = api.bankAccounts.getCreditAccounts.useQuery();

  if (creditAccounts.isLoading || creditAccounts?.data?.length === 0) {
    return (
      <div
        className="group flex w-full cursor-pointer items-center justify-between rounded-xl bg-primary-med p-4 hover:bg-primary-light hover:text-primary-dark"
        onClick={() => void router.push("/accounts")}
      >
        <div className="flex flex-col">
          <h3 className="text-xl font-bold">Credit Cards</h3>
          <span className="text-sm text-primary-light group-hover:text-primary-med">
            No linked credit cards
          </span>
        </div>
        <button className="flex h-fit items-center gap-2 rounded-lg bg-secondary-med py-2 px-5 font-bold text-secondary-dark group-hover:text-secondary-light">
          <span>Link</span>
          <FontAwesomeIcon className="h-4 w-4" icon={faArrowRight} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col justify-between rounded-xl bg-primary-med py-4">
      <h3 className="px-4 pb-2 text-xl font-bold">Credit Cards</h3>
      {creditAccounts.data?.map((account) => {
        const utilizationPercent = formatToPercentage(
          account.current,
          new Prisma.Decimal(account.limit ?? 0)
        );
        return (
          <div
            key={account.id}
            className="group cursor-pointer rounded-xl px-4 py-1 hover:bg-primary-light hover:text-primary-dark"
            onClick={() => void router.push(`/accounts/${account.id}`)}
          >
            <div className="flex items-center justify-between py-1">
              <h3 className=" text-lg">{account.name}</h3>
              <span className="flex h-fit items-center justify-center rounded-lg bg-warning-med px-2 py-1 text-xs font-bold text-warning-dark">
                Due ???d
              </span>
            </div>
            <div className="relative h-6 w-full rounded-md bg-primary-dark group-hover:bg-primary-med">
              <div
                className={`absolute h-full w-0 rounded-md bg-gradient-to-r from-secondary-dark to-secondary-med`}
                style={{ width: utilizationPercent }}
              ></div>
            </div>
            <div className="flex justify-between py-1 text-sm text-primary-light group-hover:text-primary-med">
              <span>
                {formatToCurrency(account.current)} /{" "}
                {formatToCurrency(new Prisma.Decimal(account.limit ?? 0))} limit
              </span>
              <span>{utilizationPercent} utilization</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CreditCardSummary;
