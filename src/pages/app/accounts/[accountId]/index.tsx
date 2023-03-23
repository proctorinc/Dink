import { useRouter } from "next/router";

const AccountPage = () => {
  const router = useRouter();
  const { accountId } = router.query;
  return <div>Account: {accountId}</div>;
};

export default AccountPage;
