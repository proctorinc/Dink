import { type FC, type ReactNode, createContext, useState } from "react";
import { type NotificationProps } from "~/components/ui/Notification/Notification";

type NotificationProviderProps = {
  children: ReactNode;
};

type NotificationContext = {
  clearNotification: () => void;
  setErrorNotification: (message: string) => void;
  setSuccessNotification: (message: string) => void;
  setLoadingNotification: (message: string) => void;
  setInfoNotification: (message: string) => void;
  message: string | null;
  type: "loading" | "success" | "info" | "error" | null;
};

const NotificationContext = createContext<NotificationContext>({
  clearNotification: () => null,
  setErrorNotification: () => null,
  setSuccessNotification: () => null,
  setLoadingNotification: () => null,
  setInfoNotification: () => null,
  message: null,
  type: "loading",
});

export const NotificationProvider: FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notification, setNotification] = useState<NotificationProps | null>(
    null
  );

  const clearNotification = () => setNotification(null);

  const setErrorNotification = (message: string) => {
    setNotification({ type: "error", message });
  };

  const setSuccessNotification = (message: string) => {
    setNotification({ type: "success", message });
  };

  const setLoadingNotification = (message: string) => {
    setNotification({ type: "loading", message });
  };

  const setInfoNotification = (message: string) => {
    setNotification({ type: "info", message });
  };

  const contextData = {
    clearNotification,
    setErrorNotification,
    setSuccessNotification,
    setLoadingNotification,
    setInfoNotification,
    message: notification?.message ?? null,
    type: notification?.type ?? null,
  };

  return (
    <NotificationContext.Provider value={contextData}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
