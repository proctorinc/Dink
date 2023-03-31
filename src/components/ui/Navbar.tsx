import { faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  return (
    <nav className="absolute sticky top-0 z-30 flex w-full justify-center bg-primary-dark/90 py-2 pl-2 pr-4 text-primary-light backdrop-blur-sm md:flex">
      <div className="flex w-full max-w-lg items-center justify-center justify-between sm:max-w-4xl">
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
        {sessionData?.user && (
          <button
            className="aspect-square w-10 rounded-full bg-secondary-dark text-secondary-med hover:bg-secondary-med hover:text-secondary-light"
            onClick={() => void router.push("/profile")}
          >
            {sessionData?.user.image && (
              <Image
                className="w-full rounded-full border-2 border-primary-med"
                width={10}
                height={10}
                src={sessionData?.user.image}
                alt="user-image"
              />
            )}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
