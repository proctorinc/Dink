import { Button } from "@/components/Elements/Button";
import { useState } from "react";

const UpdateNotes = ({ initialNote, onUpdate }) => {
  const [note, setNote] = useState(initialNote ? initialNote : "");
  return (
    <div className="flex flex-col gap-5 items-center">
      <h1 className="text-6xl">Notes</h1>
      <textarea
        className="border border-gray-300 bg-gray-200 text-gray-500 p-3 rounded-md w-full"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write a note..."
        rows={5}
      />
      <Button text="Save" onClick={() => onUpdate({ note })} />
    </div>
  );
};

export default UpdateNotes;
