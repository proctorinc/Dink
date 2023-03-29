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

  const routes = [
    { path: "/accounts", icon: faBuildingColumns },
    { path: "/budget", icon: faCalendarAlt },
    { path: "/", icon: faHome },
    { path: "/funds", icon: faPiggyBank },
    { path: "/transactions", icon: faReceipt },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex w-full justify-center px-3 text-primary-light sm:hidden">
      <div className="flex h-full w-full max-w-md flex-col rounded-t-3xl bg-primary-dark/90 px-4 pt-2 pb-10 backdrop-blur-sm">
        <div className="flex items-center justify-around">
          {routes.map((route) => {
            const activeStyle =
              "h-10 w-10 rounded-full bg-primary-light text-primary-med";
            const inactiveStyle =
              "h-10 w-10 rounded-full text-primary-light hover:bg-primary-light hover:text-primary-med";

            return (
              <button
                key={route.path}
                className={
                  router.pathname === route.path ? activeStyle : inactiveStyle
                }
              >
                <FontAwesomeIcon
                  size="xl"
                  icon={route.icon}
                  onClick={() => void router.push(route.path)}
                />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MobileNavbar;
