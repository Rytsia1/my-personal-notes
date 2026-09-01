// dikerjakan oleh: [distania_9]
import React, { useState, useEffect, useRef } from 'react';

function NoteSearch({ searchKeyword, onSearch }) {
  const [localKeyword, setLocalKeyword] = useState(searchKeyword);
  const timeoutRef = useRef(null);

  // Sinkronisasi jika nilai searchKeyword diubah dari luar
  useEffect(() => {
    setLocalKeyword(searchKeyword);
  }, [searchKeyword]);

  // Bersihkan timeout saat komponen dilepas
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleChange = (event) => {
    const value = event.target.value;
    setLocalKeyword(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSearch(value);
    }, 300); // Debounce 300ms
  };

  return (
    <div className="note-search" data-testid="note-search">
      <input
        type="text"
        placeholder="Search notes..."
        aria-label="Search notes"
        value={localKeyword}
        onChange={handleChange}
        data-testid="note-search-input"
      />
    </div>
  );
}

export default React.memo(NoteSearch);
