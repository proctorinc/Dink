import {
  faBars,
  faCircleHalfStroke,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="absolute sticky top-0 z-50 flex w-full justify-center bg-primary-dark/90 py-2 px-4 text-primary-light backdrop-blur-md md:flex">
      <div className="flex w-full max-w-lg items-center justify-center justify-between">
        <FontAwesomeIcon
          className="hidden h-8 w-8 rounded-full p-2 text-primary-light hover:bg-primary-light hover:text-primary-med sm:flex"
          icon={faBars}
        />
        <button
          className="flex items-center gap-2 rounded-xl py-1 text-3xl font-bold"
          onClick={() => void router.push("/app")}
        >
          <FontAwesomeIcon
            className="h-6 w-6 text-primary-light"
            icon={faCircleHalfStroke}
          />
          <span>Dink</span>
        </button>
        <FontAwesomeIcon
          className="h-5 w-5 rounded-full bg-secondary-dark p-2 text-secondary-med hover:bg-secondary-light hover:text-secondary-med"
          icon={faUser}
          onClick={() => void router.push("/app/user")}
        />
      </div>
    </nav>
  );
};

export default Navbar;
