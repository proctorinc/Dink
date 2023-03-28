import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import NoSourceTransaction from "~/components/transactions/NoSourceTransaction";
import Header from "~/components/ui/Header";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";

const FundPage = () => {
  const router = useRouter();
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
    return (
      <div className="flex w-full justify-center">
        <FontAwesomeIcon
          className="animate-spin text-primary-light"
          size="2xl"
          icon={faSpinner}
        />
      </div>
    );
  }

  if (!fundData.data) {
    <div>Not Found</div>;
  }

  return (
    <>
      <Header
        back
        title={fundData?.data?.name}
        subtitle={formatToCurrency(fundData?.data?.amount)}
      />
      <div className="w-full">
        <h2 className="text-left text-xl text-primary-light">Transactions</h2>
      </div>
      {!fundData?.data?.source_transactions?.length && (
        <div className="group flex w-full items-center justify-between rounded-xl bg-primary-med px-4 py-2">
          None
        </div>
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
