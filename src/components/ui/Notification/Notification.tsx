import {
  faExclamationTriangle,
  faInfo,
  faXmarkSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type FC } from "react";
import useNotifications from "~/hooks/useNotifications";
import { IconButton } from "../Button";
import Spinner from "../Spinner";

export type NotificationProps = {
  type: "success" | "loading" | "error" | "info";
  message: string;
};

export const Notification: FC<NotificationProps> = ({ type, message }) => {
  const { clearNotification } = useNotifications();

  let styling = "bg-primary-dark text-sm text-primary-light shadow-none";

  if (type === "info") {
    styling = "bg-secondary-dark text-sm font-semibold text-secondary-med";
  } else if (type === "error") {
    styling = "bg-danger-dark text-danger-med";
  }

  return (
    <div
      className={`relative flex w-full items-center justify-center gap-2 rounded-xl p-2 pl-12 text-center font-bold shadow-md ${styling}`}
    >
      <div className="absolute left-5">
        {type === "loading" && <Spinner size="xs" />}
        {type === "error" && <FontAwesomeIcon icon={faExclamationTriangle} />}
        {type === "info" && (
          <FontAwesomeIcon
            icon={faInfo}
            className="h-3 rounded-full border-2 border-secondary-med px-2 py-1"
          />
        )}
      </div>
      <p>{message}</p>
      {type === "error" && (
        <div className="absolute right-3">
          <IconButton
            style="danger"
            size="sm"
            icon={faXmarkSquare}
            onClick={clearNotification}
          />
        </div>
      )}
    </div>
  );
};
