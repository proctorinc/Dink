import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { useState, type FC } from "react";
import Button, { IconButton } from "./Button";
import Modal from "./Modal";

type EditableTitleProps = {
  value?: string;
  onUpdate: (updatedValue: string) => void;
  className?: string;
};

const EditableTitle: FC<EditableTitleProps> = ({
  value: initialValue,
  onUpdate,
  className,
}) => {
  const [value, setValue] = useState(initialValue);
  const [editing, setEditing] = useState(false);

  const handleUpdate = () => {
    if (value) {
      onUpdate(value);
      setEditing(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <h3 className={className}>{value}</h3>
        <IconButton
          className="aspect-square h-6 w-6"
          icon={faPencil}
          size="xs"
          onClick={() => setEditing(true)}
        />
      </div>
      <Modal title="Edit" open={editing} onClose={() => setEditing(false)}>
        <input
          id="input"
          placeholder={"..."}
          className="rounded-xl bg-primary-light/50 p-2 text-xl font-bold text-primary-dark placeholder-primary-light"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <Button title="Confirm" onClick={handleUpdate} style="secondary" />
      </Modal>
    </>
  );
};

export default EditableTitle;
