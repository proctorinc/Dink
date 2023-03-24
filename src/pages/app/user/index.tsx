import { useSession } from "next-auth/react";
import Header from "~/components/ui/Header";

const UserPage = () => {
  const { data: sessionData } = useSession();
  return (
    <>
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
    </>
  );
};

export default UserPage;
