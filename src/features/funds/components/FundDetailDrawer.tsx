import {
  faCoins,
  faPencil,
  faPlusCircle,
  faReceipt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Fund } from "@prisma/client";
import { type FC, useState, type FormEvent } from "react";
import Button from "~/components/ui/Button";
import Drawer from "~/components/ui/Drawer";
import IconPickerModal from "~/components/ui/Icons/IconPickerModal";
import { type IconColor } from "~/config";
import useIcons from "~/hooks/useIcons";
import { api } from "~/utils/api";

type FundDetailDrawerProps = {
  open: boolean;
  fund: Fund;
  onClose: () => void;
};

const FundDetailDrawer: FC<FundDetailDrawerProps> = ({
  open,
  onClose,
  fund,
}) => {
  const { convertToIcon, convertToColor, defaultColor } = useIcons();
  const ctx = api.useContext();
  const [isEditing, setIsEditing] = useState(false);
  const [icon, setIcon] = useState<string | null>(fund?.icon ?? null);
  const [color, setColor] = useState<IconColor>(
    fund ? convertToColor(fund?.color) : defaultColor
  );
  const [name, setName] = useState(fund?.name ?? "");
  const [modalOpen, setModalOpen] = useState(false);

  const updateFund = api.funds.update.useMutation({
    onSuccess: () => {
      void ctx.invalidate();
    },
  });

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValidData) {
      updateFund.mutate({
        fundId: fund.id,
        name,
        icon,
        color: color?.name,
      });
      setIsEditing(false);
    }
  };

  const isValidData = !!fund && !!name && !!icon;

  if (!open) {
    return <></>;
  }

  return (
    <Drawer
      title={
        <>
          {!isEditing && (
            <div className="flex w-full items-center justify-center gap-2 text-left">
              <div className="flex-col gap-2">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl shadow-md"
                  style={{
                    backgroundColor: color?.primary,
                    color: color?.secondary,
                  }}
                >
                  <FontAwesomeIcon
                    size="lg"
                    icon={convertToIcon(icon) ?? faPlusCircle}
                  />
                </div>
              </div>
              <h1 className="w-full rounded-xl font-bold placeholder-gray-500">
                {fund.name}
              </h1>
            </div>
          )}
          {isEditing && (
            <form onSubmit={submitForm}>
              <div className="flex flex-col gap-2 text-left">
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
              <div className="mt-5 flex w-full justify-center gap-4">
                <Button
                  style="danger"
                  type="submit"
                  title="Cancel"
                  className="w-full"
                  onClick={(event) => {
                    event.preventDefault();
                    setIsEditing(false);
                  }}
                />
                <Button
                  style="secondary"
                  type="submit"
                  title="Update"
                  className="w-full"
                  disabled={!isValidData}
                />
              </div>
            </form>
          )}
        </>
      }
      open={open}
      onClose={onClose}
    >
      <div className="flex justify-between text-gray-600">
        <div className="flex w-20 flex-col gap-2 text-sm">
          <FontAwesomeIcon size="lg" icon={faTrash} />
          <span>Delete</span>
        </div>
        <div
          className="flex w-20 flex-col gap-2 text-sm"
          onClick={() => setIsEditing(true)}
        >
          <FontAwesomeIcon size="lg" icon={faPencil} />
          <span>Edit</span>
        </div>
        <div className="flex w-20 flex-col gap-2 text-sm">
          <FontAwesomeIcon size="lg" icon={faCoins} />
          <span>Allocate</span>
        </div>
        <div className="flex w-20 flex-col gap-2 text-sm">
          <FontAwesomeIcon size="lg" icon={faReceipt} />
          <span>Transactions</span>
        </div>
      </div>
      <IconPickerModal
        open={modalOpen}
        initialIcon={fund.icon}
        initialColor={fund.color}
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

export default FundDetailDrawer;
