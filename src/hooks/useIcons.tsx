import { useMemo } from "react";
import { iconMap, iconColorMap, type IconColor } from "~/config";

const useIcons = () => {
  const icons = useMemo(() => {
    return Array.from(iconMap, (item) => {
      return { name: item[0], icon: item[1] };
    });
  }, []);

  const colors = useMemo(() => {
    return Array.from(iconColorMap, (item) => {
      return {
        name: item[0],
        primary: item[1].primary,
        secondary: item[1].secondary,
      };
    });
  }, []);

  const convertToIcon = (name: string | null | undefined) => {
    return name ? iconMap.get(name) : null;
  };

  const convertToColor = (name: string | null | undefined): IconColor => {
    return name
      ? (iconColorMap.get(name) as IconColor)
      : (iconColorMap.get("teal") as IconColor);
  };
  const defaultIcon = icons[0];
  const defaultColor = colors[0] as IconColor;

  return {
    icons,
    colors,
    defaultIcon,
    defaultColor,
    convertToIcon,
    convertToColor,
  };
};

export default useIcons;
