import { useRouter } from "next/router";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";
import Button from "~/components/ui/Button";
import Card from "~/components/ui/Card";

export const TransactionsSummary = () => {
  const router = useRouter();
  const uncategorizedTransactions =
    api.transactions.getUncategorized.useQuery();

  return (
    <Card onClick={() => void router.push("/transactions/categorize")}>
      <Card.Body horizontal>
        <div className="flex flex-col">
          <h3 className="text-xl font-bold">Transactions</h3>
          <span className="text-sm text-primary-light group-hover:text-primary-med">
            {uncategorizedTransactions?.data?.length ?? ""} uncategorized
          </span>
        </div>
        <Button
          title="Categorize"
          icon={faArrowRight}
          style="secondary"
          iconRight
        />
      </Card.Body>
    </Card>
  );
};
