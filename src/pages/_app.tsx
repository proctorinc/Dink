import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Head from "next/head";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Navbar from "~/components/ui/Navbar";
import MobileNavbar from "~/components/ui/MobileNavbar";
import { MonthProvider } from "~/context/MonthContext";
import Layout from "~/components/ui/Layout";

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
      <MonthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MonthProvider>
      <MobileNavbar />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
