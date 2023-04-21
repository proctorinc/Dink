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

  return (
    <div
      className={`${
        type === "error"
          ? "bg-danger-dark text-danger-med"
          : "text-sm text-primary-light"
      } relative flex w-full items-center justify-center gap-2 p-1 font-bold`}
    >
      {type === "loading" && <Spinner size="xs" />}
      {type === "error" && <FontAwesomeIcon icon={faExclamationTriangle} />}
      {type === "info" && <FontAwesomeIcon icon={faInfo} />}
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
