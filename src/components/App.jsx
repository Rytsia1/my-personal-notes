// dikerjakan oleh: [distania_9]
import React from 'react';
import useNotes from '../hooks/useNotes';
import useFilters from '../hooks/useFilters';
import useTheme from '../hooks/useTheme';
import { filterNotes, sortNotes, getActiveNotes, getArchivedNotes, getAllTags } from '../utils/noteUtils';
import NoteInput from './NoteInput';
import NotesList from './NotesList';
import NoteSearch from './NoteSearch';
import NoteFilter from './NoteFilter';
import Toast from './Toast';

const App = () => {
  const { 
    notes, 
    addNote, editNote, deleteNote, toggleArchive,
    lastDeletedNote, undoDelete
  } = useNotes();
  const {
    searchKeyword, setSearchKeyword, 
    selectedTag, setSelectedTag, 
    sortBy, setSortBy,
    statusFilter, setStatusFilter
  } = useFilters();
  const { theme, toggleTheme } = useTheme();

  const onSearchHandler = (keyword) => {
    setSearchKeyword(keyword);
  };

  const allTags = getAllTags(notes);
  const filteredNotes = filterNotes(notes, searchKeyword, selectedTag);
  const sortedNotes = sortNotes(filteredNotes, sortBy);
  
  const activeNotes = getActiveNotes(sortedNotes);
  const archivedNotes = getArchivedNotes(sortedNotes);

  const showActive = statusFilter === 'all' || statusFilter === 'active';
  const showArchived = statusFilter === 'all' || statusFilter === 'archived';

  const activeEmptyMessage = searchKeyword
    ? `No notes found for "${searchKeyword}".`
    : 'No notes yet. Create your first note to get started.';

  const archivedEmptyMessage = searchKeyword
    ? `No archived notes found for "${searchKeyword}".`
    : 'No archived notes.';

  return (
    <div className="note-app" data-testid="note-app">
      <div className="note-app__header" data-testid="note-app-header">
        <h1>Notes</h1>
        <button 
          onClick={toggleTheme} 
          className="theme-toggle-button"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? '🌙' : '☀'}
        </button>
        <NoteSearch
          searchKeyword={searchKeyword}
          onSearch={onSearchHandler}
        />
      </div>
      <div className="note-app__body" data-testid="note-app-body">
        <NoteFilter 
          tags={allTags} 
          selectedTag={selectedTag} 
          onSelectTag={setSelectedTag}
          sortBy={sortBy}
          onSortChange={setSortBy}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
        <NoteInput addNote={addNote} />
        
        {showActive && (
          <section
            aria-labelledby="active-notes-title"
            data-testid="active-notes-section"
          >
            <h2 id="active-notes-title">Active Notes</h2>
            <NotesList
              notes={activeNotes}
              onEdit={editNote}
              onDelete={deleteNote}
              onArchive={toggleArchive}
              searchKeyword={searchKeyword}
              emptyMessage={activeEmptyMessage}
              dataTestId="active-notes-list"
            />
          </section>
        )}
        
        {showArchived && (
          <section
            aria-labelledby="archived-notes-title"
            data-testid="archived-notes-section"
          >
            <h2 id="archived-notes-title">Archive</h2>
            <NotesList
              notes={archivedNotes}
              onEdit={editNote}
              onDelete={deleteNote}
              onArchive={toggleArchive}
              searchKeyword={searchKeyword}
              emptyMessage={archivedEmptyMessage}
              dataTestId="archived-notes-list"
            />
          </section>
        )}
      </div>

      {lastDeletedNote && (
        <Toast 
          message="Note deleted." 
          actionLabel="Undo" 
          onAction={undoDelete} 
        />
      )}
    </div>
  );
};

export default App;
