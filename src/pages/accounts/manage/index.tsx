import { api } from "~/utils/api";
import Header from "~/components/ui/Header";
import Page from "~/components/ui/Page";
import useNotifications from "~/hooks/useNotifications";
import { Institution, InstitutionSkeletons } from "~/features/accounts";

export default function BankAccounts() {
  const { setErrorNotification } = useNotifications();
  const institutions = api.bankAccounts.getInstitutions.useQuery(undefined, {
    onError: () => setErrorNotification("Failed to fetch Institutions"),
  });

  return (
    <Page auth title="Manage Accounts" style="normal">
      <Header title="Manage Accounts" />
      {institutions?.data &&
        institutions.data.map((institution) => (
          <Institution key={institution.id} data={institution} />
        ))}
      {!institutions.data && <InstitutionSkeletons />}
    </Page>
  );
}
