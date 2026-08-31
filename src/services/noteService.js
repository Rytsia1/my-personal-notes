const getInitialData = () => ([
  {
    id: 1,
    title: 'Babel',
    body: 'Babel merupakan tools open-source yang digunakan untuk mengubah sintaks ECMAScript 2015+ menjadi sintaks yang didukung oleh JavaScript engine versi lama. Babel sering dipakai ketika kita menggunakan sintaks terbaru termasuk sintaks JSX.',
    createdAt: '2025-04-01T04:27:34.572Z',
    archived: false,
    tags: ['Programming', 'Tooling'],
  },
  {
    id: 2,
    title: 'Functional Component',
    body: 'Functional component merupakan React component yang dibuat menggunakan fungsi JavaScript. Agar fungsi JavaScript dapat disebut component ia harus mengembalikan React element dan dipanggil layaknya React component.',
    createdAt: '2025-04-02T04:27:34.572Z',
    archived: false,
    tags: ['Programming', 'React'],
  },
  {
    id: 3,
    title: 'Modularization',
    body: 'Dalam konteks pemrograman JavaScript, modularization merupakan teknik dalam memecah atau menggunakan kode dalam berkas JavaScript secara terpisah berdasarkan tanggung jawabnya masing-masing.',
    createdAt: '2025-04-03T04:27:34.572Z',
    archived: false,
    tags: ['Programming'],
  },
  {
    id: 4,
    title: 'Lifecycle',
    body: 'Dalam konteks React component, lifecycle merupakan kumpulan method yang menjadi siklus hidup mulai dari component dibuat (constructor), dicetak (render), pasca-cetak (componentDidMount), dan sebagainya. ',
    createdAt: '2025-04-08T04:27:34.572Z',
    archived: false,
    tags: ['Programming', 'React'],
  },
  {
    id: 5,
    title: 'ESM',
    body: 'ESM (ECMAScript Module) merupakan format modularisasi standar JavaScript.',
    createdAt: '2025-05-14T04:27:34.572Z',
    archived: false,
    tags: ['Programming'],
  },
  {
    id: 6,
    title: 'Module Bundler',
    body: 'Dalam konteks pemrograman JavaScript, module bundler merupakan tools yang digunakan untuk menggabungkan seluruh modul JavaScript yang digunakan oleh aplikasi menjadi satu berkas.',
    createdAt: '2025-05-20T04:27:34.572Z',
    archived: false,
    tags: ['Programming', 'Tooling'],
  },
]);

const LOCAL_STORAGE_KEY = 'NOTES_APP_DATA';

export const fetchNotes = () => {
  const storedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedNotes) {
    try {
      return JSON.parse(storedNotes);
    } catch (error) {
      console.error('Error parsing stored notes', error);
      return getInitialData();
    }
  }
  return getInitialData();
};

export const saveNotes = (notes) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
};

export const createNewNoteObject = ({ title, body, tags = [] }) => {
  return {
    id: +new Date(),
    title,
    body,
    createdAt: new Date().toISOString(),
    archived: false,
    tags,
  };
};
