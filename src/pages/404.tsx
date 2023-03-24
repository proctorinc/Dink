import { useRouter } from "next/router";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <>
      <span>404 - This page is not Found</span>
      <button
        className="rounded-xl bg-primary-med px-4 py-2 hover:bg-primary-light"
        onClick={() => void router.push("/app")}
      >
        Go Home
      </button>
    </>
  );
};

export default NotFoundPage;
