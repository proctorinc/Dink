import {
  faExclamationTriangle,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { type FC, useState } from "react";
import Button from "./Button";
import Card from "./Card";

type ConfirmDeleteProps = {
  buttonText?: string;
  confirmationText: string;
  onDelete: () => void;
};

const ConfirmDelete: FC<ConfirmDeleteProps> = ({
  buttonText,
  confirmationText,
  onDelete,
}) => {
  const [clickedDelete, setClickedDelete] = useState(false);
  const [text, setText] = useState("");

  const isMatchingConfirmationText = text === confirmationText;

  const handleDeleteConfirmed = () => {
    onDelete();
    setClickedDelete(false);
    setText("");
  };

  return (
    <>
      {!clickedDelete && (
        <Button
          title={buttonText ?? "Delete"}
          icon={faTrash}
          style="danger"
          onClick={() => setClickedDelete(true)}
        />
      )}
      {clickedDelete && (
        <Card noShadow>
          <Card.Body>
            <Card.Group>
              <label htmlFor="name-input" className="text-primary-light">
                Enter{" "}
                <span className="font-bold text-white">{confirmationText}</span>{" "}
                to delete
              </label>
              <div className="w-full pb-3">
                <input
                  id="name-input"
                  placeholder="Enter name..."
                  className="w-full bg-primary-med text-xl font-bold text-primary-light placeholder-primary-light"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                />
              </div>
              <Button
                title="Delete"
                style="danger"
                icon={faExclamationTriangle}
                onClick={handleDeleteConfirmed}
                disabled={!isMatchingConfirmationText}
              />
              <Button
                title="Cancel"
                icon={faXmark}
                style="secondary"
                onClick={() => setClickedDelete(false)}
              />
            </Card.Group>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default ConfirmDelete;
