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
      <div className="flex h-full w-full max-w-md flex-col rounded-t-xl bg-primary-med/90 px-4 pt-2 pb-10 backdrop-blur-md">
        <div className="flex items-center justify-around">
          <FontAwesomeIcon
            className="h-5 w-5 rounded-full bg-primary-med p-2 text-primary-light hover:bg-primary-light hover:text-primary-med"
            icon={faBuildingColumns}
            onClick={() => void router.push("/app/accounts")}
          />
          <FontAwesomeIcon
            className="h-5 w-5 rounded-full bg-primary-med p-2 text-primary-light hover:bg-primary-light hover:text-primary-med"
            icon={faCalendarAlt}
            onClick={() => void router.push("/app/budget")}
          />
          <FontAwesomeIcon
            className="h-5 w-5 rounded-full bg-primary-med p-2 text-primary-light hover:bg-primary-light hover:text-primary-med"
            icon={faHome}
            onClick={() => void router.push("/app")}
          />
          <FontAwesomeIcon
            className="h-5 w-5 rounded-full bg-primary-med p-2 text-primary-light hover:bg-primary-light hover:text-primary-med"
            icon={faPiggyBank}
            onClick={() => void router.push("/app/funds")}
          />
          <FontAwesomeIcon
            className="h-5 w-5 rounded-full bg-primary-med p-2 text-primary-light hover:bg-primary-light hover:text-primary-med"
            icon={faReceipt}
            onClick={() => void router.push("/app/transactions")}
          />
        </div>
      </div>
    </nav>
  );
};

export default MobileNavbar;
