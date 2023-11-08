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
        {/* <div
          className="absolute top-0 z-0 h-screen w-full"
          style={{
            backgroundImage: `url(/static/images/stacked-waves-horizontal-light.svg)`,
            backgroundSize: "cover",
          }}
        ></div> */}
        <div className="absolute top-0 flex h-screen w-full items-center justify-center p-4">
          <div className="w-full max-w-sm">
            <div className="items-center">
              <div className="flex flex-col justify-center gap-2 rounded-xl px-3 py-1 text-left text-5xl font-bold text-primary-light">
                <span>Welcome to</span>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    className="h-10 w-10 text-primary-light"
                    icon={faCircleHalfStroke}
                  />
                  <span>Dink</span>
                </div>
              </div>
              <div className="mt-10 flex w-full max-w-sm flex-col gap-4 rounded-xl bg-gray-100 p-4 shadow-md">
                <Button
                  title="Try the Demo"
                  className="w-full"
                  style={open ? "primary" : "secondary"}
                  icon={faPaperPlane}
                  onClick={() => void signIn("google")}
                />
                <div className="flex items-center justify-center gap-3 py-2">
                  <div className="h-0.5 w-full rounded-full bg-gray-300" />
                  <span className="text-xs font-bold text-gray-300">OR</span>
                  <div className="h-0.5 w-full rounded-full bg-gray-300" />
                </div>
                {!open && (
                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 font-bold text-gray-600 shadow-md"
                    onClick={() => setOpen(true)}
                  >
                    <FontAwesomeIcon icon={faEnvelope} />
                    Request Full Access
                  </button>
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
            </div>
          </div>
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
