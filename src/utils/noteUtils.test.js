import { describe, it, expect } from 'vitest';
import {
  showFormattedDate,
  getAllTags,
  filterNotes,
  sortNotes,
  getActiveNotes,
  getArchivedNotes
} from './noteUtils';

describe('noteUtils pure functions', () => {
  const mockNotes = [
    {
      id: 1,
      title: 'React Hooks',
      body: 'Hooks are a new addition in React 16.8.',
      createdAt: '2023-01-01T10:00:00.000Z',
      archived: false,
      tags: ['React', 'Frontend']
    },
    {
      id: 2,
      title: 'NodeJS Backend',
      body: 'Node.js is an open-source, cross-platform JavaScript runtime environment.',
      createdAt: '2023-01-05T10:00:00.000Z',
      archived: true,
      tags: ['Node', 'Backend']
    },
    {
      id: 3,
      title: 'React Testing Library',
      body: 'Simple and complete testing utilities that encourage good testing practices.',
      createdAt: '2023-01-03T10:00:00.000Z',
      archived: false,
      tags: ['React', 'Testing']
    }
  ];

  describe('showFormattedDate', () => {
    it('should format date correctly according to en-US locale', () => {
      const dateStr = '2023-01-01T10:00:00.000Z';
      // Format might vary slightly by Node version or timezone, but it generally follows the pattern
      const formatted = showFormattedDate(dateStr);
      expect(typeof formatted).toBe('string');
      expect(formatted).toContain('2023');
    });
  });

  describe('getAllTags', () => {
    it('should extract and sort all unique tags from notes', () => {
      const tags = getAllTags(mockNotes);
      expect(tags).toEqual(['Backend', 'Frontend', 'Node', 'React', 'Testing']);
    });
    
    it('should return empty array if no tags exist', () => {
      expect(getAllTags([{ id: 1 }])).toEqual([]);
    });
  });

  describe('filterNotes', () => {
    it('should filter notes by selected tag', () => {
      const filtered = filterNotes(mockNotes, '', 'React');
      expect(filtered).toHaveLength(2);
      expect(filtered[0].title).toBe('React Hooks');
    });

    it('should filter notes by keyword (case insensitive)', () => {
      const filtered = filterNotes(mockNotes, 'NODEJS', 'All');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('NodeJS Backend');
    });

    it('should filter notes by keyword in body', () => {
      const filtered = filterNotes(mockNotes, 'runtime environment', 'All');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('NodeJS Backend');
    });

    it('should filter notes by keyword in tags', () => {
      const filtered = filterNotes(mockNotes, 'frontend', 'All');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].tags).toContain('Frontend');
    });

    it('should filter by both keyword and tag', () => {
      // "React" tag but search keyword "Testing"
      const filtered = filterNotes(mockNotes, 'testing', 'React');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('React Testing Library');
    });
  });

  describe('sortNotes', () => {
    it('should sort notes by newest first (default)', () => {
      const sorted = sortNotes(mockNotes, 'newest');
      expect(sorted[0].id).toBe(2); // Jan 5
      expect(sorted[2].id).toBe(1); // Jan 1
    });

    it('should sort notes by oldest first', () => {
      const sorted = sortNotes(mockNotes, 'oldest');
      expect(sorted[0].id).toBe(1); // Jan 1
      expect(sorted[2].id).toBe(2); // Jan 5
    });

    it('should sort notes by title A-Z', () => {
      const sorted = sortNotes(mockNotes, 'title-asc');
      expect(sorted[0].title).toBe('NodeJS Backend');
      expect(sorted[1].title).toBe('React Hooks');
    });

    it('should sort notes by title Z-A', () => {
      const sorted = sortNotes(mockNotes, 'title-desc');
      expect(sorted[0].title).toBe('React Testing Library');
      expect(sorted[2].title).toBe('NodeJS Backend');
    });
  });

  describe('getActiveNotes', () => {
    it('should return only unarchived notes', () => {
      const active = getActiveNotes(mockNotes);
      expect(active).toHaveLength(2);
      expect(active.every(n => !n.archived)).toBe(true);
    });
  });

  describe('getArchivedNotes', () => {
    it('should return only archived notes', () => {
      const archived = getArchivedNotes(mockNotes);
      expect(archived).toHaveLength(1);
      expect(archived.every(n => n.archived)).toBe(true);
    });
  });
});
