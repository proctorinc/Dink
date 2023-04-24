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

  if (status === "authenticated") {
    return <>{children}</>;
  }

  if (typeof window !== "undefined" && status === "unauthenticated") {
    void router.push("/login");
  }

  return <LoadingPage />;
};

export default AuthPage;
