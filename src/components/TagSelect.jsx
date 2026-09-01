import React, { useState, useRef, useEffect } from 'react';

const TagSelect = ({ availableTags, selectedTagIds, onChange, onAddTag }) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleSelectTag = (tag) => {
    if (!selectedTagIds.includes(tag.id)) {
      onChange([...selectedTagIds, tag.id]);
    }
    setInputValue('');
    setIsOpen(false);
  };

  const handleCreateTag = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTag = onAddTag(inputValue);
    if (newTag) {
      if (!selectedTagIds.includes(newTag.id)) {
        onChange([...selectedTagIds, newTag.id]);
      }
    }
    setInputValue('');
    setIsOpen(false);
  };

  const handleRemoveTag = (tagIdToRemove) => {
    onChange(selectedTagIds.filter(id => id !== tagIdToRemove));
  };

  const exactMatch = availableTags.find(
    tag => tag.name.toLowerCase() === inputValue.trim().toLowerCase()
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Mencegah form utama tersubmit
      if (!inputValue.trim()) return;
      
      if (exactMatch) {
        handleSelectTag(exactMatch);
      } else {
        handleCreateTag(e);
      }
    }
  };

  const filteredTags = availableTags.filter(tag => 
    tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
    !selectedTagIds.includes(tag.id)
  );

  return (
    <div className="tag-select" ref={dropdownRef}>
      <div className="tag-select__pills">
        {selectedTagIds.map(id => {
          const tag = availableTags.find(t => t.id === id);
          if (!tag) return null;
          return (
            <span key={tag.id} className="tag-select__pill">
              #{tag.name}
              <button 
                type="button" 
                onClick={() => handleRemoveTag(tag.id)}
                aria-label={`Remove ${tag.name} tag`}
              >
                &times;
              </button>
            </span>
          );
        })}
      </div>
      <div className="tag-select__input-container">
        <input
          type="text"
          className="tag-select__input"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder="Search or create tag..."
          aria-label="Tags"
        />
        {isOpen && (inputValue || filteredTags.length > 0) && (
          <div className="tag-select__dropdown">
            {filteredTags.map(tag => (
              <div 
                key={tag.id} 
                className="tag-select__option"
                onClick={() => handleSelectTag(tag)}
              >
                {tag.name}
              </div>
            ))}
            {inputValue.trim() && !exactMatch && (
              <div 
                className="tag-select__option tag-select__option--create"
                onClick={handleCreateTag}
              >
                Create "{inputValue.trim()}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagSelect;
