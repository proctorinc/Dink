import {
  faPencil,
  faSquareCheck,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useState, type FC } from "react";
import { IconButton } from "./Button";
import Card from "./Card";

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

  const handleUpdate = (updatedValue?: string) => {
    if (updatedValue) {
      onUpdate(updatedValue);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <Card size="sm">
        <Card.Body horizontal>
          <input
            id="input"
            placeholder={"Enter name..."}
            className="bg-primary-med text-xl font-bold text-primary-light placeholder-primary-light"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          {!!value && value.length > 0 && (
            <IconButton
              icon={faSquareCheck}
              size="xs"
              onClick={() => handleUpdate(value)}
            />
          )}
          {value?.length === 0 && (
            <IconButton
              icon={faSquareXmark}
              size="xs"
              onClick={() => setEditing(false)}
            />
          )}
        </Card.Body>
      </Card>
    );
  }
  return (
    <div className="flex gap-2">
      <h3 className={className}>{value}</h3>
      <IconButton icon={faPencil} size="xs" onClick={() => setEditing(true)} />
    </div>
  );
};

export default EditableTitle;
