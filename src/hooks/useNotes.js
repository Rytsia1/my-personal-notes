import { useState, useEffect, useRef } from 'react';
import { fetchNotes, saveNotes, createNewNoteObject } from '../services/noteService';

const useNotes = () => {
  const [notes, setNotes] = useState(() => fetchNotes());
  const [lastDeletedNote, setLastDeletedNote] = useState(null);
  const deleteTimeoutRef = useRef(null);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    return () => {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
    };
  }, []);

  const addNote = ({ title, body, tags = [] }) => {
    const newNote = createNewNoteObject({ title, body, tags });
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const deleteNote = (id) => {
    const noteToDelete = notes.find((n) => n.id === id);
    if (!noteToDelete) return;

    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    
    setLastDeletedNote(noteToDelete);
    if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
    
    deleteTimeoutRef.current = setTimeout(() => {
      setLastDeletedNote(null);
    }, 5000);
  };

  const undoDelete = () => {
    if (lastDeletedNote) {
      setNotes((prevNotes) => [...prevNotes, lastDeletedNote]);
      setLastDeletedNote(null);
      if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
    }
  };

  const toggleArchive = (id) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, archived: !note.archived };
        }
        return note;
      })
    );
  };

  const editNote = (id, updatedData) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, ...updatedData, updatedAt: new Date().toISOString() } : note
      )
    );
  };

  return {
    notes,
    addNote,
    editNote,
    deleteNote,
    toggleArchive,
    lastDeletedNote,
    undoDelete,
  };
};

export default useNotes;
