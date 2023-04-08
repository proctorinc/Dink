import {
  faArrowRight,
  faCircleHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
        <div className="flex items-center gap-3 rounded-xl pb-40 text-7xl font-bold text-primary-light">
          <FontAwesomeIcon
            className="h-[52px] w-[52px]"
            icon={faCircleHalfStroke}
          />
          <span>Dink</span>
        </div>
        <Button
          title="Login"
          className="w-48"
          style="secondary"
          icon={faArrowRight}
          onClick={() => void signIn()}
          iconRight
        />
      </Page>
    );
  }
  return <Spinner />;
};

export default Login;
