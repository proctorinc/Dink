import { type FC, type ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const Layout: FC<LayoutProps> = ({ children }) => {
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

export default Layout;
