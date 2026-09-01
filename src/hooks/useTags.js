import { useState, useEffect } from 'react';
import { fetchTags, saveTags, createNewTagObject } from '../services/tagService';

const useTags = () => {
  const [tags, setTags] = useState(() => fetchTags());

  useEffect(() => {
    saveTags(tags);
  }, [tags]);

  const addTag = (name) => {
    const cleanName = name.trim();
    if (!cleanName) return null;

    // Check for case-insensitive duplicate
    const existingTag = tags.find(
      (t) => t.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (existingTag) return existingTag;

    const newTag = createNewTagObject(cleanName);
    setTags((prevTags) => [...prevTags, newTag]);
    return newTag;
  };

  const renameTag = (id, newName) => {
    const cleanName = newName.trim();
    if (!cleanName) return;

    // Check for case-insensitive duplicate (excluding self)
    const existingTag = tags.find(
      (t) => t.name.toLowerCase() === cleanName.toLowerCase() && t.id !== id
    );
    
    if (existingTag) {
      return false; // Can't rename to an existing tag name
    }

    setTags((prevTags) =>
      prevTags.map((tag) =>
        tag.id === id ? { ...tag, name: cleanName } : tag
      )
    );
    return true;
  };

  const deleteTag = (id) => {
    setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
  };

  return {
    tags,
    addTag,
    renameTag,
    deleteTag,
  };
};

export default useTags;
