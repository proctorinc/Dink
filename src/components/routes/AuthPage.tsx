import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type FC, type ReactNode } from "react";

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

  return <>{children}</>;
};

export default AuthPage;
