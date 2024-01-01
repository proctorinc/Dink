import { faGripLines } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "@headlessui/react";
import { type FC, type ReactNode } from "react";
import { type IconColor } from "~/config";

type DrawerProps = {
  open: boolean;
  title?: ReactNode;
  children: ReactNode;
  onClose: () => void;
  color?: IconColor;
  className?: string;
};

const Drawer: FC<DrawerProps> = ({
  open,
  title,
  children,
  onClose,
  color,
  className,
}) => {
  return (
    <Dialog as="div" className="relative z-20" open={open} onClose={onClose}>
      <div className="fixed inset-0 overflow-y-auto text-black">
        <div className="flex min-h-full items-center justify-center bg-primary-dark/60 p-4 text-center backdrop-blur-sm">
          <Dialog.Panel
            as="div"
            className="absolute bottom-0 flex w-full max-w-md flex-col items-center gap-4 rounded-t-2xl bg-gray-100 pb-20 font-bold text-black"
          >
            <div
              className="flex w-full flex-col items-center justify-center rounded-t-2xl border-b-2 px-6 py-4 text-xl"
              style={{
                backgroundColor: color?.secondary,
                background: color
                  ? `linear-gradient(45deg, ${color?.primary} 0%, ${color?.secondary} 100%)`
                  : "",
                borderColor: color?.primary,
              }}
            >
              <FontAwesomeIcon
                icon={faGripLines}
                size="lg"
                className="-mt-3 pb-4 text-gray-500"
                onClick={onClose}
                style={{
                  color: color?.primary,
                }}
              />
              <div className="flex w-full justify-center">{title}</div>
            </div>
            <div className="w-full p-4">
              <div
                className={`flex w-full max-w-md flex-col rounded-xl border border-gray-300 bg-white p-4 shadow-md ${
                  className ?? ""
                }`}
              >
                {children}
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default Drawer;
