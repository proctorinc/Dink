import {
  faBuildingColumns,
  faCalendarAlt,
  faHome,
  faPiggyBank,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

const MobileNavbar = () => {
  const router = useRouter();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex w-full justify-center text-primary-light sm:hidden">
      <div className="flex h-full w-full max-w-md flex-col rounded-t-3xl bg-primary-med/90 px-4 pt-2 pb-10 backdrop-blur-md">
        <div className="flex items-center justify-around">
          <button className="h-10 w-10 rounded-full text-primary-light hover:bg-primary-light hover:text-primary-med">
            <FontAwesomeIcon
              size="xl"
              icon={faBuildingColumns}
              onClick={() => void router.push("/app/accounts")}
            />
          </button>
          <button className="h-10 w-10 rounded-full text-primary-light hover:bg-primary-light hover:text-primary-med">
            <FontAwesomeIcon
              size="xl"
              icon={faCalendarAlt}
              onClick={() => void router.push("/app/budget")}
            />
          </button>
          <button className="h-10 w-10 rounded-full text-primary-light hover:bg-primary-light hover:text-primary-med">
            <FontAwesomeIcon
              size="xl"
              icon={faHome}
              onClick={() => void router.push("/app")}
            />
          </button>
          <button className="h-10 w-10 rounded-full text-primary-light hover:bg-primary-light hover:text-primary-med">
            <FontAwesomeIcon
              size="xl"
              icon={faPiggyBank}
              onClick={() => void router.push("/app/funds")}
            />
          </button>
          <button className="h-10 w-10 rounded-full text-primary-light hover:bg-primary-light hover:text-primary-med">
            <FontAwesomeIcon
              size="xl"
              icon={faReceipt}
              onClick={() => void router.push("/app/transactions")}
            />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MobileNavbar;
