import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Head from "next/head";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Navbar from "~/components/ui/Navbar";
import MobileNavbar from "~/components/ui/MobileNavbar";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Navbar />
      <Head>
        <title>Dink</title>
      </Head>
      <main className="flex flex-col items-center text-white">
        <div className="container flex max-w-md flex-col items-center justify-center gap-12 px-4 pb-28 pt-5 sm:pb-4">
          <div className="flex w-full flex-col items-center gap-4">
            <Component {...pageProps} />
          </div>
        </div>
      </main>
      <MobileNavbar />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
