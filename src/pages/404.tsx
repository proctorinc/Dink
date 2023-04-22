import { useRouter } from "next/router";
import Button from "~/components/ui/Button";
import Page from "~/components/ui/Page";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <Page title="Not Found" style="centered">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold text-white">404</h1>
        <h1 className="text-5xl font-extrabold text-white">Not Found</h1>
        <span className="text-md text-primary-light">
          Oops, looks like you got turned around.
        </span>
        <Button
          title="Go Home"
          style="secondary"
          onClick={() => void router.push("/")}
        />
      </div>
    </Page>
  );
};

export default NotFoundPage;
