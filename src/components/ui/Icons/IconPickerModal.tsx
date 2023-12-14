import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, type FC } from "react";
import Modal from "~/components/ui/Modal";
import { type IconColor } from "~/config";
import useIcons from "~/hooks/useIcons";

type FundPickerModalProps = {
  open: boolean;
  onSelect: (iconName: string, iconColor: IconColor) => void;
  onClose: () => void;
};

const IconPickerModal: FC<FundPickerModalProps> = ({
  open,
  onSelect,
  onClose,
}) => {
  const { icons, colors, defaultColor } = useIcons();
  const [selectedColor, setSelectedColor] = useState<IconColor>(defaultColor);

  return (
    <Modal title="Choose Icon" open={open} onClose={onClose}>
      <label className="px-2">Color:</label>
      <div className="grid grid-cols-6 gap-2 text-black">
        {colors.map((color) => (
          <div
            key={color.name}
            className="flex aspect-square w-full items-center justify-center rounded-xl shadow-md"
            style={{
              backgroundColor: color.primary,
              color: color.secondary,
            }}
            onClick={() => setSelectedColor(color)}
          >
            {color.name === selectedColor?.name && (
              <FontAwesomeIcon icon={faCircleCheck} size="xl" />
            )}
          </div>
        ))}
      </div>
      <label className="px-2">Icon:</label>
      <div
        style={{ backgroundColor: selectedColor?.primary }}
        className="grid max-h-64 grid-cols-5 justify-center gap-2 overflow-y-scroll rounded-xl border border-gray-300 bg-gray-100"
      >
        {icons.map((iconChoice) => (
          <FontAwesomeIcon
            key={iconChoice.name}
            icon={iconChoice.icon}
            size="lg"
            className="aspect-square w-8 rounded-xl p-4"
            style={{
              color: selectedColor?.secondary,
            }}
            onClick={() => onSelect(iconChoice.name, selectedColor)}
          />
        ))}
      </div>
    </Modal>
  );
};

export default IconPickerModal;
