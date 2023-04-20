import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "~/components/ui/Button";
import Page from "~/components/ui/Page";
import Spinner from "~/components/ui/Spinner";

const Login = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  if (sessionData) {
    void router.push("/");
  }

  if (!sessionData) {
    return (
      <Page title="Login" style="centered">
        <div className="mb-10 flex w-full rounded-xl px-12 text-primary-light">
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-bold">Login</h1>
          </div>
        </div>
        <div className="flex w-full flex-col gap-4 px-12">
          {/* <input
            id="email-input"
            placeholder="Enter Email..."
            className="relative rounded-xl bg-primary-med py-2 px-4 font-bold text-primary-light placeholder-primary-light ring ring-primary-med focus:placeholder-primary-med"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />*/}
          <Button
            title="Login"
            className="w-full"
            style="secondary"
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
  return <Spinner />;
};

export default Login;
