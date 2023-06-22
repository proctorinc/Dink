import {
  faAngleUp,
  faArrowLeft,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Button, { ButtonBar } from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import ConfirmDelete from "~/components/ui/ConfirmDelete";
import EditableTitle from "~/components/ui/EditableTitle";
import Page from "~/components/ui/Page";
import useNotifications from "~/hooks/useNotifications";
import { api } from "~/utils/api";

const UserPage = () => {
  const { data: sessionData } = useSession();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const notifications = useNotifications();
  const router = useRouter();

  const userPreferences = api.users.getUserPreferences.useQuery();
  const updateNickname = api.users.updateNickname.useMutation();
  const updateIncome = api.users.updateTargetIncome.useMutation();
  const updateCreditUtilization =
    api.users.updateCreditUtilization.useMutation();
  const deleteUserMutation = api.users.deleteUser.useMutation({
    onSuccess: () => signOut(),
  });

  const handleProfileUpdate = (name: string) => {
    updateNickname.mutate({ name });
  };

  const handleIncomeUpdate = (value: string) => {
    updateIncome.mutate({ income: Number(value) });
  };

  const handleCreditUtilizationUpdate = (value: string) => {
    updateCreditUtilization.mutate({ utilization: Number(value) });
  };

  const handleDeleteUser = () => {
    notifications.setLoadingNotification("Deleting account");
    deleteUserMutation.mutate();
  };

  return (
    <Page auth title="Profile">
      <div className="w-full">
        <Button icon={faArrowLeft} onClick={() => void router.back()} />
      </div>
      <div className="flex flex-col items-center gap-2">
        {sessionData?.user.image && (
          <Image
            className="w-28 rounded-full bg-primary-med shadow-lg"
            width={100}
            height={100}
            src={`${sessionData.user.image}?sz=256`}
            alt="user-image"
          />
        )}
        <EditableTitle
          className="text-3xl font-bold"
          value={sessionData?.user.nickname}
          onUpdate={handleProfileUpdate}
        />
        <h2 className="text-lg font-light text-primary-light">
          {sessionData?.user.email}
        </h2>
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
            onDelete={() => handleDeleteUser()}
          />
        </ButtonBar>
      )}
      <Card>
        <Card.Header>
          <h3>Preferences</h3>
        </Card.Header>
        <Card>
          <Card.Body>
            <Card.Group>
              {userPreferences && (
                <Card.Group horizontal>
                  <span className="font-bold text-primary-light">
                    Monthly Income:
                  </span>
                  <EditableTitle
                    value={String(userPreferences.data?.targetIncome ?? "0")}
                    onUpdate={handleIncomeUpdate}
                  />
                </Card.Group>
              )}
              {userPreferences && (
                <Card.Group horizontal>
                  <span className="font-bold text-primary-light">
                    Credit Utilization Target:
                  </span>
                  <EditableTitle
                    value={String(
                      userPreferences.data?.creditPercentTarget ?? "0"
                    )}
                    onUpdate={handleCreditUtilizationUpdate}
                  />
                </Card.Group>
              )}
            </Card.Group>
          </Card.Body>
        </Card>
      </Card>
    </Page>
  );
};

export default UserPage;
