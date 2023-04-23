import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";
import Card from "~/components/ui/Card";
import { ProgressBar } from "~/components/ui/Charts";

export const SavingsSummary = () => {
  const router = useRouter();
  const fundsData = api.funds.getAllData.useQuery();

  if (fundsData.data?.funds.length === 0) {
    return (
      <Card onClick={() => void router.push("/savings")}>
        <Card.Body horizontal>
          <Card.Action
            title="Savings"
            subtitle="No saving funds created"
            actionIcon={faPlus}
            actionText="Add"
          />
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card onClick={() => void router.push("/savings")}>
      <Card.Body>
        <Card.Group
          className="w-full justify-between text-xl font-bold"
          horizontal
        >
          <h3 className="text-xl font-bold">Savings</h3>
          <h3 className="text-lg font-bold text-primary-light group-hover:text-primary-med">
            {formatToCurrency(fundsData?.data?.total)}
          </h3>
        </Card.Group>
        <span className="text-sm text-primary-light group-hover:text-primary-med">
          {formatToCurrency(fundsData.data?.unallocatedTotal)} unallocated
        </span>
        <ProgressBar
          value={fundsData.data?.total}
          goal={fundsData.data?.available}
        />
      </Card.Body>
    </Card>
  );
};