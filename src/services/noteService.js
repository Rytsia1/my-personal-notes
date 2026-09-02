const API_URL = 'http://localhost:8080/api/notes';

export const fetchNotes = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.map(note => ({
      ...note,
      tagIds: note.tags ? note.tags.map(t => t.id) : [],
      relationTitles: note.relations ? note.relations.map(r => r.title) : []
    }));
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
};

export const saveNotes = async (notes) => {
  // Deprecated in favor of individual API calls
  return true;
};

export const createNoteApi = async ({ title, body, tagIds = [], relationTitles = [], cognitiveLoad = 1 }) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, tagIds, relationTitles, cognitiveLoad, archived: false })
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating note:', error);
    return null;
  }
};

export const updateNoteApi = async (id, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating note:', error);
    return null;
  }
};

export const deleteNoteApi = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    return false;
  }
};
