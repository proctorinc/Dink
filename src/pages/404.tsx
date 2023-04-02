import { useRouter } from "next/router";
import Button from "~/components/ui/Button";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <>
      <h1 className="pt-64 text-5xl font-extrabold text-white">404</h1>
      <h1 className="text-5xl font-extrabold text-white">Not Found</h1>
      <span className="text-md text-primary-light">
        Oops, looks like you got turned around.
      </span>
      <Button title="Go Home" onClick={() => void router.push("/")} />
    </>
  );
};

export default NotFoundPage;
