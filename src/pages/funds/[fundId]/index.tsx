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
  faCoins,
  faGear,
  faMoneyBill1,
} from "@fortawesome/free-solid-svg-icons";
import Card from "~/components/ui/Card";
import Button, { ButtonBar } from "~/components/ui/Button";
import { useState } from "react";
import ConfirmDelete from "~/components/ui/ConfirmDelete";
import EditableTitle from "~/components/ui/EditableTitle";
import Page from "~/components/ui/Page";
import { LineChart } from "~/components/ui/Charts";
import { type Serie } from "@nivo/line";

const FundPage = () => {
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { convertToIcon } = useIcons();
  const { fundId } = router.query;
  const strFundId = typeof fundId === "string" ? fundId : null;
  const deleteFund = api.funds.delete.useMutation();
  const updateFundName = api.funds.update.useMutation();
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

  const handleNameUpdate = (name: string) => {
    updateFundName.mutate({ fundId: fund?.id ?? "", name });
  };

  const data: Serie[] = [
    {
      id: "Line",
      data: [
        { x: 1, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 3 },
        { x: 4, y: 2 },
        { x: 5, y: 5 },
        { x: 6, y: 6 },
        { x: 7, y: 8 },
        { x: 8, y: 5 },
        { x: 9, y: 9 },
        { x: 10, y: 9 },
      ],
    },
  ];

  if (fundData.isLoading) {
    return <Spinner />;
  }

  if (!fund) {
    <div>Not Found</div>;
  }

  return (
    <Page auth title="Fund" style="basic">
      <div className="w-full px-4">
        <Header
          back
          title={
            <EditableTitle value={fund?.name} onUpdate={handleNameUpdate} />
          }
          icon={convertToIcon(fund?.icon) ?? faMoneyBill1}
          subtitle={`Total: ${formatToCurrency(fundData?.data?.amount)}`}
        />
      </div>
      <div className="flex h-40 w-full flex-col">
        <LineChart data={data} />
      </div>
      <div className="flex w-full flex-col gap-4 px-4">
        <ButtonBar>
          <Button
            icon={settingsOpen ? faAngleUp : faGear}
            onClick={() => setSettingsOpen((prev) => !prev)}
          />
          <Button
            title="Allocate"
            icon={faCoins}
            style="secondary"
            onClick={() => void router.push("/funds/allocate")}
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
        {fundData?.data?.sourceTransactions?.length === 0 && (
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
          {fundData.data?.sourceTransactions.map((source) => (
            <NoSourceTransaction
              key={source.transaction.id}
              data={source.transaction}
            />
          ))}
        </div>
      </div>
    </Page>
  );
};

export default FundPage;
