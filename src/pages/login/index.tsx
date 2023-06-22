import {
  faArrowRight,
  faCircleHalfStroke,
  faEnvelope,
  faPaperPlane,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type GetServerSideProps } from "next";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { z } from "zod";
import Button, { IconButton } from "~/components/ui/Button";
import Card from "~/components/ui/Card";
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
        <div
          className="absolute top-0 z-0 h-screen w-full"
          style={{
            backgroundImage: `url(/static/images/stacked-waves-horizontal-light.svg)`,
            backgroundSize: "cover",
          }}
        ></div>
        <div className="absolute top-0 flex h-screen w-full items-center justify-center p-4">
          <Card className="z-10 flex w-full max-w-sm flex-col items-center bg-primary-light bg-primary-light/10 from-primary-light/10 to-primary-light/10 shadow-2xl backdrop-blur-sm">
            <Card.Body className="items-center">
              <div className="flex items-center gap-2 rounded-xl py-1 px-3 text-5xl font-bold text-primary-light">
                <FontAwesomeIcon
                  className="h-10 w-10 text-primary-light"
                  icon={faCircleHalfStroke}
                />
                <span>Dink</span>
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
                  <span className="text-xs font-bold text-primary-light">
                    OR
                  </span>
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
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        placeholder="Enter Email..."
                        className="w-full rounded-xl bg-primary-med py-2 px-5 text-lg font-bold text-primary-light placeholder-primary-light"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                      <IconButton
                        size="sm"
                        icon={faSquareXmark}
                        onClick={() => {
                          setOpen(false);
                          setEmail("");
                        }}
                      />
                    </div>
                    <Button
                      title={open ? "Submit" : "Request Access"}
                      className="w-full"
                      style="secondary"
                      size="lg"
                      icon={open ? faArrowRight : faEnvelope}
                      type="submit"
                      iconRight={open}
                    />
                  </form>
                )}
              </div>
            </Card.Body>
          </Card>
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
