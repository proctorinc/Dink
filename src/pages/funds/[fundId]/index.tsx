import { useRouter } from "next/router";
import { NoSourceTransaction } from "~/features/transactions";
import Header from "~/components/ui/Header";
import Spinner from "~/components/ui/Spinner";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";
import useIcons from "~/hooks/useIcons";
import {
  faAngleUp,
  faArrowRight,
  faGear,
  faMoneyBill1,
} from "@fortawesome/free-solid-svg-icons";
import Card from "~/components/ui/Card";
import Button, { ButtonBar } from "~/components/ui/Button";
import { useState } from "react";
import ConfirmDelete from "~/components/ui/ConfirmDelete";

const FundPage = () => {
  const router = useRouter();
  const ctx = api.useContext();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { convertToIcon } = useIcons();
  const { fundId } = router.query;
  const strFundId = typeof fundId === "string" ? fundId : null;
  const deleteFund = api.funds.delete.useMutation({
    onSuccess: () => void ctx.invalidate(),
  });
  const fundData = api.funds.getById.useQuery(
    {
      fundId: strFundId ?? "",
    },
    {
      enabled: !!fundId,
    }
  );
  const fund = fundData.data;

  const handleDeleteFund = () => {
    deleteFund.mutate({ fundId: fund?.id ?? "" });
    void router.push("/funds");
  };

  if (fundData.isLoading) {
    return <Spinner />;
  }

  if (!fund) {
    <div>Not Found</div>;
  }

  return (
    <>
      <Header
        back
        title={fund?.name}
        icon={convertToIcon(fund?.icon) ?? faMoneyBill1}
        subtitle={`Total: ${formatToCurrency(fundData?.data?.amount)}`}
      />
      <ButtonBar>
        <Button
          icon={settingsOpen ? faAngleUp : faGear}
          onClick={() => setSettingsOpen((prev) => !prev)}
        />
      </ButtonBar>
      {settingsOpen && (
        <ButtonBar>
          <ConfirmDelete
            confirmationText={fund?.name ?? "delete fund"}
            onDelete={handleDeleteFund}
          />
        </ButtonBar>
      )}
      <div className="w-full">
        <h2 className="text-left text-xl text-primary-light">Transactions</h2>
      </div>
      {fundData?.data?.source_transactions?.length === 0 && (
        <Card>
          <Card.Header>
            <h3>No Transactions</h3>
          </Card.Header>
          <Card.Body>
            <Card.Group>
              <Button
                title="Allocate Funds"
                icon={faArrowRight}
                style="secondary"
                iconRight
                onClick={() => void router.push("/funds/allocate")}
              />
              <Button
                title="Categorize Transactions"
                icon={faArrowRight}
                style="secondary"
                iconRight
                onClick={() => void router.push("/transactions/categorize")}
              />
            </Card.Group>
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
