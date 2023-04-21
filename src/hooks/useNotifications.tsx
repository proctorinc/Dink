import { useContext } from "react";
import NotificationContext from "~/context/NotificationContext";

const useNotifications = () => {
  return useContext(NotificationContext);
};

export default useNotifications;
