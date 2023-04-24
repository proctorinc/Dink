import { faG } from "@fortawesome/free-solid-svg-icons";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "~/components/ui/Button";
import Header from "~/components/ui/Header";
import LoadingPage from "~/components/ui/LoadingPage";
import Page from "~/components/ui/Page";

const Login = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const { from } = router.query;

  if (sessionData?.user) {
    if (from && typeof from === "string") {
      console.log(`Redirect to ${from}`);
      void router.push(`${from}`);
    }
    void router.push("/");
  }

  if (!sessionData?.user) {
    return (
      <Page title="Login" style="centered">
        <div className="w-full px-4">
          <Header title="Login" />
        </div>
        <div className="flex w-full flex-col gap-4 px-4 pt-10">
          <Button
            title="Login with Google"
            className="w-full"
            style="secondary"
            icon={faG}
            onClick={() => void signIn("google")}
          />
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="h-0.5 w-full rounded-full bg-primary-med" />
            <span className="text-xs font-bold text-primary-light">OR</span>
            <div className="h-0.5 w-full rounded-full bg-primary-med" />
          </div>
          <Button
            title="Try Demo"
            className="w-full"
            style="primary"
            onClick={() => void signIn("google")}
            disabled
          />
        </div>
      </Page>
    );
  }
  return <LoadingPage />;
};

export default Login;
