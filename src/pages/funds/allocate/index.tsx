import {
  faAngleRight,
  faCheck,
  faDollarSign,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Fund as FundType, type Prisma } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import Button, { IconButton } from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import Header from "~/components/ui/Header";
import Page from "~/components/ui/Page";
import Fund from "~/features/funds";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";

export default function AllocateFundsPage() {
  const router = useRouter();
  const ctx = api.useContext();
  const fundsData = api.funds.getAllData.useQuery();
  const createAllocation = api.transactions.createFundAllocation.useMutation({
    onSuccess: () => void ctx.invalidate(),
  });
  const [fund, setFund] = useState<
    (FundType & { amount: Prisma.Decimal }) | null
  >();
  const [amount, setAmount] = useState(0);
  const [name, setName] = useState("");

  const isValidData = fundsData.data && !!fund && !!name && amount > 0;

  const allocateFunds = () => {
    if (isValidData) {
      createAllocation.mutate({ fundId: fund.id, amount, name });
      void router.push("/funds");
    }
  };

  return (
    <Page auth title="Allocate">
      <Header
        back
        title={`Allocate Funds`}
        subtitle={`Available: ${formatToCurrency(
          fundsData.data?.unallocatedTotal
        )}`}
      />
      <Card>
        <Card.Header>
          <h3>{fund ? "Fund:" : "Select Fund:"}</h3>
        </Card.Header>
        <Card.Collapse open={!!fund}>
          <Card onClick={() => setFund(null)}>
            <div className="flex gap-3">
              {fund && <Fund data={fund} />}
              <IconButton icon={faAngleRight} />
            </div>
          </Card>
        </Card.Collapse>
        <Card.Collapse
          open={!fund}
          className="max-h-64 overflow-y-scroll rounded-xl"
        >
          <Card.Group size="sm">
            {fundsData?.data?.funds.map((fund) => (
              <Fund key={fund.id} data={fund} onClick={() => setFund(fund)} />
            ))}
          </Card.Group>
        </Card.Collapse>
      </Card>
      <Card>
        <Card.Header>
          <label htmlFor="name-input" className="font-bold">
            Name:
          </label>
        </Card.Header>
        <Card.Body>
          <Card.Group horizontal>
            <span className="text-2xl font-bold text-primary-light">
              <FontAwesomeIcon icon={faPencil} />
            </span>
            <input
              id="name-input"
              placeholder="..."
              className="bg-primary-med text-xl font-bold text-primary-light placeholder-primary-light focus:placeholder-primary-med"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Card.Group>
        </Card.Body>
        <Card.Header>
          <label htmlFor="amount-input" className="font-bold">
            Amount:
          </label>
        </Card.Header>
        <Card.Body>
          <Card.Group horizontal>
            <span className="text-2xl font-bold text-primary-light">
              <FontAwesomeIcon icon={faDollarSign} />
            </span>
            <input
              id="amount-input"
              type="number"
              className="bg-primary-med text-xl font-bold text-primary-light"
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
            />
          </Card.Group>
        </Card.Body>
      </Card>
      <Button
        title="Allocate"
        icon={faCheck}
        disabled={!isValidData}
        style="secondary"
        onClick={allocateFunds}
      />
    </Page>
  );
}
