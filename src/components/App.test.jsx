import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('My Personal Notes App', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('user can create a note', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Fill the title
    const titleInput = screen.getByPlaceholderText('This is a title...');
    await user.type(titleInput, 'Test Note Title');
    
    // Fill the body
    const bodyInput = screen.getByPlaceholderText('Write your note here... (type #tag and press Space)');
    await user.type(bodyInput, 'This is the body of the test note.');
    
    // Submit
    const submitBtn = screen.getByRole('button', { name: /create/i });
    await user.click(submitBtn);
    
    // Note should appear in active notes list
    expect(screen.getByText('Test Note Title')).toBeInTheDocument();
    expect(screen.getByText('This is the body of the test note.')).toBeInTheDocument();
  });

  test('user can delete a note', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // By default, the app has initial mock data. Let's find "Babel"
    const babelNoteTitles = screen.getAllByText('Babel');
    expect(babelNoteTitles.length).toBeGreaterThan(0);
    
    // Find the closest note item to click its delete button
    const noteItem = babelNoteTitles[0].closest('.note-item');
    const deleteBtn = noteItem.querySelector('.note-item__delete-button');
    
    await user.click(deleteBtn);
    
    // "Babel" should disappear
    expect(screen.queryByText('Babel')).not.toBeInTheDocument();
    
    // Toast should appear
    expect(screen.getByText('Note deleted.')).toBeInTheDocument();
  });

  test('user can archive a note and unarchive it', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Find a default active note
    const functionalComponentTitle = screen.getByText('Functional Component');
    const noteItem = functionalComponentTitle.closest('.note-item');
    const archiveBtn = noteItem.querySelector('.note-item__archive-button');
    
    expect(archiveBtn).toHaveTextContent('Archive');
    await user.click(archiveBtn);
    
    // Filter by 'active' to ensure it's gone from active list.
    const statusSelect = screen.getByLabelText(/status:/i);
    await user.selectOptions(statusSelect, 'active');
    
    expect(screen.queryByText('Functional Component')).not.toBeInTheDocument();
    
    // Filter by 'archived' to ensure it's there
    await user.selectOptions(statusSelect, 'archived');
    const archivedNoteTitle = screen.getByText('Functional Component');
    expect(archivedNoteTitle).toBeInTheDocument();
    
    // Unarchive it
    const archivedItem = archivedNoteTitle.closest('.note-item');
    const unarchiveBtn = archivedItem.querySelector('.note-item__archive-button');
    expect(unarchiveBtn).toHaveTextContent('Unarchive');
    await user.click(unarchiveBtn);
    
    // Should be gone from archived list
    expect(screen.queryByText('Functional Component')).not.toBeInTheDocument();
  });

  test('search filters notes', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const searchInput = screen.getByPlaceholderText('Search notes...');
    await user.type(searchInput, 'Babel');
    
    // Babel should be there
    // Because NoteSearch now uses a 300ms debounce, we must wait for the filter to apply
    await waitFor(() => {
      const babelMatches = screen.getAllByText(/Babel/i);
      expect(babelMatches.length).toBeGreaterThan(0);
      // Others shouldn't
      expect(screen.queryByText('Functional Component')).not.toBeInTheDocument();
    });
  });

  test('archived notes do not appear in active list when status is active', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const statusSelect = screen.getByLabelText(/status:/i);
    await user.selectOptions(statusSelect, 'active');
    
    // Active section should exist
    expect(screen.getByRole('heading', { name: 'Active Notes' })).toBeInTheDocument();
    // Archived section should NOT exist
    expect(screen.queryByRole('heading', { name: 'Archive' })).not.toBeInTheDocument();
  });

  test('notes persist after reload', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    
    // Add a new note
    await user.type(screen.getByPlaceholderText('This is a title...'), 'Persistent Note');
    await user.type(screen.getByPlaceholderText('Write your note here... (type #tag and press Space)'), 'Will it survive a refresh?');
    await user.click(screen.getByRole('button', { name: /create/i }));
    
    expect(screen.getByText('Persistent Note')).toBeInTheDocument();
    
    // Unmount to simulate reload
    unmount();
    
    // Re-render
    render(<App />);
    expect(screen.getByText('Persistent Note')).toBeInTheDocument();
  });
});
