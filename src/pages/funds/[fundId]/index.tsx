import { useRouter } from "next/router";
import { NoSourceTransaction } from "~/features/transactions";
import Header from "~/components/ui/Header";
import Spinner from "~/components/ui/Spinner";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";
import useIcons from "~/hooks/useIcons";
import { faArrowRight, faMoneyBill1 } from "@fortawesome/free-solid-svg-icons";
import Card from "~/components/ui/Card";

const FundPage = () => {
  const router = useRouter();
  const { convertToIcon } = useIcons();
  const { fundId } = router.query;
  const strFundId = typeof fundId === "string" ? fundId : null;
  const fundData = api.funds.getById.useQuery(
    {
      fundId: strFundId ?? "",
    },
    {
      enabled: !!fundId,
    }
  );

  if (fundData.isLoading) {
    return <Spinner />;
  }

  if (!fundData.data) {
    <div>Not Found</div>;
  }

  return (
    <>
      <Header
        back
        title={fundData?.data?.name}
        icon={convertToIcon(fundData?.data?.icon) ?? faMoneyBill1}
        subtitle={`Total: ${formatToCurrency(fundData?.data?.amount)}`}
      />
      <div className="w-full">
        <h2 className="text-left text-xl text-primary-light">Transactions</h2>
      </div>
      {!fundData?.data?.source_transactions?.length && (
        <Card onClick={() => void router.push("/funds/allocate")}>
          <Card.Body size="sm" horizontal>
            <Card.Action
              title="No Transactions"
              actionText="Allocate"
              actionIcon={faArrowRight}
            />
          </Card.Body>
        </Card>
      )}
      <div className="flex w-full flex-col gap-3">
        {fundData.data &&
          fundData.data.source_transactions.map((transaction) => (
            <NoSourceTransaction key={transaction.id} data={transaction} />
          ))}
      </div>
    </>
  );
};

export default FundPage;
