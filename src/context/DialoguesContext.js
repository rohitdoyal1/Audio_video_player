import React, { useState, createContext } from "react";

export const DialoguesContext = createContext();

const mockDialogues = [
  { id: 1, original: "Hello, world!", translated: "Hola, mundo!" },
  { id: 2, original: "How are you?", translated: "¿Cómo estás?" },
  { id: 3, original: "Goodbye!", translated: "¡Adiós!" },
];

export const DialoguesProvider = ({ children }) => {
  const [dialogues] = useState(mockDialogues);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);

  const currentDialogue = dialogues[currentDialogueIndex];

  const setDialogue = (field, value) => {
    const updatedDialogue = { ...currentDialogue, [field]: value };
    dialogues[currentDialogueIndex] = updatedDialogue;
  };

  const nextDialogue = () => {
    if (currentDialogueIndex < dialogues.length - 1) {
      setCurrentDialogueIndex(currentDialogueIndex + 1);
    }
  };

  const prevDialogue = () => {
    if (currentDialogueIndex > 0) {
      setCurrentDialogueIndex(currentDialogueIndex - 1);
    }
  };

  return (
    <DialoguesContext.Provider value={{ dialogues, currentDialogue, setDialogue, nextDialogue, prevDialogue }}>
      {children}
    </DialoguesContext.Provider>
  );
};
