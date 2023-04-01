import { faEdit, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Button from "~/components/ui/Button";
import Header from "~/components/ui/Header";

const UserPage = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <Header title="Profile" subtitle={""} />
      <div className="flex items-center gap-2">
        <Image
          className="w-30 rounded-full ring ring-primary-med"
          width={100}
          height={100}
          src={sessionData?.user.image ?? "/favicon.ico"}
          alt="user-image"
        />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {!sessionData?.user.nickname && (
              <span className="rounded-xl bg-primary-med px-3 py-1 text-sm font-bold text-primary-light">
                Add nickname
              </span>
            )}
            {!!sessionData?.user.nickname && (
              <h2 className="text-2xl text-white">
                {sessionData.user.nickname}
              </h2>
            )}
            <FontAwesomeIcon className="text-primary-light" icon={faEdit} />
          </div>
          <h2 className="text-xl font-light text-primary-light">
            {sessionData?.user.email}
          </h2>
        </div>
      </div>
      <div className="flex w-full flex-col gap-3 text-primary-light">
        <h2 className="text-2xl">Preferences</h2>
        <div className="group flex h-12 w-full w-full cursor-pointer items-center justify-between rounded-xl bg-primary-med px-4 py-2 hover:bg-primary-light hover:text-primary-dark">
          <span className="">Credit card utilization goal:</span>
          <span className="rounded-xl bg-primary-dark px-3 py-1 text-sm font-bold">
            10%
          </span>
          <FontAwesomeIcon className="" icon={faEdit} />
        </div>
        <div className="group flex h-12 w-full w-full cursor-pointer items-center justify-between rounded-xl bg-primary-med px-4 py-2 hover:bg-primary-light hover:text-primary-dark">
          <span className="">Hide empty account categories</span>
          <FontAwesomeIcon className="" size="xl" icon={faToggleOn} />
        </div>
      </div>
      <Button title="Log Out" onClick={() => void signOut()} />
      <Button title="Delete Account" />
    </>
  );
};

export default UserPage;
