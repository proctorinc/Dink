import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Login = () => {
  const { data } = useSession();
  const router = useRouter();

  if (data) {
    void router.push("/app");
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <button
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={() => void signIn()}
        >
          Login With Google
        </button>
      </div>
    </>
  );
};

export default Login;
