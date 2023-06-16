import {
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
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

  let styling = "bg-secondary-dark text-secondary-med";
  let closeStyling: "secondary" | "primary" | "danger" = "secondary";

  if (type === "info") {
    styling = "bg-primary-light text-primary-med";
    closeStyling = "primary";
  } else if (type === "error") {
    styling = "bg-danger-dark text-danger-med";
    closeStyling = "danger";
  } else if (type === "loading") {
    styling = "text-primary-light shadow-none";
  }

  if (message) {
    return (
      <div
        className={`relative flex w-full items-center justify-center gap-2 rounded-xl py-2 px-12 text-center text-sm font-semibold shadow-md ${styling}`}
      >
        <div className="absolute left-5">
          {type === "success" && (
            <FontAwesomeIcon icon={faCheckCircle} size="lg" />
          )}
          {type === "loading" && <Spinner size="xs" />}
          {type === "error" && (
            <FontAwesomeIcon icon={faExclamationTriangle} size="lg" />
          )}
          {type === "info" && <FontAwesomeIcon icon={faInfoCircle} size="lg" />}
        </div>
        <p>{message}</p>
        {type !== "loading" && (
          <div className="absolute right-3">
            <IconButton
              noShadow
              style={closeStyling}
              size="sm"
              icon={faXmarkSquare}
              onClick={() => clearNotification()}
            />
          </div>
        )}
      </div>
    );
  }
  return <></>;
};
