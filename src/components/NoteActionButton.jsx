// dikerjakan oleh: [distania_9]
import React from 'react';

function NoteActionButton({ variant, onClick, children, dataTestId }) {
  return (
    <button
      className={`note-item__${variant}-button`}
      type="button"
      onClick={onClick}
      data-testid={dataTestId || `note-item-${variant}-button`}
    >
      {children}
    </button>
  );
}

export default NoteActionButton;
