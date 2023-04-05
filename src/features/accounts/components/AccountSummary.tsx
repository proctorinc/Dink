import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Button from "~/components/ui/Button";
import Card from "~/components/ui/Card";

export const AccountSummary = () => {
  const router = useRouter();

  const accountData = api.bankAccounts.getAllData.useQuery();

  return (
    <Card horizontal onClick={() => void router.push("/accounts")}>
      <Card.Body horizontal>
        <div className="flex flex-col">
          <h3 className="text-xl font-bold">Accounts</h3>
          <span className="text-sm text-primary-light group-hover:text-primary-med">
            {accountData.data?.count ?? "No"} linked accounts
          </span>
        </div>
        <Button
          title={accountData.data?.count ? "View" : "Link"}
          icon={faArrowRight}
          style="secondary"
          iconRight
        />
      </Card.Body>
    </Card>
  );
};
