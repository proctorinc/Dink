import { faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type FC, type ReactNode } from "react";

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

  return (
    <>
      {children}
      <div className="absolute z-50 flex h-screen w-full items-center justify-center bg-primary-dark/50 backdrop-blur-sm">
        <FontAwesomeIcon
          size="3x"
          className="animate-spin text-primary-light"
          icon={faCircleHalfStroke}
        />
      </div>
    </>
  );
};

export default AuthPage;
