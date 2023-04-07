"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type FC, type ReactNode } from "react";
import Spinner from "../ui/Spinner";

type AuthPageProps = {
  children: ReactNode;
};

const AuthPage: FC<AuthPageProps> = ({ children }) => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  if (typeof window !== "undefined" && !sessionData) {
    void router.push("/login");
  }

  if (sessionData) {
    return <>{children}</>;
  }

  return <Spinner />;
};

export default AuthPage;
