import { faEnvelope, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { type GetServerSideProps } from "next";
import { getSession, signIn } from "next-auth/react";
import Button from "~/components/ui/Button";
import Header from "~/components/ui/Header";
import Page from "~/components/ui/Page";

const Login = () => {
  return (
    <Page title="Login" style="centered">
      <div className="w-full max-w-sm px-4">
        <Header title="Login" />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-4 px-4 pt-10">
        <Button
          title="Try the Demo"
          className="w-full"
          style="secondary"
          icon={faPaperPlane}
          onClick={() => void signIn("google")}
        />
        <div className="flex items-center justify-center gap-3 py-2">
          <div className="h-0.5 w-full rounded-full bg-primary-med" />
          <span className="text-xs font-bold text-primary-light">OR</span>
          <div className="h-0.5 w-full rounded-full bg-primary-med" />
        </div>
        <Button
          title="Request Access"
          className="w-full"
          style="primary"
          icon={faEnvelope}
          disabled
          onClick={() =>
            alert("This functionality has not been implemented yet")
          }
        />
      </div>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req });
  const from = query.from as string;

  if (session) {
    if (!session.user.isProfileComplete) {
      return {
        redirect: {
          destination: "/profile/setup",
          permanent: false,
        },
        props: {},
      };
    } else {
      return {
        redirect: {
          destination: from ?? "/",
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
