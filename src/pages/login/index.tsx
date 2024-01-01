import {
  faArrowRight,
  faCircleHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type GetServerSideProps } from "next";
import { getSession, signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import LoadingPage from "~/components/ui/LoadingPage";

const Login = () => {
  const { status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    void router.push("/");
  }

  if (status === "unauthenticated") {
    return (
      <>
        <Head>
          <title>Login</title>
        </Head>
        <main className="flex h-screen w-full items-end justify-center">
          <div
            className="absolute top-0 z-0 h-screen w-full"
            style={{
              backgroundImage: `url(/static/images/stacked-waves-horizontal-light.svg)`,
              backgroundSize: "cover",
            }}
          ></div>
          <div className="z-10 flex h-3/5 w-full max-w-xs flex-col justify-between pt-8 pb-20 lg:pt-0">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-center gap-2 text-primary-light">
                <FontAwesomeIcon
                  size="4x"
                  className=""
                  icon={faCircleHalfStroke}
                />
                <h1 className="text-7xl font-extrabold">Dink</h1>
              </div>
              <h3 className="text-center font-bold text-white">
                Simplify the way you save
              </h3>
            </div>
            <button
              className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-lg font-bold text-white shadow-md shadow-primary-dark"
              onClick={() => void signIn("google")}
            >
              Get started
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </main>
      </>
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
