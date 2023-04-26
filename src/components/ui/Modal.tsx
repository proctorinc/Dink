import { faX } from "@fortawesome/free-solid-svg-icons";
import { type FC, type ReactNode } from "react";
import { IconButton } from "./Button";
import Card from "./Card";

type ModalProps = {
  children: ReactNode;
  title: string;
  onClose: () => void;
};

const Modal: FC<ModalProps> = ({ children, title, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center overflow-x-hidden overflow-y-hidden overscroll-auto bg-primary-dark/60 text-white shadow-2xl backdrop-blur-sm"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="relative w-full p-6">
        <Card>
          <Card.Header>
            <h1>{title}</h1>
            <IconButton icon={faX} noShadow size="xs" onClick={onClose} />
          </Card.Header>
          <Card.Body>{children}</Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Modal;
