import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Navbar from "~/components/ui/Nav/Navbar";
import MobileNavbar from "~/components/ui/Nav/MobileNavbar";
import Sidebar from "~/components/ui/Nav/Sidebar";
import { MonthProvider } from "~/context/MonthContext";
import { NotificationProvider } from "~/context/NotificationContext";
import { ProfileSetup } from "~/components/routes/ProfileSetup";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <SessionProvider session={session}>
        <NotificationProvider>
          <Navbar />
          <ProfileSetup>
            <MonthProvider>
              <Component {...pageProps} />
            </MonthProvider>
            <Sidebar />
            <MobileNavbar />
          </ProfileSetup>
        </NotificationProvider>
      </SessionProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
