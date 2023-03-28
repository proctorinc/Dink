import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const AccountSummary = () => {
  const router = useRouter();

  const accountData = api.bankAccounts.getAllData.useQuery();

  return (
    <div
      className="group flex w-full cursor-pointer items-center justify-between rounded-xl bg-primary-med p-4 hover:bg-primary-light hover:text-primary-dark"
      onClick={() => void router.push("/accounts")}
    >
      <div className="flex flex-col">
        <h3 className="text-xl font-bold">Accounts</h3>
        <span className="text-sm text-primary-light group-hover:text-primary-med">
          {accountData.data?.count ?? "No"} linked accounts
        </span>
      </div>
      <button className="flex h-fit items-center gap-2 rounded-lg bg-secondary-med py-2 px-5 font-bold text-secondary-dark group-hover:bg-secondary-light group-hover:text-secondary-med group-hover:text-secondary-light group-hover:ring group-hover:ring-secondary-med">
        <span>{accountData.data?.count ? "View" : "Link"}</span>
        <FontAwesomeIcon className="h-4 w-4" icon={faArrowRight} />
      </button>
    </div>
  );
};

export default AccountSummary;
