import {
  faCoins,
  faGear,
  faMoneyBill1,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { ButtonBar, IconButton } from "~/components/ui/Button";
import Button from "~/components/ui/Button/Button";
import Card from "~/components/ui/Card";
import Header from "~/components/ui/Header";
import Spinner from "~/components/ui/Spinner";
import {
  formatToCurrency,
  formatToPercentage,
  formatToTitleCase,
} from "~/utils";
import { api } from "~/utils/api";

export default function Funds() {
  const router = useRouter();
  const fundsData = api.funds.getAllData.useQuery();

  const percentAllocated = formatToPercentage(
    fundsData.data?.total,
    fundsData.data?.unallocatedTotal
  );

  return (
    <>
      <Header
        title="Funds"
        subtitle={`Total: ${formatToCurrency(fundsData?.data?.total)}`}
      />

      <div className="flex w-full items-end">
        <div className="flex w-2/3 flex-col gap-1">
          <div className="flex w-full items-center justify-center p-2">
            <div className="relative flex aspect-square w-full items-center justify-center rounded-full bg-primary-med">
              <div className="z-20 flex aspect-square w-[70%] flex-col items-center justify-center gap-3 rounded-full bg-primary-dark"></div>
              <div className="absolute bottom-0 h-[50%] w-full rounded-bl-full rounded-br-full bg-gradient-to-t from-secondary-dark to-secondary-med" />
              <div className="absolute right-0 h-full w-[50%] rounded-br-full rounded-tr-full bg-gradient-to-t from-secondary-dark to-secondary-med" />
            </div>
          </div>
        </div>
        <div className="flex w-1/3 flex-col text-center">
          <div className="flex w-full items-center justify-center p-2">
            <div className="relative flex aspect-square w-full items-center justify-center rounded-full bg-primary-med">
              <div className="z-20 flex aspect-square w-[60%] flex-col items-center justify-center gap-3 rounded-full bg-primary-dark">
                <span className="text-xl font-bold">{percentAllocated}</span>
              </div>
              <div className="absolute bottom-0 h-[50%] w-full rounded-bl-full rounded-br-full bg-gradient-to-t from-secondary-dark to-secondary-med" />
              <div className="absolute right-0 h-full w-[50%] rounded-br-full rounded-tr-full bg-gradient-to-t from-secondary-dark to-secondary-med" />
            </div>
          </div>
          <span className="font-bold text-primary-light">% Allocated</span>
        </div>
      </div>
      <ButtonBar>
        <Button icon={faGear} />
        <Button title="Allocate" icon={faCoins} />
        <Button title="Fund" icon={faPlus} active />
      </ButtonBar>
      {fundsData.isLoading && <Spinner />}
      {fundsData?.data?.funds.map((fund) => (
        <Card
          key={fund.id}
          onClick={() => void router.push(`/funds/${fund.id}`)}
        >
          <Card.Header size="xl">
            <div className="flex items-center gap-3">
              <IconButton icon={faMoneyBill1} size="sm" style="secondary" />
              <h3 className="text-lg font-bold">
                {formatToTitleCase(fund.name)}
              </h3>
            </div>
            <span className="text-lg font-bold text-primary-light group-hover:text-primary-med">
              {formatToCurrency(fund.amount)}
            </span>
          </Card.Header>
        </Card>
      ))}
    </>
  );
}
