import {
  faBuildingColumns,
  faCalendarAlt,
  faHome,
  faPiggyBank,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { IconButton } from "../Button";

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
        {routes.map((route) => (
          <div
            key={route.path}
            className="group flex items-center gap-3"
            onClick={() => void router.push(route.path)}
          >
            <IconButton
              key={route.path}
              icon={route.icon}
              active={router.pathname === route.path}
              onClick={() => void router.push(route.path)}
            />
            <span className="invisible select-none font-bold text-primary-light group-hover:visible">
              {route.name}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
