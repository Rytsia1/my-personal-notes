import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchNotes, createNoteApi, updateNoteApi, deleteNoteApi } from '../services/noteService';

const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastDeletedNote, setLastDeletedNote] = useState(null);
  const deleteTimeoutRef = useRef(null);

  const [saveError, setSaveError] = useState(false);

  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchNotes();
    setNotes(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    return () => {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
    };
  }, []);

  const addNote = useCallback(async ({ title, body, tags = [], relationTitles = [], cognitiveLoad = 1 }) => {
    // Optimistic UI update can be complex with relations, so we fetch after creation
    const tagIds = tags.map(t => t.id);
    const created = await createNoteApi({ title, body, tagIds, relationTitles, cognitiveLoad });
    if (created) {
      loadNotes(); // Reload to get fully hydrated entities with tags and relations
      setSaveError(false);
    } else {
      setSaveError(true);
    }
  }, [loadNotes]);

  const editNote = useCallback(async (id, updatedData) => {
    const updated = await updateNoteApi(id, updatedData);
    if (updated) {
      loadNotes();
      setSaveError(false);
    } else {
      setSaveError(true);
    }
  }, [loadNotes]);

  const deleteNote = useCallback(async (id) => {
    const noteToDelete = notes.find((n) => n.id === id);
    if (noteToDelete) {
      setLastDeletedNote(noteToDelete);
      if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
      deleteTimeoutRef.current = setTimeout(() => {
        setLastDeletedNote(null);
      }, 5000);
    }
    
    // Optimistic delete
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    
    const success = await deleteNoteApi(id);
    if (!success) {
      loadNotes(); // Revert if failed
      setSaveError(true);
    }
  }, [notes, loadNotes]);

  const undoDelete = useCallback(async () => {
    if (lastDeletedNote) {
      const { title, body, tags, cognitiveLoad } = lastDeletedNote;
      const tagIds = tags ? tags.map(t => t.id) : [];
      await createNoteApi({ title, body, tagIds, cognitiveLoad });
      loadNotes();
      setLastDeletedNote(null);
      if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
    }
  }, [lastDeletedNote, loadNotes]);

  const toggleArchive = useCallback(async (id) => {
    const noteToUpdate = notes.find(n => n.id === id);
    if (noteToUpdate) {
      await updateNoteApi(id, { archived: !noteToUpdate.archived });
      loadNotes();
    }
  }, [notes, loadNotes]);

  const retrySave = useCallback(() => {
    setSaveError(false);
  }, []);

  return {
    notes,
    isLoading,
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
