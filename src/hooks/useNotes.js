import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchNotes, saveNotes, createNewNoteObject } from '../services/noteService';

const useNotes = () => {
  const [notes, setNotes] = useState(() => fetchNotes());
  const [lastDeletedNote, setLastDeletedNote] = useState(null);
  const deleteTimeoutRef = useRef(null);

  const [saveError, setSaveError] = useState(false);

  const performSave = useCallback((notesToSave) => {
    const success = saveNotes(notesToSave);
    setSaveError(!success);
  }, []);

  useEffect(() => {
    performSave(notes);
  }, [notes, performSave]);

  const retrySave = useCallback(() => {
    performSave(notes);
  }, [notes, performSave]);

  useEffect(() => {
    return () => {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
    };
  }, []);

  const addNote = useCallback(({ title, body, tags = [] }) => {
    const newNote = createNewNoteObject({ title, body, tags });
    setNotes((prevNotes) => [...prevNotes, newNote]);
  }, []);

  const deleteNote = useCallback((id) => {
    setNotes((prevNotes) => {
      const noteToDelete = prevNotes.find((n) => n.id === id);
      if (noteToDelete) {
        setLastDeletedNote(noteToDelete);
        if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
        
        deleteTimeoutRef.current = setTimeout(() => {
          setLastDeletedNote(null);
        }, 5000);
      }
      return prevNotes.filter((note) => note.id !== id);
    });
  }, []);

  const undoDelete = useCallback(() => {
    setLastDeletedNote((prevDeleted) => {
      if (prevDeleted) {
        setNotes((prevNotes) => [...prevNotes, prevDeleted]);
        if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
      }
      return null;
    });
  }, []);

  const toggleArchive = useCallback((id) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, archived: !note.archived };
        }
        return note;
      })
    );
  }, []);

  const editNote = useCallback((id, updatedData) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, ...updatedData, updatedAt: new Date().toISOString() } : note
      )
    );
  }, []);

  return {
    notes,
    addNote,
    editNote,
    deleteNote,
    toggleArchive,
    lastDeletedNote,
    undoDelete,
    saveError,
    retrySave,
  };
};

export default useNotes;
