import { useState, useEffect, useCallback } from 'react';
import { fetchTags, saveTags, createNewTagObject } from '../services/tagService';

const useTags = () => {
  const [tags, setTags] = useState(() => fetchTags());

  useEffect(() => {
    saveTags(tags);
  }, [tags]);

  const addTag = useCallback((name) => {
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
  }, [tags]);

  return {
    tags,
    addTag,
  };
};

export default useTags;
