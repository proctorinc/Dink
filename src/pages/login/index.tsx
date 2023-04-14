import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { z } from "zod";
import Button from "~/components/ui/Button";
import Page from "~/components/ui/Page";
import Spinner from "~/components/ui/Spinner";

const Login = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");

  const isValidEmail = z.string().email().safeParse(email).success;

  if (sessionData) {
    void router.push("/");
  }

  if (!sessionData) {
    return (
      <Page title="Login" style="centered">
        <div className="mb-20 flex w-full rounded-xl px-12 text-primary-light">
          <div className="flex flex-col gap-2">
            <h1 className="text-7xl font-bold">Login</h1>
          </div>
        </div>
        <div className="flex w-full flex-col gap-4 px-12">
          <input
            id="email-input"
            placeholder="Enter Email..."
            className="relative rounded-xl bg-primary-med py-2 px-4 font-bold text-primary-light placeholder-primary-light ring ring-primary-med focus:placeholder-primary-med"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button
            title="Request Access"
            className="w-full"
            style={isValidEmail ? "secondary" : "primary"}
            disabled={!isValidEmail}
            onClick={() => void signIn("google")}
          />
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="h-0.5 w-full rounded-full bg-primary-med" />
            <span className="font-bold text-primary-light">OR</span>
            <div className="h-0.5 w-full rounded-full bg-primary-med" />
          </div>
          <Button
            title="Login as Guest"
            className="w-full"
            style={isValidEmail ? "primary" : "secondary"}
            onClick={() => void signIn("google")}
          />
        </div>
      </Page>
    );
  }
  return <Spinner />;
};

export default Login;
