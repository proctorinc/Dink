import { faGripLines } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "@headlessui/react";
import { useState, type FC, type ReactNode, type DragEvent } from "react";

type DrawerProps = {
  open: boolean;
  title?: ReactNode;
  children: ReactNode;
  onClose: () => void;
};

const Drawer: FC<DrawerProps> = ({ open, title, children, onClose }) => {
  const [dragY, setDragY] = useState<number>(0);

  const handleDrag = (event: DragEvent<HTMLDivElement>) => {
    console.log("Dragging!");
    setDragY(event.clientY);
  };

  return (
    <Dialog as="div" className="relative z-20" open={open} onClose={onClose}>
      <div className="fixed inset-0 overflow-y-auto text-black">
        <div className="flex min-h-full items-center justify-center bg-primary-dark/60 p-4 text-center backdrop-blur-sm">
          <Dialog.Panel
            as="div"
            className="absolute bottom-0 flex w-full max-w-md flex-col items-center gap-4 rounded-t-2xl bg-gray-100 p-4 pb-20 font-bold text-black"
          >
            <FontAwesomeIcon
              icon={faGripLines}
              size="lg"
              className="-mt-3 text-gray-500"
              onClick={onClose}
            />
            <div className="flex text-xl">{title}</div>
            <div className="flex w-full max-w-md flex-col gap-4 rounded-xl border border-gray-300 bg-white p-4 shadow-md">
              {children}
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default Drawer;
