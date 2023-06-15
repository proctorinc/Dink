import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type FC, type ReactNode } from "react";
import LoadingPage from "../ui/LoadingPage";

type AuthPageProps = {
  children: ReactNode;
};

const AuthPage: FC<AuthPageProps> = ({ children }) => {
  const router = useRouter();
  const { status } = useSession();

  if (typeof window !== "undefined" && status === "unauthenticated") {
    void router.push({
      pathname: "/login",
      query: {
        from: router.pathname,
      },
    });
  }

  if (typeof window !== "undefined" && status === "authenticated") {
    return <>{children}</>;
  }

  return <LoadingPage />;
};

export default AuthPage;
