import {
  faArrowRight,
  faCircleHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "~/components/ui/Button";
import Spinner from "~/components/ui/Spinner";

const Login = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  if (sessionData) {
    void router.push("/");
  }

  if (!sessionData) {
    return (
      <div className="flex flex-col items-center gap-5 pt-52">
        <div
          className="flex items-center gap-3 rounded-xl pb-10 text-7xl font-bold text-primary-light"
          onClick={() => void router.push("/")}
        >
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
      </div>
    );
  }
  return <Spinner />;
};

export default Login;
