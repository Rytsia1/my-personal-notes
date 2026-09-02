import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import NoteInput from './NoteInput';

describe('NoteInput Component', () => {
  it('renders correctly', () => {
    render(<NoteInput addNote={vi.fn()} availableTags={[]} onAddTag={vi.fn()} />);
    
    expect(screen.getByPlaceholderText('This is a title...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Write your note here... (type #tag and press Space)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  });

  it('shows error message if body is less than 10 characters', async () => {
    const user = userEvent.setup();
    const addNoteMock = vi.fn();
    render(<NoteInput addNote={addNoteMock} availableTags={[]} onAddTag={vi.fn()} />);
    
    const titleInput = screen.getByPlaceholderText('This is a title...');
    const bodyInput = screen.getByPlaceholderText('Write your note here... (type #tag and press Space)');
    const submitBtn = screen.getByRole('button', { name: /create/i });

    await user.type(titleInput, 'Valid Title');
    await user.type(bodyInput, 'Short'); // Less than 10 characters
    
    await user.click(submitBtn);

    expect(screen.getByText('Isi catatan minimal 10 karakter.')).toBeInTheDocument();
    expect(addNoteMock).not.toHaveBeenCalled();
  });

  it('calls addNote with correct data on valid submission', async () => {
    const user = userEvent.setup();
    const addNoteMock = vi.fn();
    render(<NoteInput addNote={addNoteMock} availableTags={[]} onAddTag={vi.fn()} />);
    
    const titleInput = screen.getByPlaceholderText('This is a title...');
    const bodyInput = screen.getByPlaceholderText('Write your note here... (type #tag and press Space)');
    const submitBtn = screen.getByRole('button', { name: /create/i });

    await user.type(titleInput, 'Valid Title');
    await user.type(bodyInput, 'This body has more than ten characters.');
    
    await user.click(submitBtn);

    expect(addNoteMock).toHaveBeenCalledTimes(1);
    expect(addNoteMock).toHaveBeenCalledWith({
      title: 'Valid Title',
      body: 'This body has more than ten characters.',
      tagIds: [],
      cognitiveLoad: 1,
      relationTitles: [],
    });
  });

  it('calls addNote via Ctrl+Enter shortcut', async () => {
    const user = userEvent.setup();
    const addNoteMock = vi.fn();
    render(<NoteInput addNote={addNoteMock} availableTags={[]} onAddTag={vi.fn()} />);
    
    const titleInput = screen.getByPlaceholderText('This is a title...');
    const bodyInput = screen.getByPlaceholderText('Write your note here... (type #tag and press Space)');

    await user.type(titleInput, 'Shortcut Title');
    await user.type(bodyInput, 'Submitting via shortcut is fast.');
    
    // Simulate Ctrl+Enter on the body input
    await user.keyboard('{Control>}{Enter}{/Control}');

    expect(addNoteMock).toHaveBeenCalledTimes(1);
  });

  it('processes inline tags correctly when Space is pressed', async () => {
    const user = userEvent.setup();
    const onAddTagMock = vi.fn().mockReturnValue({ id: 'tag-1', name: 'react' });
    const addNoteMock = vi.fn();
    
    render(<NoteInput addNote={addNoteMock} availableTags={[]} onAddTag={onAddTagMock} />);
    
    const bodyInput = screen.getByPlaceholderText('Write your note here... (type #tag and press Space)');
    
    // Type a hashtag and press space
    await user.type(bodyInput, 'Learning #react ');

    // The tag should have been extracted and added
    expect(onAddTagMock).toHaveBeenCalledWith('react');
    
    // The text should have the hashtag removed and space swallowed
    expect(bodyInput.value).toBe('Learning ');
  });
});
