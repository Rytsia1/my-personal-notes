const getInitialData = () => ([
  {
    id: 1,
    title: 'Babel',
    body: 'Babel merupakan tools open-source yang digunakan untuk mengubah sintaks ECMAScript 2015+ menjadi sintaks yang didukung oleh JavaScript engine versi lama. Babel sering dipakai ketika kita menggunakan sintaks terbaru termasuk sintaks JSX.',
    createdAt: '2025-04-01T04:27:34.572Z',
    archived: false,
    tagIds: ['tag-1', 'tag-2'],
    cognitiveLoad: 4,
  },
  {
    id: 2,
    title: 'Functional Component',
    body: 'Functional component merupakan React component yang dibuat menggunakan fungsi JavaScript. Agar fungsi JavaScript dapat disebut component ia harus mengembalikan React element dan dipanggil layaknya React component.',
    createdAt: '2025-04-02T04:27:34.572Z',
    archived: false,
    tagIds: ['tag-1', 'tag-3'],
    cognitiveLoad: 2,
  },
  {
    id: 3,
    title: 'Modularization',
    body: 'Dalam konteks pemrograman JavaScript, modularization merupakan teknik dalam memecah atau menggunakan kode dalam berkas JavaScript secara terpisah berdasarkan tanggung jawabnya masing-masing.',
    createdAt: '2025-04-03T04:27:34.572Z',
    archived: false,
    tagIds: ['tag-1'],
    cognitiveLoad: 3,
  },
  {
    id: 4,
    title: 'Lifecycle',
    body: 'Dalam konteks React component, lifecycle merupakan kumpulan method yang menjadi siklus hidup mulai dari component dibuat (constructor), dicetak (render), pasca-cetak (componentDidMount), dan sebagainya. ',
    createdAt: '2025-04-08T04:27:34.572Z',
    archived: false,
    tagIds: ['tag-1', 'tag-3'],
    cognitiveLoad: 5,
  },
  {
    id: 5,
    title: 'ESM',
    body: 'ESM (ECMAScript Module) merupakan format modularisasi standar JavaScript.',
    createdAt: '2025-05-14T04:27:34.572Z',
    archived: false,
    tagIds: ['tag-1'],
    cognitiveLoad: 1,
  },
  {
    id: 6,
    title: 'Module Bundler',
    body: 'Dalam konteks pemrograman JavaScript, module bundler merupakan tools yang digunakan untuk menggabungkan seluruh modul JavaScript yang digunakan oleh aplikasi menjadi satu berkas.',
    createdAt: '2025-05-20T04:27:34.572Z',
    updatedAt: null,
    archived: false,
    tagIds: ['tag-1', 'tag-2'],
    cognitiveLoad: 4,
  },
]);

const LOCAL_STORAGE_KEY = 'NOTES_APP_DATA';

export const fetchNotes = () => {
  const storedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
  let notes = null;
  if (storedNotes) {
    try {
      notes = JSON.parse(storedNotes);
    } catch (error) {
      console.error('Error parsing stored notes', error);
      return getInitialData();
    }
  } else {
    return getInitialData();
  }

  // Migration logic: string tags -> relational tagIds
  let needsMigration = false;
  let storedTags = [];
  try {
    storedTags = JSON.parse(localStorage.getItem('TAGS_APP_DATA') || '[]');
  } catch (e) {}

  const updatedNotes = notes.map(note => {
    if (note.tags && Array.isArray(note.tags)) {
      needsMigration = true;
      const newTagIds = [];
      note.tags.forEach(tagString => {
        const lowerStr = tagString.toLowerCase().trim();
        let existingTag = storedTags.find(t => t.name.toLowerCase() === lowerStr);
        if (!existingTag) {
          existingTag = { id: crypto.randomUUID(), name: tagString.trim() };
          storedTags.push(existingTag);
        }
        if (!newTagIds.includes(existingTag.id)) {
          newTagIds.push(existingTag.id);
        }
      });
      const { tags, ...rest } = note; // remove old 'tags'
      return { ...rest, tagIds: newTagIds, cognitiveLoad: note.cognitiveLoad || 1 };
    }
    return { ...note, cognitiveLoad: note.cognitiveLoad || 1 };
  });

  if (needsMigration) {
    localStorage.setItem('TAGS_APP_DATA', JSON.stringify(storedTags));
    saveNotes(updatedNotes);
  }

  return updatedNotes;
};

export const saveNotes = (notes) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch (error) {
    console.error('Error saving notes to storage:', error);
    return false;
  }
};

export const createNewNoteObject = ({ title, body, tagIds = [], cognitiveLoad = 1 }) => {
  return {
    id: crypto.randomUUID(),
    title,
    body,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    archived: false,
    tagIds,
    cognitiveLoad,
  };
};
