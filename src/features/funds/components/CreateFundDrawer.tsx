import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type FC, useState, type FormEvent } from "react";
import Button from "~/components/ui/Button";
import Drawer from "~/components/ui/Drawer";
import IconPickerModal from "~/components/ui/Icons/IconPickerModal";
import { type IconColor } from "~/config";
import useIcons from "~/hooks/useIcons";
import { api } from "~/utils/api";

type CreateFundDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const CreateFundDrawer: FC<CreateFundDrawerProps> = ({ open, onClose }) => {
  const { convertToIcon, defaultColor } = useIcons();
  const ctx = api.useContext();
  const [icon, setIcon] = useState<string | null>(null);
  const [color, setColor] = useState<IconColor>(defaultColor);
  const [name, setName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const createFund = api.funds.create.useMutation({
    onSuccess: () => {
      void ctx.invalidate();
      onClose();
    },
  });

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValidData) {
      createFund.mutate({ name, icon, color: color?.name });
    }
    setName("");
    setColor(defaultColor);
    setIcon(null);
  };

  const isValidData = !!name && !!icon;

  if (!open) {
    return <></>;
  }

  return (
    <Drawer title="Create Fund" open={open} onClose={onClose}>
      <form onSubmit={submitForm}>
        <div className="flex flex-col gap-2 text-left">
          <label className="px-2" htmlFor="fund-name">
            Name:
          </label>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-2">
              <button
                className="h-14 w-14 rounded-xl shadow-md"
                style={{
                  backgroundColor: color?.primary,
                  color: color?.secondary,
                }}
              >
                <FontAwesomeIcon
                  size="xl"
                  icon={convertToIcon(icon) ?? faPlusCircle}
                  onClick={(event) => {
                    event.preventDefault();
                    setModalOpen(true);
                  }}
                />
              </button>
            </div>
            <input
              id="fund-name"
              placeholder="What are you saving for?"
              className="w-full rounded-xl border border-gray-300 p-4 font-bold placeholder-gray-500"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
        </div>
        <div className="mt-5 flex w-full justify-center">
          <Button
            style="secondary"
            type="submit"
            title="Create"
            className="w-full"
            disabled={!isValidData}
          />
        </div>
      </form>
      <IconPickerModal
        open={modalOpen}
        onSelect={(iconName, iconColor) => {
          setIcon(iconName);
          setColor(iconColor);
          setModalOpen(false);
        }}
        onClose={() => setModalOpen(false)}
      />
    </Drawer>
  );
};

export default CreateFundDrawer;
