import {
  faAngleRight,
  faCoins,
  faPencil,
  faPlusCircle,
  faReceipt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Prisma, type Fund } from "@prisma/client";
import { useRouter } from "next/router";
import { type FC, useState, type FormEvent } from "react";
import Button from "~/components/ui/Button";
import Drawer from "~/components/ui/Drawer";
import IconPickerModal from "~/components/ui/Icons/IconPickerModal";
import { type IconColor } from "~/config";
import useIcons from "~/hooks/useIcons";
import { formatToCurrency } from "~/utils";
import { api } from "~/utils/api";

type FundDetailDrawerProps = {
  open: boolean;
  fund: Fund & {
    amount: Prisma.Decimal;
  };
  onClose: () => void;
};

const FundDetailDrawer: FC<FundDetailDrawerProps> = ({
  open,
  onClose,
  fund,
}) => {
  const { convertToIcon, convertToColor, defaultColor } = useIcons();
  const ctx = api.useContext();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const deleteFund = api.funds.delete.useMutation({
    onSuccess: () => {
      void ctx.invalidate();
    },
  });

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValidData && dataHasChanged) {
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
  const dataHasChanged =
    name !== fund.name || fund.color !== color.name || fund.icon !== icon;

  const DrawerHeader = () => (
    <div className="flex w-full flex-col gap-4">
      {!isEditing && (
        <div className="flex flex-col gap-2 pb-2">
          <div className="flex items-center justify-center gap-4 text-left">
            <FontAwesomeIcon
              style={{
                color: color?.secondary,
              }}
              size="3x"
              icon={convertToIcon(icon) ?? faPlusCircle}
            />
            <div className="flex w-full flex-col justify-start">
              <h1 className="z-10 w-full text-3xl font-extrabold text-white">
                {fund.name}
              </h1>
              <span
                className="text-light text-sm"
                style={{
                  color: color?.secondary,
                }}
              >
                Savings Fund
              </span>
            </div>
          </div>
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
              disabled={!isValidData || !dataHasChanged}
            />
          </div>
        </form>
      )}
    </div>
  );

  if (!open) {
    return <></>;
  }

  return (
    <Drawer
      className="gap-0 p-0"
      title={<DrawerHeader />}
      open={open}
      color={color}
      onClose={() => {
        setIsEditing(false);
        setIsDeleting(false);
        onClose();
      }}
    >
      <div className="flex flex-col gap-4 border-b border-gray-300 p-4">
        <span className="text-lg">
          Current Savings: {formatToCurrency(fund.amount)}
        </span>
      </div>
      {!isEditing && !isDeleting && (
        <>
          <div
            className="flex w-full items-center justify-between border-b border-gray-300 p-4"
            onClick={() => setIsDeleting(true)}
          >
            <div className="flex items-center gap-4">
              <FontAwesomeIcon
                size="lg"
                className="text-gray-600"
                icon={faTrash}
              />
              <span>Delete Fund</span>
            </div>
            <FontAwesomeIcon icon={faAngleRight} />
          </div>
          <div
            className="flex w-full items-center justify-between gap-2 border-b border-gray-300 p-4"
            onClick={() => setIsEditing(true)}
          >
            <div className="flex items-center gap-4">
              <FontAwesomeIcon
                size="lg"
                className="text-gray-600"
                icon={faPencil}
              />
              <span>Edit Fund</span>
            </div>
            <FontAwesomeIcon icon={faAngleRight} />
          </div>
          <div className="flex w-full items-center justify-between gap-2 border-b border-gray-300 p-4">
            <div className="flex items-center gap-4">
              <FontAwesomeIcon
                size="lg"
                className="text-gray-600"
                icon={faCoins}
              />
              <span>Allocate Savings</span>
            </div>
            <FontAwesomeIcon icon={faAngleRight} />
          </div>
          <div
            className="flex w-full items-center justify-between gap-2 border-gray-300 p-4"
            onClick={() =>
              void router.push({
                pathname: "/transactions",
                query: { fundId: fund.id, includeSavings: true },
              })
            }
          >
            <div className="flex items-center gap-4">
              <FontAwesomeIcon
                size="lg"
                className="text-gray-600"
                icon={faReceipt}
              />
              <span>View Transactions</span>
            </div>
            <FontAwesomeIcon icon={faAngleRight} />
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
        </>
      )}
      {isDeleting && (
        <div className="flex flex-col items-center gap-4 p-4">
          <h3 className="text-lg">Are you sure you want to delete?</h3>
          <span className="font-light italic">
            All data will be lost permanently
          </span>
          <div className="flex w-full justify-around">
            <Button
              style="danger"
              title="Delete"
              onClick={() => deleteFund.mutate({ fundId: fund.id })}
            />
            <Button
              style="secondary"
              title="Cancel"
              onClick={() => setIsDeleting(false)}
            />
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default FundDetailDrawer;
