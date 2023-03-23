import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import {
  faBars,
  faBuildingColumns,
  faCalendarAlt,
  faCircleHalfStroke,
  faHome,
  faPiggyBank,
  faReceipt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawerOpen = () => {
    setDrawerOpen((prev) => setDrawerOpen(!prev));
  };

  Router.onRouteChangeStart = () => {
    setLoading(true);
  };

  Router.onRouteChangeComplete = () => {
    setLoading(false);
  };

  // Router.onRouteChangeError = () => {
  //   setLoading(false);
  // };

  return (
    <SessionProvider session={session}>
      <div className="bg-primary-dark">
        <Head>
          <title>Dink</title>
        </Head>
        <nav className="absolute sticky top-0 z-50 flex w-full justify-center bg-primary-dark/90 py-2 px-4 text-primary-light backdrop-blur-md md:flex">
          <div className="flex w-full max-w-lg items-center justify-center justify-between">
            <FontAwesomeIcon
              className="hidden h-5 w-5 rounded-full bg-primary-med p-2 text-primary-light hover:bg-primary-light hover:text-primary-med sm:flex"
              icon={faBars}
            />
            <button
              className="flex items-center gap-2 rounded-xl py-1 text-3xl font-bold"
              onClick={() => router.push("/app")}
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
              onClick={() => router.push("/app/user")}
            />
          </div>
        </nav>
        <main className="flex min-h-screen flex-col items-center text-white">
          {loading ? (
            <div className="flex h-full w-full flex-grow items-center justify-center">
              Loading...
            </div>
          ) : (
            <Component {...pageProps} />
          )}
        </main>
        <nav className="absolute sticky bottom-0 z-50 flex w-full justify-center text-primary-light sm:hidden">
          <div className="flex h-full w-full max-w-md flex-col rounded-t-xl bg-primary-dark/90 px-4 pt-2 pb-10 backdrop-blur-md">
            <div className="flex items-center justify-around">
              <FontAwesomeIcon
                className="h-5 w-5 rounded-full bg-primary-med p-2 text-primary-light hover:bg-primary-light hover:text-primary-med"
                icon={faBuildingColumns}
                onClick={() => router.push("/app/accounts")}
              />
              <FontAwesomeIcon
                className="h-5 w-5 rounded-full bg-primary-med p-2 text-primary-light hover:bg-primary-light hover:text-primary-med"
                icon={faCalendarAlt}
                onClick={() => router.push("/app/budget")}
              />
              <FontAwesomeIcon
                className="h-5 w-5 rounded-full bg-primary-med p-2 text-primary-light hover:bg-primary-light hover:text-primary-med"
                icon={faHome}
                onClick={() => router.push("/app")}
              />
              <FontAwesomeIcon
                className="h-5 w-5 rounded-full bg-primary-med p-2 text-primary-light hover:bg-primary-light hover:text-primary-med"
                icon={faPiggyBank}
                onClick={() => router.push("/app/funds")}
              />
              <FontAwesomeIcon
                className="h-5 w-5 rounded-full bg-primary-med p-2 text-primary-light hover:bg-primary-light hover:text-primary-med"
                icon={faBars}
                onClick={toggleDrawerOpen}
              />
            </div>
            {drawerOpen && (
              <div className="h-64 p-4">
                <FontAwesomeIcon
                  className="h-5 w-5 rounded-full bg-primary-med p-2 text-primary-light hover:bg-primary-light hover:text-primary-med"
                  icon={faReceipt}
                  onClick={() => router.push("/app/transactions")}
                />
              </div>
            )}
          </div>
        </nav>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
