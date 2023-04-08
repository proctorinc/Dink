import { faAngleUp, faGear } from "@fortawesome/free-solid-svg-icons";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Button, { ButtonBar } from "~/components/ui/Button";
import ConfirmDelete from "~/components/ui/ConfirmDelete";
import EditableTitle from "~/components/ui/EditableTitle";
import Header from "~/components/ui/Header";
import Page from "~/components/ui/Page";
import { api } from "~/utils/api";

const UserPage = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const updateNickname = api.users.updateNickname.useMutation({
    onSuccess: () => router.reload(),
  });

  const handleProfileUpdate = (name: string) => {
    updateNickname.mutate({ name });
  };

  return (
    <Page auth title="Profile">
      <Header title="Profile" />
      <div className="flex items-center gap-2">
        <Image
          className="w-30 rounded-full ring ring-primary-med"
          width={100}
          height={100}
          src={sessionData?.user.image ?? "/dink.ico"}
          alt="user-image"
        />
        <div className="flex flex-col gap-1">
          <EditableTitle
            className="text-3xl font-bold"
            value={sessionData?.user.nickname}
            onUpdate={handleProfileUpdate}
          />
          <h2 className="text-xl font-light text-primary-light">
            {sessionData?.user.email}
          </h2>
        </div>
      </div>
      <ButtonBar>
        <Button
          className="w-16"
          icon={settingsOpen ? faAngleUp : faGear}
          onClick={() => setSettingsOpen((prev) => !prev)}
        />
        <Button title="Log Out" onClick={() => void signOut()} />
      </ButtonBar>
      {settingsOpen && (
        <ButtonBar>
          <ConfirmDelete
            buttonText="Delete account"
            confirmationText="Delete my account"
            onDelete={() => console.log("Confirmed Delete")}
          />
        </ButtonBar>
      )}
    </Page>
  );
};

export default UserPage;
