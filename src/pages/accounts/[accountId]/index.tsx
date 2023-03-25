import { useRouter } from "next/router";
import Header from "~/components/ui/Header";

const AccountPage = () => {
  const router = useRouter();
  const { accountId } = router.query;
  return (
    <>
      <Header title="Account" subtitle={""} />
      <span>{accountId}</span>
    </>
  );
};

export default AccountPage;
