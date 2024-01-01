import { faCircleCheck, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, type FC } from "react";
import Modal from "~/components/ui/Modal";
import { type IconColor } from "~/config";
import useIcons from "~/hooks/useIcons";
import Button from "../Button";

type FundPickerModalProps = {
  open: boolean;
  onSelect: (iconName: string, iconColor: IconColor) => void;
  initialIcon?: string;
  initialColor?: string;
  onClose: () => void;
};

const IconPickerModal: FC<FundPickerModalProps> = ({
  open,
  initialIcon,
  initialColor,
  onSelect,
  onClose,
}) => {
  const { icons, colors, convertToIcon, convertToColor, defaultColor } =
    useIcons();
  const [selectedColor, setSelectedColor] = useState<IconColor>(
    convertToColor(initialColor) ?? defaultColor
  );
  const [selectedIcon, setSelectedIcon] = useState<string | null>(
    initialIcon ?? null
  );

  const isValidData = selectedIcon !== null;

  const submitForm = () => {
    if (isValidData) {
      onSelect(selectedIcon, selectedColor);
    }
  };

  return (
    <Modal title="Choose Icon" open={open} onClose={onClose}>
      <form onSubmit={submitForm} className="flex flex-col gap-4">
        <div className="flex w-full justify-center p-4">
          <button
            className="h-20 w-20 rounded-xl shadow-md"
            style={{
              backgroundColor: selectedColor.primary,
              color: selectedColor.secondary,
            }}
          >
            <FontAwesomeIcon
              size="3x"
              icon={convertToIcon(selectedIcon) ?? faPlusCircle}
            />
          </button>
        </div>
        <div className="grid grid-cols-6 gap-2 text-black">
          {colors.slice(0, -1).map((color) => (
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
        <div className="grid max-h-64 grid-cols-5 justify-center gap-2 overflow-y-scroll rounded-xl border border-gray-300 bg-gray-100 text-gray-500">
          {icons.map((iconChoice) => (
            <FontAwesomeIcon
              key={iconChoice.name}
              icon={iconChoice.icon}
              size="xl"
              className={`aspect-square w-8 rounded-xl py-4 px-3 ${
                selectedIcon === iconChoice.name ? "bg-gray-600 text-white" : ""
              }`}
              onClick={() => setSelectedIcon(iconChoice.name)}
            />
          ))}
        </div>
        <div className="mt-5 flex w-full justify-center">
          <Button
            style="secondary"
            type="submit"
            title="Choose"
            className="w-full"
            disabled={!isValidData}
          />
        </div>
      </form>
    </Modal>
  );
};

export default IconPickerModal;
