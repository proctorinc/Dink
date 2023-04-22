import {
  faArrowRight,
  faDollarSign,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import React, { useState, type FC, type ReactNode } from "react";
import useNotifications from "~/hooks/useNotifications";
import { api } from "~/utils/api";
import Button, { IconButton } from "../ui/Button";
import Header from "../ui/Header";
import Page from "../ui/Page";
import Spinner from "../ui/Spinner";

type ProfileSetupProps = {
  children: ReactNode;
};

export const ProfileSetup: FC<ProfileSetupProps> = ({ children }) => {
  const ctx = api.useContext();
  const { data: sessionData } = useSession();
  const { setLoadingNotification, setErrorNotification, clearNotification } =
    useNotifications();

  const [name, setName] = useState("");
  const [income, setIncome] = useState(0);

  const userPreferences = api.users.getUserPreferences.useQuery();
  const updateNickname = api.users.updateNickname.useMutation({
    onSuccess: () => {
      clearNotification();
      void ctx.invalidate();
    },
    onError: () => setErrorNotification("Failed to update name"),
  });
  const updateIncome = api.users.updateTargetIncome.useMutation({
    onSuccess: () => {
      clearNotification();
      void ctx.invalidate();
    },
    onError: () => setErrorNotification("Failed to update name"),
  });

  if (userPreferences.isLoading) {
    return <Spinner />;
  }

  if (sessionData?.user && !userPreferences.data?.targetIncome) {
    return (
      <Page auth title="Get Started" style="centered">
        <Header title="Welcome!" subtitle="Let's get started" />
        <div className="flex w-full flex-col gap-4 pt-10">
          {!sessionData?.user.nickname && (
            <>
              <h3 className="text-xl font-bold">Enter your name:</h3>
              <div className="relative w-full">
                <input
                  id="name-input"
                  placeholder="Enter your name..."
                  className="relative w-full rounded-lg bg-primary-med py-2 pr-4 pl-10 font-bold text-primary-light placeholder-primary-light ring ring-primary-med focus:placeholder-primary-med"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <IconButton
                  className="absolute top-0 h-full"
                  icon={faUserAlt}
                  noShadow
                />
              </div>
              <Button
                title="Next"
                style="secondary"
                icon={faArrowRight}
                iconRight
                onClick={() => {
                  updateNickname.mutate({ name });
                  setLoadingNotification("Updating name...");
                }}
              />
            </>
          )}
          {sessionData?.user.nickname && (
            <>
              <h3 className="text-xl font-bold">Enter your monthly income:</h3>
              <div className="relative w-full">
                <input
                  id="income-input"
                  type="number"
                  className="relative w-full rounded-lg bg-primary-med py-2 pr-4 pl-10 font-bold text-primary-light placeholder-primary-light ring ring-primary-med focus:placeholder-primary-med"
                  value={income}
                  onChange={(event) => setIncome(Number(event.target.value))}
                />
                <IconButton
                  className="absolute top-0 h-full"
                  icon={faDollarSign}
                  noShadow
                />
              </div>
              <Button
                title="Next"
                style="secondary"
                icon={faArrowRight}
                iconRight
                onClick={() => {
                  updateIncome.mutate({ income });
                  setLoadingNotification("Updating income...");
                }}
              />
            </>
          )}
        </div>
      </Page>
    );
  }
  return <>{children}</>;
};
