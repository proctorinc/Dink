import { useRouter } from "next/router";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5">
      <span>404 - This page is not Found</span>
      <button
        className="rounded-xl bg-primary-med px-4 py-2 hover:bg-primary-light"
        onClick={() => router.push("/app")}
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFoundPage;
