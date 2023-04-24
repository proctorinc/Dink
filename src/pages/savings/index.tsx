import { faCoins, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { ButtonBar } from "~/components/ui/Button";
import Button from "~/components/ui/Button/Button";
import Header from "~/components/ui/Header";
import Page from "~/components/ui/Page";
import Fund, { FundSkeletons, SavingsCharts } from "~/features/funds";
import useNotifications from "~/hooks/useNotifications";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";

export default function Funds() {
  const router = useRouter();
  const fundsData = api.funds.getAllData.useQuery(undefined, {
    onError: () => setErrorNotification("Failed to fetch funds"),
  });

  const { setErrorNotification } = useNotifications();

  const isFundsEmpty = fundsData?.data?.funds.length === 0;

  return (
    <Page auth title="Savings">
      <Header
        title="Savings"
        subtitle={`Total: ${formatToCurrency(fundsData?.data?.total)}`}
      />
      <SavingsCharts data={fundsData?.data} />
      <ButtonBar>
        <Button
          title="Fund"
          icon={faPlus}
          style={isFundsEmpty ? "secondary" : "primary"}
          onClick={() => void router.push("/savings/create")}
        />
        <Button
          title="Allocate"
          icon={faCoins}
          style={isFundsEmpty ? "primary" : "secondary"}
          onClick={() => void router.push("/savings/allocate")}
        />
      </ButtonBar>
      <div className="flex w-full flex-col gap-3">
        {fundsData?.data?.funds.map((fund) => (
          <Fund
            key={fund.id}
            data={fund}
            onClick={() => void router.push(`/savings/${fund.id}`)}
          />
        ))}
        {!fundsData.data && <FundSkeletons />}
      </div>
    </Page>
  );
}
