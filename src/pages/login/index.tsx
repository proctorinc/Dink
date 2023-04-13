import { faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { z } from "zod";
import Button, { IconButton } from "~/components/ui/Button";
import Card from "~/components/ui/Card";
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
            <h3 className="text-3xl font-bold text-primary-med">
              Let&apos;s get started!
            </h3>
          </div>
        </div>
        <div className="flex w-full flex-col gap-4 px-12">
          <Card>
            <Card.Body>
              <Card.Group horizontal>
                <IconButton size="sm" icon={faEnvelope} />
                <input
                  id="email-input"
                  placeholder={"Enter Email..."}
                  className="bg-primary-med text-xl font-bold text-primary-light placeholder-primary-light focus:placeholder-primary-med"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Card.Group>
            </Card.Body>
          </Card>
          <Button
            title="Request Access"
            className="w-full"
            style={isValidEmail ? "secondary" : "primary"}
            disabled={!isValidEmail}
            onClick={() => void signIn("google")}
          />
          <Button
            title="Login as Guest"
            className="w-full"
            style={isValidEmail ? "primary" : "secondary"}
            icon={faUser}
            onClick={() => void signIn("google")}
          />
        </div>
      </Page>
    );
  }
  return <Spinner />;
};

export default Login;
