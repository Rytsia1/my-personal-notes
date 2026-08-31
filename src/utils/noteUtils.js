export const showFormattedDate = (date) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Date(date).toLocaleDateString('id-ID', options);
};

export const getAllTags = (notes) => {
  const tagsSet = new Set();
  notes.forEach((note) => {
    if (Array.isArray(note.tags)) {
      note.tags.forEach((tag) => tagsSet.add(tag));
    }
  });
  return Array.from(tagsSet).sort();
};

export const filterNotes = (notes, keyword, selectedTag = 'All') => {
  return notes.filter((note) => {
    // Check Tag
    const hasTag = selectedTag === 'All' || (note.tags && note.tags.includes(selectedTag));
    if (!hasTag) return false;

    // Check Keyword in title, body, or tags
    if (!keyword) return true;
    
    const lowerKeyword = keyword.toLowerCase().trim();
    const matchTitle = note.title.toLowerCase().includes(lowerKeyword);
    const matchBody = note.body.toLowerCase().includes(lowerKeyword);
    const matchTags = note.tags && note.tags.some(tag => tag.toLowerCase().includes(lowerKeyword));

    return matchTitle || matchBody || matchTags;
  });
};

export const sortNotes = (notes, sortBy = 'newest') => {
  return [...notes].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'newest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });
};

export const getActiveNotes = (notes) => {
  return notes.filter((note) => !note.archived);
};

export const getArchivedNotes = (notes) => {
  return notes.filter((note) => note.archived);
};
