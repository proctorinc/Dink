import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type FC, type ReactNode } from "react";

type AuthRouteProps = {
  children: ReactNode;
};

const AuthRoute: FC<AuthRouteProps> = ({ children }) => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  if (!sessionData?.user) {
    void router.push("/login");
  }

  return <>{children}</>;
};

export default AuthRoute;
