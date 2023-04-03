import { useMemo } from "react";
import { iconMap } from "~/config";

const useIcons = () => {
  const icons = useMemo(() => {
    return Array.from(iconMap, (item) => {
      return { name: item[0], icon: item[1] };
    });
  }, []);

  const convertToIcon = (name: string | null | undefined) => {
    return name ? iconMap.get(name) : null;
  };

  return { icons, convertToIcon };
};

export default useIcons;
