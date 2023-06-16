import {
  faArrowRight,
  faDollarSign,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import LoadingPage from "~/components/ui/LoadingPage";
import useNotifications from "~/hooks/useNotifications";
import { api } from "~/utils/api";
import Button, { IconButton } from "../../../components/ui/Button";
import Header from "../../../components/ui/Header";
import Page from "../../../components/ui/Page";

export default function ProfileSetup() {
  const ctx = api.useContext();
  const { data: sessionData, status } = useSession();
  const { setLoadingNotification, setErrorNotification, clearNotification } =
    useNotifications();
  const router = useRouter();

  const [nameComplete, setNameComplete] = useState(false);
  const [nickname, setNickname] = useState("");
  const [income, setIncome] = useState(0);

  const completeProfile = api.users.completeProfile.useMutation({
    onSuccess: () => {
      clearNotification();
      void ctx.invalidate();
      void router.push("/");
    },
    onError: () => setErrorNotification("Failed to update profile. Try again"),
  });

  if (status === "authenticated" && sessionData?.user.isProfileComplete) {
    void router.push("/");
  }

  if (status === "authenticated" && !sessionData?.user.isProfileComplete) {
    return (
      <Page auth title="Get Started" style="centered">
        <Header title="Welcome!" subtitle="Let's get started" />
        <div className="flex w-full flex-col gap-4 pt-10">
          {!nameComplete && (
            <form
              className="flex flex-col gap-4"
              onSubmit={() => setNameComplete(true)}
            >
              <h3 className="text-xl font-bold">Enter your name:</h3>
              <div className="relative w-full">
                <input
                  autoFocus
                  id="name-input"
                  placeholder="Enter your name..."
                  className="relative w-full rounded-lg bg-primary-med py-2 pr-4 pl-10 font-bold text-primary-light placeholder-primary-light ring ring-primary-med focus:placeholder-primary-med"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
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
                type="submit"
              />
            </form>
          )}
          {nameComplete && (
            <form
              className="flex flex-col gap-4"
              onSubmit={() => {
                completeProfile.mutate({ income, nickname });
                setLoadingNotification("Updating profile...");
              }}
            >
              <h3 className="text-xl font-bold">Enter your monthly income:</h3>
              <div className="relative w-full">
                <input
                  autoFocus
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
                  disabled
                />
              </div>
              <Button
                title="Next"
                style="secondary"
                icon={faArrowRight}
                iconRight
                type="submit"
              />
            </form>
          )}
        </div>
      </Page>
    );
  }

  return <LoadingPage />;
}
