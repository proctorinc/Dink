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
    <main className="flex flex-grow flex-col items-center justify-center text-white">
      <div className="flex w-full max-w-md flex-grow flex-col items-center justify-center px-4">
        <div className="animate-spin">
          <FontAwesomeIcon
            size="3x"
            className="text-primary-light"
            icon={faCircleHalfStroke}
          />
        </div>
      </div>
    </main>
  );
};

export default AuthPage;
