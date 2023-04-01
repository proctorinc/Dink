import {
  faBuildingColumns,
  faCalendarAlt,
  faHome,
  faPiggyBank,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { IconButton } from "../Button";

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
    <nav className="fixed inset-x-0 bottom-0 z-30 flex w-full justify-center px-3 text-primary-light sm:hidden">
      <div className="flex h-full w-full max-w-md flex-col rounded-t-3xl bg-primary-dark/90 px-4 pt-2 pb-10 backdrop-blur-sm">
        <div className="flex items-center justify-around">
          {routes.map((route) => (
            <IconButton
              key={route.path}
              icon={route.icon}
              active={router.pathname === route.path}
              onClick={() => void router.push(route.path)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};

export default MobileNavbar;