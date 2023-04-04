import {
  faEdit,
  faSquareCheck,
  faSquareXmark,
  faToggleOn,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Button, { ButtonBar, IconButton } from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import Header from "~/components/ui/Header";
import Spinner from "~/components/ui/Spinner";
import { api } from "~/utils/api";

const UserPage = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  const updateNickname = api.users.updateNickname.useMutation({
    onSuccess: () => router.reload(),
  });

  const updateProfile = () => {
    if (name !== sessionData?.user.nickname && name !== "") {
      updateNickname.mutate({ name });
    } else {
      setEditing(false);
    }
  };

  if (!sessionData?.user) {
    return <Spinner />;
  }

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
            {!editing && (
              <h2 className="text-3xl font-bold text-white">
                {sessionData.user.nickname ?? "Add Nickname"}
              </h2>
            )}
            {editing && (
              <Card size="sm">
                <Card.Body horizontal>
                  <input
                    id="name-input"
                    placeholder={"Enter name..."}
                    className="bg-primary-med text-xl font-bold text-primary-light placeholder-primary-light"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                  {name.length > 0 && (
                    <IconButton
                      icon={faSquareCheck}
                      onClick={() => updateProfile()}
                    />
                  )}
                  {name.length === 0 && (
                    <IconButton
                      icon={faSquareXmark}
                      onClick={() => setEditing(false)}
                    />
                  )}
                </Card.Body>
              </Card>
            )}
            {!editing && (
              <IconButton
                icon={faEdit}
                size="sm"
                onClick={() => setEditing(true)}
              />
            )}
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
      <ButtonBar>
        <Button title="Log Out" onClick={() => void signOut()} />
        <Button title="Delete Account" />
      </ButtonBar>
    </>
  );
};

export default UserPage;
