import React, { useContext } from "react";
import { DialoguesContext } from "../context/DialoguesContext";

const Dialogues = ({ currentTime }) => {
  const { currentDialogue, setDialogue, nextDialogue, prevDialogue } = useContext(DialoguesContext);

  const handleDialogueChange = (field, value) => {
    setDialogue(field, value);
  };

  return (
    <div className="mt-4 w-full">
      <div className="p-4 border rounded">
        <h3>Original Text</h3>
        <textarea
          className="w-full p-2 border rounded"
          value={currentDialogue.original}
          onChange={(e) => handleDialogueChange("original", e.target.value)}
        />
      </div>
      <div className="p-4 border rounded mt-4">
        <h3>Translated Text</h3>
        <textarea
          className="w-full p-2 border rounded"
          value={currentDialogue.translated}
          onChange={(e) => handleDialogueChange("translated", e.target.value)}
        />
      </div>

      <div className="flex justify-between mt-4">
        <button onClick={prevDialogue} className="bg-gray-500 text-white p-2 rounded">Previous</button>
        <button onClick={nextDialogue} className="bg-gray-500 text-white p-2 rounded">Next</button>
      </div>
    </div>
  );
};

export default Dialogues;
