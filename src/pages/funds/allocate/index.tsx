import {
  faCheck,
  faDollarSign,
  faRedo,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Fund as FundType, Prisma } from "@prisma/client";
import { useState } from "react";
import Button from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import Header from "~/components/ui/Header";
import Fund from "~/features/funds";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";

export default function AllocateFundsPage() {
  const fundsData = api.funds.getAllData.useQuery();
  const createAllocation = api.transactions.createFundAllocation.useMutation();
  const [fund, setFund] = useState<
    (FundType & { amount: Prisma.Decimal }) | null
  >();
  const [amount, setAmount] = useState(0);
  const [name, setName] = useState("");

  const isValidAmount =
    fundsData.data &&
    amount > 0 &&
    new Prisma.Decimal(amount) <= fundsData.data.unallocatedTotal;

  const allocateFunds = () => {
    if (!!fund && !!name && isValidAmount) {
      const result = createAllocation.mutate({ fundId: fund.id, amount, name });
      console.log(result);
      setFund(null);
      setAmount(0);
      setName("");
    }
  };

  return (
    <>
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
          {fund && <Fund data={fund} onClick={() => setFund(null)} />}
        </Card.Collapse>
        <Card.Collapse
          open={!fund}
          className="max-h-1/4 overflow-y-scroll rounded-xl"
        >
          <div className="w-full rounded-xl">
            {fundsData?.data?.funds.map((fund) => (
              <Fund key={fund.id} data={fund} onClick={() => setFund(fund)} />
            ))}
          </div>
        </Card.Collapse>
      </Card>
      <Card>
        <Card.Body horizontal>
          <Card.Group>
            <label htmlFor="amount-input" className="font-bold">
              Name:
            </label>
            <Card.Group horizontal>
              <span className="text-2xl font-bold text-primary-light">
                <FontAwesomeIcon icon={faTag} />
              </span>
              <input
                id="name-input"
                placeholder="Enter name..."
                className="bg-primary-med text-xl font-bold text-primary-light placeholder-primary-light"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Card.Group>
            <label htmlFor="amount-input" className="font-bold">
              Amount:
            </label>
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
          </Card.Group>
        </Card.Body>
      </Card>
      <div className="flex w-full justify-center gap-2">
        <Button
          title="Reselect"
          icon={faRedo}
          disabled={!fund || !isValidAmount}
          onClick={() => setFund(null)}
        />
        <Button
          title="Allocate"
          icon={faCheck}
          disabled={!fund || !isValidAmount}
          active
          onClick={allocateFunds}
        />
      </div>
    </>
  );
}
