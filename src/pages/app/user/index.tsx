import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Header from "~/components/ui/Header";

const UserPage = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <Header title="Profile" subtitle={""} />
      <div className="flex items-center gap-3">
        <Image
          className="w-30 rounded-full ring ring-primary-med"
          width={100}
          height={100}
          src={sessionData?.user.image ?? "/favicon.ico"}
          alt="user-image"
        />
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl text-white">{sessionData?.user.name}</h2>
          <h2 className="text-xl font-light text-primary-light">
            {sessionData?.user.email}
          </h2>
        </div>
      </div>
      <div>
        <h2 className="text-2xl text-primary-light">Settings</h2>
        <p>- Credit card utilization target recommended (10%)</p>
      </div>
      <button
        className="rounded-xl bg-primary-med px-3 py-1 text-xl text-primary-light hover:bg-primary-light hover:text-primary-med"
        onClick={() => void signOut()}
      >
        Log out
      </button>
      <button
        disabled
        className="rounded-xl bg-danger-med px-3 py-1 text-xl text-danger-dark hover:bg-danger-light hover:text-danger-med"
        onClick={() => void signOut()}
      >
        Delete Account
      </button>
    </>
  );
};

export default UserPage;
