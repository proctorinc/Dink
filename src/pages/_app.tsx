import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { useState } from "react";
import Head from "next/head";
import Router from "next/router";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Navbar from "~/components/ui/Navbar";
import MobileNavbar from "~/components/ui/MobileNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [loading, setLoading] = useState(false);

  Router.events.on("routeChangeStart", () => {
    setLoading(true);
  });

  Router.events.on("routeChangeComplete", () => {
    setLoading(false);
  });

  return (
    <SessionProvider session={session}>
      <Navbar />
      <Head>
        <title>Dink</title>
      </Head>
      <main className="flex flex-col items-center text-white">
        {loading ? (
          <div className="pt-64">
            <FontAwesomeIcon
              className="animate-spin text-primary-light"
              size="2xl"
              icon={faSpinner}
            />
          </div>
        ) : (
          <div className="container flex max-w-md flex-col items-center justify-center gap-12 px-4 pb-28 sm:pb-4">
            <div className="flex w-full flex-col items-center gap-4">
              <Component {...pageProps} />
            </div>
          </div>
        )}
      </main>
      <MobileNavbar />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
