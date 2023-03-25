import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Login = () => {
  const { data } = useSession();
  const router = useRouter();

  if (data) {
    void router.push("/");
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <button
          className="rounded-xl bg-primary-med py-2 px-5 font-bold text-primary-light hover:bg-primary-light hover:text-primary-med hover:ring hover:ring-primary-med"
          onClick={() => void signIn()}
        >
          Login With Google
        </button>
      </div>
    </>
  );
};

export default Login;
