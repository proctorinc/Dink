import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type FC, type ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  title: string;
  onClose: () => void;
};

const Modal: FC<ModalProps> = ({ children, title, onClose }) => {
  return (
    <div
      className="fixed absolute top-0 z-50 flex h-screen w-full items-center justify-center overflow-y-clip overscroll-auto bg-primary-dark/50 shadow-xl backdrop-blur-sm"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="m-5 flex h-96 w-full flex-col gap-4 rounded-xl bg-primary-med p-4 shadow-2xl">
        <div className="flex justify-between py-2">
          <h1 className="text-xl font-bold">{title}</h1>
          <FontAwesomeIcon className="p-2" icon={faX} onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
