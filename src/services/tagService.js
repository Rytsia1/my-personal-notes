const LOCAL_STORAGE_KEY = 'TAGS_APP_DATA';

const getInitialTags = () => ([
  { id: 'tag-1', name: 'Programming' },
  { id: 'tag-2', name: 'Tooling' },
  { id: 'tag-3', name: 'React' },
]);

export const fetchTags = () => {
  const storedTags = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedTags) {
    try {
      return JSON.parse(storedTags);
    } catch (error) {
      console.error('Error parsing stored tags', error);
      return getInitialTags();
    }
  }
  return getInitialTags();
};

export const saveTags = (tags) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tags));
  } catch (error) {
    console.error('Error saving tags to storage:', error);
  }
};

export const createNewTagObject = (name) => {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
  };
};
