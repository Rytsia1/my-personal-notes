// dikerjakan oleh: [distania_9]
import React, { useState } from 'react';
import { showFormattedDate } from '../utils';
import NoteActionButton from './NoteActionButton';

function highlightText(text, keyword) {
  if (!keyword || !keyword.trim()) {
    return text;
  }

  const escaped = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? <mark key={index}>{part}</mark> : part
  );
}

function NoteItem({ note, onEdit, onDelete, onArchive, searchKeyword }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editBody, setEditBody] = useState(note.body);
  const [editTagsString, setEditTagsString] = useState((note.tags || []).join(', '));

  const handleSave = () => {
    const tagsArray = editTagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
      
    onEdit(note.id, { title: editTitle, body: editBody, tags: tagsArray });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(note.title);
    setEditBody(note.body);
    setEditTagsString((note.tags || []).join(', '));
    setIsEditing(false);
  };

  return (
    <div
      className="note-item"
      data-testid="note-item"
      data-note-id={note?.id}
    >
      <div className="note-item__content" data-testid="note-item-content">
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              className="note-item__edit-title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <p className="note-item__date" data-testid="note-item-date" style={{ margin: 0 }}>
              {showFormattedDate(note.createdAt)}
              {note.updatedAt && <><br/><i>(Diperbarui: {showFormattedDate(note.updatedAt)})</i></>}
            </p>
            <textarea
              className="note-item__edit-body"
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
            />
            <input
              type="text"
              className="note-item__edit-tags"
              placeholder="Tags (pisahkan dengan koma)"
              value={editTagsString}
              onChange={(e) => setEditTagsString(e.target.value)}
            />
          </div>
        ) : (
          <>
            <h3 className="note-item__title" data-testid="note-item-title">
              {highlightText(note.title, searchKeyword)}
            </h3>
            <p className="note-item__date" data-testid="note-item-date">
              {showFormattedDate(note.createdAt)}
              {note.updatedAt && <><br/><i>(Diperbarui: {showFormattedDate(note.updatedAt)})</i></>}
            </p>
            <p className="note-item__body" data-testid="note-item-body">
              {highlightText(note.body, searchKeyword)}
            </p>
            {note.tags && note.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '12px' }}>
                {note.tags.map(tag => (
                  <span key={tag} className="note-item__tag">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <div className="note-item__action" data-testid="note-item-action">
        {isEditing ? (
          <>
            <NoteActionButton variant="save" onClick={handleSave}>
              Save
            </NoteActionButton>
            <NoteActionButton variant="cancel" onClick={handleCancel}>
              Cancel
            </NoteActionButton>
          </>
        ) : (
          <>
            <NoteActionButton
              variant="edit"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </NoteActionButton>
            <NoteActionButton
              variant="delete"
              onClick={() => onDelete(note.id)}
              dataTestId="note-item-delete-button"
            >
              Delete
            </NoteActionButton>
            <NoteActionButton
              variant="archive"
              onClick={() => onArchive(note.id)}
              dataTestId="note-item-archive-button"
            >
              {note.archived ? 'Pindahkan' : 'Arsipkan'}
            </NoteActionButton>
          </>
        )}
      </div>
    </div>
  );
}

export default NoteItem;
