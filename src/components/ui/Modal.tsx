import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "@headlessui/react";
import { type FC, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  children: ReactNode;
  title: ReactNode;
  onClose: () => void;
};

const Modal: FC<ModalProps> = ({ open, children, title, onClose }) => {
  return (
    <Dialog
      as="div"
      className="relative z-50 font-bold"
      open={open}
      onClose={onClose}
    >
      <div className="fixed inset-0 overflow-y-auto text-black">
        <div className="flex min-h-full items-center justify-center bg-primary-dark/60 p-4 text-center backdrop-blur-sm">
          <Dialog.Panel className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 pt-4">
              <Dialog.Title className="pl-2 text-2xl font-bold">
                {title}
              </Dialog.Title>
              <FontAwesomeIcon
                className="p-1"
                icon={faX}
                onClick={onClose}
                size="sm"
              />
            </div>
            <div className="flex flex-col gap-4 p-4 text-left">{children}</div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
