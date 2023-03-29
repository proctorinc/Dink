import {
  faBuildingColumns,
  faCalendarAlt,
  faHome,
  faPiggyBank,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

const Sidebar = () => {
  const router = useRouter();

  const routes = [
    { path: "/accounts", name: "Accounts", icon: faBuildingColumns },
    { path: "/budget", name: "Budget", icon: faCalendarAlt },
    { path: "/", name: "Home", icon: faHome },
    { path: "/funds", name: "Funds", icon: faPiggyBank },
    { path: "/transactions", name: "Transactions", icon: faReceipt },
  ];

  return (
    <aside className="fixed left-[10%] top-1/2 hidden -translate-y-1/2 text-white sm:flex">
      <div className="flex flex-col gap-3">
        {routes.map((route) => {
          const activeStyle =
            "h-10 w-10 rounded-full bg-primary-light text-primary-med";
          const inactiveStyle =
            "h-10 w-10 rounded-full text-primary-light group-hover:bg-primary-light group-hover:text-primary-med";

          return (
            <div
              key={route.path}
              className="cursor pointer group flex items-center gap-3"
              onClick={() => void router.push(route.path)}
            >
              <button
                className={
                  router.pathname === route.path ? activeStyle : inactiveStyle
                }
              >
                <FontAwesomeIcon size="xl" icon={route.icon} />
              </button>
              <span className="invisible select-none font-bold text-primary-light group-hover:visible">
                {route.name}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
