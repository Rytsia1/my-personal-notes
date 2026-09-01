import React from 'react';

function NoteFilter({ tags, selectedTag, onSelectTag, sortBy, onSortChange, statusFilter, onStatusChange }) {
  return (
    <div className="note-filter" data-testid="note-filter" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label htmlFor="status-filter" style={{ fontWeight: '600' }}>Status:</label>
          <select 
            id="status-filter"
            className="note-filter__select"
            value={statusFilter} 
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label htmlFor="sort-filter" style={{ fontWeight: '600' }}>Sort by:</label>
          <select 
            id="sort-filter"
            className="note-filter__select"
            value={sortBy} 
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
          </select>
        </div>
      </div>

      {tags && tags.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
          <button
            onClick={() => onSelectTag('All')}
            className={`note-filter__tag ${selectedTag === 'All' ? 'note-filter__tag--selected' : ''}`}
          >
            All Tags
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => onSelectTag(tag.id)}
              className={`note-filter__tag ${selectedTag === tag.id ? 'note-filter__tag--selected' : ''}`}
            >
              #{tag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default NoteFilter;
