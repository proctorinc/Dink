import { useRouter } from "next/router";
import Header from "~/components/ui/Header";

const AccountPage = () => {
  const router = useRouter();
  const { accountId } = router.query;
  return (
    <div className="container flex max-w-md flex-col items-center justify-center gap-12 p-4">
      <div className="flex w-full flex-col items-center gap-4">
        <Header title="Account" subtitle={""} />
        <span>{accountId}</span>
      </div>
    </div>
  );
};

export default AccountPage;
