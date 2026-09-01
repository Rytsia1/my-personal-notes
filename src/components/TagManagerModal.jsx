import React, { useState } from 'react';

function TagManagerModal({ tags, notes, onClose, onAddTag, onRenameTag, onDeleteTag }) {
  const [newTagName, setNewTagName] = useState('');
  const [editingTagId, setEditingTagId] = useState(null);
  const [editTagName, setEditTagName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const getTagUsageCount = (tagId) => {
    return notes.filter(note => note.tagIds && note.tagIds.includes(tagId)).length;
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (newTagName.trim()) {
      onAddTag(newTagName);
      setNewTagName('');
    }
  };

  const handleStartEdit = (tag) => {
    setEditingTagId(tag.id);
    setEditTagName(tag.name);
    setDeleteConfirmId(null);
  };

  const handleSaveEdit = (tagId) => {
    if (editTagName.trim()) {
      onRenameTag(tagId, editTagName);
    }
    setEditingTagId(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content tag-manager-modal">
        <div className="modal-header">
          <h2>Tags</h2>
          <button className="modal-close-button" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleCreate} className="tag-manager-form">
          <input
            type="text"
            placeholder="+ Create new tag"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
          />
        </form>

        <div className="tag-manager-list">
          {tags.map(tag => {
            const usageCount = getTagUsageCount(tag.id);
            const isEditing = editingTagId === tag.id;
            const isConfirmingDelete = deleteConfirmId === tag.id;

            if (isEditing) {
              return (
                <div key={tag.id} className="tag-manager-item tag-manager-item--editing">
                  <input
                    type="text"
                    value={editTagName}
                    onChange={(e) => setEditTagName(e.target.value)}
                    autoFocus
                  />
                  <div className="tag-manager-actions">
                    <button onClick={() => setEditingTagId(null)}>Cancel</button>
                    <button className="primary" onClick={() => handleSaveEdit(tag.id)}>Save</button>
                  </div>
                </div>
              );
            }

            if (isConfirmingDelete) {
              return (
                <div key={tag.id} className="tag-manager-item tag-manager-item--confirming">
                  <div>
                    <strong>Delete #{tag.name}?</strong>
                    <p style={{ fontSize: '14px', marginTop: '4px' }}>
                      This tag is used by {usageCount} notes. 
                      Deleting this tag will remove it from those notes, but your notes will not be deleted.
                    </p>
                  </div>
                  <div className="tag-manager-actions">
                    <button onClick={() => setDeleteConfirmId(null)}>Cancel</button>
                    <button className="danger" onClick={() => onDeleteTag(tag.id)}>Delete</button>
                  </div>
                </div>
              );
            }

            return (
              <div key={tag.id} className="tag-manager-item">
                <div className="tag-manager-info">
                  <span className="tag-manager-name">#{tag.name}</span>
                  <span className="tag-manager-count">{usageCount} notes</span>
                </div>
                <div className="tag-manager-actions-menu">
                  <button onClick={() => handleStartEdit(tag)}>Edit</button>
                  <button onClick={() => setDeleteConfirmId(tag.id)}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TagManagerModal;
