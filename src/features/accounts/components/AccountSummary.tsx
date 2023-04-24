import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { type FC } from "react";
import Button from "~/components/ui/Button";
import Card from "~/components/ui/Card";

type AccountSummaryProps = {
  data: {
    count: number;
  };
};

export const AccountSummary: FC<AccountSummaryProps> = ({
  data: accountData,
}) => {
  const router = useRouter();

  return (
    <Card horizontal onClick={() => void router.push("/accounts")}>
      <Card.Body horizontal>
        <div className="flex flex-col">
          <h3 className="text-xl font-bold">Accounts</h3>
          <span className="text-sm text-primary-light group-hover:text-primary-med">
            {accountData.count ?? "No"} linked accounts
          </span>
        </div>
        <Button
          title={accountData.count ? "View" : "Link"}
          icon={accountData.count ? faArrowRight : faPlus}
          style="secondary"
          iconRight
        />
      </Card.Body>
    </Card>
  );
};
