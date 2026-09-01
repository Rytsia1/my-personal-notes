// dikerjakan oleh: [distania_9]
import React from 'react';

function NoteSearch({ searchKeyword, onSearch }) {
  return (
    <div className="note-search" data-testid="note-search">
      {/* TODO [Skilled] sediakan input pencarian untuk memfilter catatan */}
      <input
        type="text"
        placeholder="Search notes..."
        aria-label="Search notes"
        value={searchKeyword}
        onChange={(event) => onSearch(event.target.value)}
        data-testid="note-search-input"
      />
    </div>
  );
}

export default NoteSearch;
