import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { api } from "~/utils/api";
import "~/styles/globals.css";
import { MonthProvider } from "~/context/MonthContext";
import Navbar from "~/components/ui/Nav/Navbar";
import MobileNavbar from "~/components/ui/Nav/MobileNavbar";
import Layout from "~/components/ui/Layout";
import Sidebar from "~/components/ui/Nav/Sidebar";

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
      <Sidebar />
      <MobileNavbar />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
