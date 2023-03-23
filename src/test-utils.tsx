import { type ReactElement, type ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import {
  type RenderOptions,
  type RenderResult,
  render,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/react-query";
import { trpcReact } from "./utils/api";
import superjson from "superjson";

type ProviderProps = {
  children: ReactNode;
};

type AuthWrapperProps = {
  children: JSX.Element;
};

const PORT = process.env.PORT ?? 3000;

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
});

const trpcClient = trpcReact.createClient({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: `http://localhost:${PORT}/api/trpc`,
    }),
  ],
  transformer: superjson,
});

const mockSession = {
  user: {
    email: "test@sample.com",
    id: "test-id",
    image: "test-image.jpg",
    name: "Test User",
  },
  expires: "2033-04-16T18:32:58.649Z",
};

const providers = ({ children }: ProviderProps) => {
  return (
    <SessionProvider session={mockSession}>
      <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </trpcReact.Provider>
    </SessionProvider>
  );
};

const withAuth = ({ children }: AuthWrapperProps) => {
  return <SessionProvider session={mockSession}>{children}</SessionProvider>;
};

const withNoAuth = ({ children }: AuthWrapperProps) => {
  return <SessionProvider session={null}>{children}</SessionProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "queries">
): RenderResult => render(ui, { wrapper: providers, ...options });

export * from "@testing-library/react";
export { customRender as render, userEvent, withAuth, withNoAuth };
