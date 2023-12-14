import {
  faAngleUp,
  faArrowLeft,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import AuthPage from "~/components/routes/AuthPage";
import Button, { ButtonBar } from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import ConfirmDelete from "~/components/ui/ConfirmDelete";
import EditableTitle from "~/components/ui/EditableTitle";
import Header from "~/components/ui/Header";
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
    <AuthPage>
      <Head>
        <title>Profile</title>
      </Head>
      <main className="flex flex-col items-center text-white">
        <div className="container flex max-w-md flex-col items-center justify-center gap-12 pt-5 sm:pb-4 lg:max-w-2xl">
          <div className="flex w-full flex-col items-center gap-4">
            <div className="flex w-full flex-col gap-4 px-4">
              <div className="flex flex-col items-center gap-2">
                {sessionData?.user.image && (
                  <Image
                    className="w-28 rounded-full bg-primary-med shadow-lg"
                    width={1000}
                    height={1000}
                    src={`${sessionData.user.image}?sz=2048`}
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
            </div>
            <div className="flex w-full flex-col gap-4 rounded-t-2xl bg-gray-100 p-4 pb-20 font-bold text-black">
              <h3 className="pl-2">Preferences</h3>
              <div className="grid grid-cols-1 overflow-clip rounded-xl border border-gray-300 bg-white shadow-md lg:grid-cols-2">
                {userPreferences && (
                  <div className="flex items-center justify-between gap-2 p-4">
                    <span>Monthly Income:</span>
                    <EditableTitle
                      value={String(userPreferences.data?.targetIncome ?? "0")}
                      onUpdate={handleIncomeUpdate}
                    />
                  </div>
                )}
                {userPreferences && (
                  <div className="flex items-center justify-between gap-2 p-4">
                    <span>Credit Utilization Target:</span>
                    <EditableTitle
                      value={String(
                        userPreferences.data?.creditPercentTarget ?? "0"
                      )}
                      onUpdate={handleCreditUtilizationUpdate}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </AuthPage>
  );
};

export default UserPage;
