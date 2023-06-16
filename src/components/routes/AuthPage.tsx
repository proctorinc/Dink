import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type FC, type ReactNode } from "react";
import LoadingPage from "../ui/LoadingPage";

type AuthPageProps = {
  children: ReactNode;
};

const AuthPage: FC<AuthPageProps> = ({ children }) => {
  const router = useRouter();
  const { data: sessionData, status } = useSession();

  if (typeof window !== "undefined") {
    if (status === "unauthenticated") {
      if (router.pathname === "/") {
        void router.push({
          pathname: "/login",
        });
      } else {
        void router.push({
          pathname: "/login",
          query: {
            from: router.pathname,
          },
        });
      }
    } else if (status === "authenticated") {
      if (router.pathname === "/profile/setup") {
        if (sessionData?.user.isProfileComplete) {
          void router.push({
            pathname: "/",
          });
        }
      } else if (!sessionData?.user.isProfileComplete) {
        void router.push({
          pathname: "/profile/setup",
        });
      }
      return <>{children}</>;
    }
  }
  return <LoadingPage />;
};

export default AuthPage;
