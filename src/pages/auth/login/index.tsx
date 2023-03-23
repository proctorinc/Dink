import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

const Login = () => {
  const { data } = useSession();
  const router = useRouter();

  if (data) {
    router.push("/banana");
  }

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            <button
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              onClick={() => void signIn()}
            >
              Login With Google
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;