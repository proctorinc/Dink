import { useSession } from "next-auth/react";
import Header from "~/components/ui/Header";

const UserPage = () => {
  const { data: sessionData } = useSession();
  return (
    <div className="container flex max-w-md flex-col items-center justify-center gap-12 p-4">
      <div className="flex w-full flex-col items-center gap-4">
        <Header title="Profile" subtitle={""} />
        {/* <Image
          width={100}
          height={100}
          src={sessionData?.user.image ?? "https://none"}
          alt="user-image"
        /> */}
        {/* <span>{sessionData?.user.image}</span> */}
        <span>{sessionData?.user.name}</span>
        <span>{sessionData?.user.email}</span>
      </div>
    </div>
  );
};

export default UserPage;
