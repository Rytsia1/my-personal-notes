import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotesList from './NotesList';

// Mock NoteItem to isolate NotesList testing
vi.mock('./NoteItem', () => ({
  default: ({ note, onEdit, onDelete, onArchive }) => (
    <div data-testid="mock-note-item">
      <span>{note.title}</span>
      <button onClick={() => onEdit(note.id, {})}>Edit</button>
      <button onClick={() => onDelete(note.id)}>Delete</button>
      <button onClick={() => onArchive(note.id)}>Archive</button>
    </div>
  )
}));

describe('NotesList Component', () => {
  it('renders empty message when notes array is empty', () => {
    render(<NotesList notes={[]} emptyMessage="Custom empty message" />);
    
    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
  });

  it('renders default empty message when notes array is empty and no message provided', () => {
    render(<NotesList notes={[]} />);
    
    expect(screen.getByText('No notes')).toBeInTheDocument();
  });

  it('groups notes by Month and Year correctly', () => {
    const dummyNotes = [
      { id: '1', title: 'Note 1', createdAt: '2025-04-01T10:00:00.000Z' },
      { id: '2', title: 'Note 2', createdAt: '2025-04-15T10:00:00.000Z' },
      { id: '3', title: 'Note 3', createdAt: '2025-05-10T10:00:00.000Z' },
    ];

    render(<NotesList notes={dummyNotes} />);
    
    // Check if the group headers are rendered
    expect(screen.getByText('April 2025')).toBeInTheDocument();
    expect(screen.getByText('May 2025')).toBeInTheDocument();

    // Check if counts are correct
    const aprilGroup = screen.getByTestId('April 2025-group');
    expect(aprilGroup).toHaveTextContent('2 notes');
    
    const mayGroup = screen.getByTestId('May 2025-group');
    expect(mayGroup).toHaveTextContent('1 notes');
    
    // Check if NoteItems are rendered
    expect(screen.getByText('Note 1')).toBeInTheDocument();
    expect(screen.getByText('Note 2')).toBeInTheDocument();
    expect(screen.getByText('Note 3')).toBeInTheDocument();
  });

  it('passes handlers down to NoteItem', () => {
    const onEditMock = vi.fn();
    const onDeleteMock = vi.fn();
    const onArchiveMock = vi.fn();

    const dummyNotes = [
      { id: '1', title: 'Interactive Note', createdAt: '2025-04-01T10:00:00.000Z' },
    ];

    render(
      <NotesList 
        notes={dummyNotes} 
        onEdit={onEditMock}
        onDelete={onDeleteMock}
        onArchive={onArchiveMock}
      />
    );

    screen.getByText('Edit').click();
    expect(onEditMock).toHaveBeenCalledWith('1', {});

    screen.getByText('Delete').click();
    expect(onDeleteMock).toHaveBeenCalledWith('1');

    screen.getByText('Archive').click();
    expect(onArchiveMock).toHaveBeenCalledWith('1');
  });
});
