import { useRouter } from "next/router";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <>
      <h1 className="pt-64 text-5xl font-extrabold text-white">404</h1>
      <h1 className="text-5xl font-extrabold text-white">Not Found</h1>
      <span className="text-md text-primary-light">
        Oops, looks like you got turned around.
      </span>
      <button
        className="flex h-fit items-center gap-2 rounded-lg bg-gradient-to-t from-secondary-dark to-secondary-med py-2 px-5 font-bold text-primary-dark group-hover:text-secondary-light"
        onClick={() => void router.push("/app")}
      >
        <span>Go Home</span>
      </button>
    </>
  );
};

export default NotFoundPage;
