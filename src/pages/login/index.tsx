import { faEnvelope, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { type GetServerSideProps } from "next";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { z } from "zod";
import Button from "~/components/ui/Button";
import Header from "~/components/ui/Header";
import LoadingPage from "~/components/ui/LoadingPage";
import Page from "~/components/ui/Page";
import useNotifications from "~/hooks/useNotifications";
import { api } from "~/utils/api";

const Login = () => {
  const { status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const notifications = useNotifications();

  const requestAccessMutation = api.users.requestFullAccess.useMutation({
    onSuccess: () => {
      notifications.setSuccessNotification(
        "Successfully requested. Updates will be sent via email"
      );
    },
    onError: () => {
      notifications.setErrorNotification("Failed to request access. Try again");
    },
  });

  const LoginSchema = z.object({
    email: z
      .string()
      .min(1, { message: "This field has to be filled." })
      .email("Enter a valid email"),
  });

  const requestAccess = () => {
    const result = LoginSchema.safeParse({ email });
    if (result.success) {
      void requestAccessMutation.mutate({ email });
      notifications.setLoadingNotification("Requesting Access...");
      setOpen(false);
      setEmail("");
    } else {
      notifications.setErrorNotification("Enter a valid email");
    }
  };

  if (status === "authenticated") {
    void router.push("/");
  }

  if (status === "unauthenticated") {
    return (
      <Page title="Login" style="centered">
        <div className="w-full max-w-sm px-4">
          <Header title="Login" />
        </div>
        <div className="flex w-full max-w-sm flex-col gap-4 px-4 pt-10">
          <Button
            title="Try the Demo"
            className="w-full"
            style={open ? "primary" : "secondary"}
            icon={faPaperPlane}
            onClick={() => void signIn("google")}
          />
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="h-0.5 w-full rounded-full bg-primary-med" />
            <span className="text-xs font-bold text-primary-light">OR</span>
            <div className="h-0.5 w-full rounded-full bg-primary-med" />
          </div>
          {!open && (
            <Button
              title="Request Access"
              className="w-full"
              style="primary"
              icon={faEnvelope}
              onClick={() => setOpen(true)}
            />
          )}
          {open && (
            <form
              onSubmit={requestAccess}
              className="flex w-full flex-col gap-4"
            >
              <input
                autoFocus
                placeholder="Enter Email..."
                className="rounded-xl bg-primary-med py-2 px-5 text-lg font-bold text-primary-light placeholder-primary-light"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Button
                title="Request Access"
                className="w-full"
                style="secondary"
                size="lg"
                icon={faEnvelope}
                type="submit"
              />
            </form>
          )}
        </div>
      </Page>
    );
  }
  return <LoadingPage />;
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req });
  const from = query.from;

  if (session) {
    if (session.user.isProfileComplete) {
      return {
        redirect: {
          destination: from ?? "/",
          permanent: false,
        },
        props: {},
      };
    } else {
      return {
        redirect: {
          destination: "/profile/setup",
          permanent: false,
        },
        props: {},
      };
    }
  }

  return {
    props: {},
  };
};

export default Login;
