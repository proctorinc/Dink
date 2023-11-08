import { useRouter } from "next/router";
import {
  faCalendarAlt,
  faHome,
  faPiggyBank,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "~/components/ui/Button";
import { useSession } from "next-auth/react";

const MobileNavbar = () => {
  const router = useRouter();
  const { data: sessionData, status } = useSession();

  const routes = [
    { path: "/", icon: faHome },
    { path: "/budget", icon: faCalendarAlt },
    { path: "/savings", icon: faPiggyBank },
    { path: "/transactions", icon: faReceipt },
  ];

  if (status === "authenticated" && sessionData?.user.isProfileComplete) {
    return (
      <nav className="fixed inset-x-0 bottom-0 z-30 flex w-full justify-center text-white sm:hidden">
        <div className="flex h-full w-full max-w-md flex-col rounded-t-3xl bg-primary-med px-4 py-2">
          <div className="flex items-center justify-around">
            {routes.map((route) => (
              <IconButton
                noShadow
                className="text-primary-light"
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
  }

  return <></>;
};

export default MobileNavbar;
