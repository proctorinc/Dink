import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { Dialog } from "@headlessui/react";
import { type FC, type ReactNode } from "react";
import { IconButton } from "./Button";

type ModalProps = {
  open: boolean;
  children: ReactNode;
  title: string;
  onClose: () => void;
};

const Modal: FC<ModalProps> = ({ open, children, title, onClose }) => {
  return (
    <Dialog as="div" className="relative z-50" open={open} onClose={onClose}>
      <div className="fixed inset-0 overflow-y-auto text-white">
        <div className="flex min-h-full items-center justify-center bg-primary-dark/60 p-4 text-center backdrop-blur-sm">
          <Dialog.Panel className="w-full max-w-lg rounded-xl bg-primary-med shadow-xl shadow-primary-dark">
            <div className="flex justify-between px-4 pt-4">
              <Dialog.Title className="text-2xl font-bold">
                {title}
              </Dialog.Title>
              <IconButton
                icon={faSquareXmark}
                noShadow
                size="sm"
                onClick={onClose}
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
