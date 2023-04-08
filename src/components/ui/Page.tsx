import Head from "next/head";
import { Fragment, type FC, type ReactNode } from "react";
import AuthPage from "../routes/AuthPage";

type PageProps = {
  children: ReactNode;
  title: string;
  auth?: boolean;
  style?: "normal" | "centered" | "basic";
};

type LayoutProps = {
  children: ReactNode;
};

const NormalLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <main className="flex flex-col items-center text-white">
      <div className="container flex max-w-md flex-col items-center justify-center gap-12 px-4 pb-28 pt-5 sm:pb-4">
        <div className="flex w-full flex-col items-center gap-4">
          {children}
        </div>
      </div>
    </main>
  );
};

const BasicLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <main className="flex flex-col items-center text-white">
      <div className="container flex max-w-md flex-col items-center justify-center gap-12 pb-28 pt-5 sm:pb-4">
        <div className="flex w-full flex-col items-center gap-4">
          <>{children}</>
        </div>
      </div>
    </main>
  );
};

const CenteredLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <main className="flex flex-grow flex-grow flex-col items-center justify-center text-white">
      <>{children}</>
    </main>
  );
};

const Page: FC<PageProps> = ({ children, title, auth, style }) => {
  const AuthWrapper = auth ? AuthPage : Fragment;
  let Layout = NormalLayout;

  if (style === "basic") {
    Layout = BasicLayout;
  } else if (style === "centered") {
    Layout = CenteredLayout;
  }

  return (
    <AuthWrapper>
      <>
        <Head>
          <title>Dink | {title}</title>
        </Head>
        <Layout>{children}</Layout>
      </>
    </AuthWrapper>
  );
};

export default Page;