// dikerjakan oleh: [distania_9]
import React, { useState } from 'react';
import { showFormattedDate } from '../utils';
import NoteActionButton from './NoteActionButton';
import TagSelect from './TagSelect';
import CognitiveLoadSelector from './CognitiveLoadSelector';

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

function NoteItem({ note, onEdit, onDelete, onArchive, searchKeyword, availableTags, onAddTag }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editBody, setEditBody] = useState(note.body);
  const [editTagIds, setEditTagIds] = useState((note.tags || []).map(t => t.id));
  const [editCognitiveLoad, setEditCognitiveLoad] = useState(note.cognitiveLoad || 1);

  const handleSave = () => {
    onEdit(note.id, { 
      title: editTitle, 
      body: editBody, 
      tagIds: editTagIds, 
      cognitiveLoad: editCognitiveLoad 
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(note.title);
    setEditBody(note.body);
    setEditTagIds((note.tags || []).map(t => t.id));
    setEditCognitiveLoad(note.cognitiveLoad || 1);
    setIsEditing(false);
  };

  const handleKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      handleSave();
      return;
    }

    if (event.key === ' ' || event.key === 'Enter') {
      const textarea = event.target;
      const cursorPosition = textarea.selectionStart;
      const textBeforeCursor = editBody.slice(0, cursorPosition);
      
      const match = textBeforeCursor.match(/(?:^|\s)(#[a-zA-Z0-9_-]+)$/);
      
      if (match) {
        event.preventDefault();
        const hashtagWithHash = match[1];
        const tagName = hashtagWithHash.slice(1);
        
        const tag = onAddTag(tagName);
        if (tag) {
          setEditTagIds(prevIds => 
            prevIds.includes(tag.id) ? prevIds : [...prevIds, tag.id]
          );
          
          const textAfterCursor = editBody.slice(cursorPosition);
          const newTextBeforeCursor = textBeforeCursor.slice(0, -hashtagWithHash.length);
          const newBody = newTextBeforeCursor + textAfterCursor;
          
          setEditBody(newBody);
          
          setTimeout(() => {
            const newPos = newTextBeforeCursor.length;
            textarea.setSelectionRange(newPos, newPos);
          }, 0);
        }
      }
    }
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
            <CognitiveLoadSelector 
              value={editCognitiveLoad}
              onChange={setEditCognitiveLoad}
            />
            <p className="note-item__date" data-testid="note-item-date" style={{ margin: 0 }}>
              {showFormattedDate(note.createdAt)}
              {note.updatedAt && <><br/><i>(Updated: {showFormattedDate(note.updatedAt)})</i></>}
            </p>
            <textarea
              className="note-item__edit-body"
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <TagSelect
              availableTags={availableTags}
              selectedTagIds={editTagIds}
              onChange={setEditTagIds}
              onAddTag={onAddTag}
            />
          </div>
        ) : (
          <>
            <h3 className="note-item__title" data-testid="note-item-title">
              {highlightText(note.title, searchKeyword)}
            </h3>
            <p className="note-item__date" data-testid="note-item-date">
              {showFormattedDate(note.createdAt)}
              {note.updatedAt && <><br/><i>(Updated: {showFormattedDate(note.updatedAt)})</i></>}
            </p>
            <p className="note-item__body" data-testid="note-item-body">
              {highlightText(note.body, searchKeyword)}
            </p>
            <CognitiveLoadSelector 
              value={note.cognitiveLoad || 1}
              readOnly={true}
            />
            {note.tags && note.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '12px' }}>
                {note.tags.map(tag => (
                  <span key={tag.id} className="note-item__tag">
                    #{tag.name}
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
              {note.archived ? 'Unarchive' : 'Archive'}
            </NoteActionButton>
          </>
        )}
      </div>
    </div>
  );
}

export default React.memo(NoteItem);
