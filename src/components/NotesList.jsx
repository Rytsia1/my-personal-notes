// dikerjakan oleh: [distania_9]
import React from 'react';
import NoteItem from './NoteItem';

function groupNotesByMonthYear(notes) {
  const groups = {};

  notes.forEach((note) => {
    const date = new Date(note.createdAt);
    const groupKey = date.toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    });

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(note);
  });

  return Object.entries(groups).map(([groupName, groupNotes]) => ({
    groupName,
    groupNotes,
  }));
}

function NotesList({ notes, onDelete, onArchive, searchKeyword, dataTestId = 'notes-list' }) {
  // TODO [Basic] validasi notes agar tidak kosong.
  const hasNotes = Boolean(notes && notes.length > 0);

  if (!hasNotes) {
    return (
      <div className="notes-list" data-testid={dataTestId}>
        {/* TODO [Basic] tampilkan pesan kosong yang informatif ketika tidak ada catatan. */}
        <p
          className="notes-list__empty-message"
          data-testid={`${dataTestId}-empty`}
        >
          Tidak ada catatan
        </p>
      </div>
    );
  }

  const groupedNotes = groupNotesByMonthYear(notes);

  return (
    <div className="notes-list notes-list--grouped" data-testid={dataTestId}>
      {/* TODO [Basic] gunakan array.map untuk merender NoteItem untuk setiap catatan. */}
      {/* TODO [Skilled] ekstrak tombol aksi menjadi komponen reusable agar dipakai NoteItem. */}
      {/* TODO [Advanced] kelompokkan catatan per bulan-tahun dan render tiap grup dalam <section className="notes-group">. */}
      {groupedNotes.map(({ groupName, groupNotes }) => (
        <section
          key={groupName}
          className="notes-group"
          data-testid={`${groupName}-group`}
        >
          <div className="notes-group__header">
            <h3 className="notes-group__title">{groupName}</h3>
            <span
              className="notes-group__count"
              data-testid={`${groupName}-group-count`}
            >
              {groupNotes.length} catatan
            </span>
          </div>
          <div className="notes-group__items">
            {groupNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                onDelete={onDelete}
                onArchive={onArchive}
                searchKeyword={searchKeyword}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default NotesList;
