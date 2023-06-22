import { faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import useNotifications from "~/hooks/useNotifications";
import { Notification } from "../Notification/Notification";

const Navbar = () => {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const { type, message } = useNotifications();

  return (
    <>
      <nav className="sticky top-0 z-30 flex w-full flex-col items-center justify-center gap-1 py-2 pl-2 pr-4 text-primary-light backdrop-blur-lg md:flex">
        <div className="flex w-full max-w-lg items-center justify-between sm:max-w-4xl">
          <button
            className="flex items-center gap-2 rounded-xl py-1 px-3 text-3xl font-bold"
            onClick={() => void router.push("/")}
          >
            <FontAwesomeIcon
              className="h-6 w-6 text-primary-light"
              icon={faCircleHalfStroke}
            />
            <span>Dink</span>
          </button>
          {status === "authenticated" && (
            <button
              className="aspect-square w-10 rounded-full bg-primary-med shadow-lg"
              onClick={() => void router.push("/profile")}
            >
              {sessionData?.user.image && (
                <Image
                  className="w-full rounded-full shadow-lg"
                  width={10}
                  height={10}
                  src={sessionData?.user.image}
                  alt="user-image"
                />
              )}
            </button>
          )}
          {status === "loading" && (
            <div className="aspect-square w-10 animate-pulse rounded-full bg-primary-med/50 shadow-lg" />
          )}
        </div>
        {type && message && (
          <div className="flex w-full justify-center">
            <div className="w-full max-w-md">
              <Notification type={type} message={message} />
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
