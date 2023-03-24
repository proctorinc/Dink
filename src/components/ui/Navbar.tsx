import {
  faBars,
  faCircleHalfStroke,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  return (
    <nav className="absolute sticky top-0 z-50 flex w-full justify-center bg-primary-dark/90 py-2 px-4 text-primary-light backdrop-blur-md md:flex">
      <div className="flex w-full max-w-lg items-center justify-center justify-between">
        <FontAwesomeIcon
          className="invisible h-8 w-8 rounded-full p-2 text-primary-light hover:bg-primary-light hover:text-primary-med sm:flex"
          icon={faBars}
        />
        <button
          className="flex items-center gap-2 rounded-xl py-1 px-3 text-3xl font-bold"
          onClick={() => void router.push("/app")}
        >
          <FontAwesomeIcon
            className="h-6 w-6 text-primary-light"
            icon={faCircleHalfStroke}
          />
          <span>Dink</span>
        </button>
        <button
          className="h-8 w-8 rounded-full bg-secondary-dark text-secondary-med hover:bg-secondary-med hover:text-secondary-light"
          onClick={() => void router.push("/app/user")}
        >
          {sessionData?.user.image ? (
            <Image
              className="w-8 rounded-full ring ring-primary-med"
              width={10}
              height={10}
              src={sessionData?.user.image ?? "/favicon.ico"}
              alt="user-image"
            />
          ) : (
            <FontAwesomeIcon size="lg" icon={faUser} />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
