// dikerjakan oleh: [distania_9]
import React from 'react';
import TagSelect from './TagSelect';
import CognitiveLoadSelector from './CognitiveLoadSelector';

class NoteInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      body: '',
      tagIds: [],
      cognitiveLoad: 1,
      errorMessage: '',
    };

    this.onTitleChangeEventHandler = this.onTitleChangeEventHandler.bind(this);
    this.onBodyChangeEventHandler = this.onBodyChangeEventHandler.bind(this);
    this.onBodyKeyDownHandler = this.onBodyKeyDownHandler.bind(this);
    this.onTagsChangeEventHandler = this.onTagsChangeEventHandler.bind(this);
    this.onCognitiveLoadChange = this.onCognitiveLoadChange.bind(this);
    this.onSubmitEventHandler = this.onSubmitEventHandler.bind(this);

    this.textareaRef = React.createRef();
  }

  componentDidMount() {
    this.autoExpandTextarea();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.body !== this.state.body) {
      this.autoExpandTextarea();
    }
  }

  autoExpandTextarea() {
    const textarea = this.textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }

  onTitleChangeEventHandler(event) {
    const title = event.target.value.slice(0, 50);
    this.setState(() => ({
      title,
      errorMessage: '',
    }));
  }

  onBodyChangeEventHandler(event) {
    this.setState(() => ({
      body: event.target.value,
      errorMessage: '',
    }));
  }

  onBodyKeyDownHandler(event) {
    // Ctrl+Enter or Cmd+Enter to submit
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      this.onSubmitEventHandler(event);
      return;
    }

    // Inline #tag conversion on Space or Enter
    if (event.key === ' ' || event.key === 'Enter') {
      const textarea = event.target;
      const cursorPosition = textarea.selectionStart;
      const textBeforeCursor = this.state.body.slice(0, cursorPosition);
      
      const match = textBeforeCursor.match(/(?:^|\s)(#[a-zA-Z0-9_-]+)$/);
      
      if (match) {
        event.preventDefault(); // Swallow the space/enter
        const hashtagWithHash = match[1];
        const tagName = hashtagWithHash.slice(1);
        
        const tag = this.props.onAddTag(tagName);
        if (tag) {
          this.setState(prevState => {
            const newTagIds = prevState.tagIds.includes(tag.id) 
              ? prevState.tagIds 
              : [...prevState.tagIds, tag.id];
            
            const textAfterCursor = prevState.body.slice(cursorPosition);
            const newTextBeforeCursor = textBeforeCursor.slice(0, -hashtagWithHash.length);
            const newBody = newTextBeforeCursor + textAfterCursor;
            
            // Restore cursor position after React updates the DOM
            setTimeout(() => {
              const newPos = newTextBeforeCursor.length;
              textarea.setSelectionRange(newPos, newPos);
            }, 0);

            return { body: newBody, tagIds: newTagIds, errorMessage: '' };
          });
        }
      }
    }
  }

  onTagsChangeEventHandler(newTagIds) {
    this.setState(() => ({
      tagIds: newTagIds,
    }));
  }

  onCognitiveLoadChange(level) {
    this.setState(() => ({
      cognitiveLoad: level,
    }));
  }

  onSubmitEventHandler(event) {
    event.preventDefault();

    if (this.state.body.trim().length < 10) {
      this.setState({ errorMessage: 'Isi catatan minimal 10 karakter.' });
      return;
    }

    // Extract [[Relations]]
    const relationRegex = /\[\[(.*?)\]\]/g;
    const relationTitles = [];
    let match;
    while ((match = relationRegex.exec(this.state.body)) !== null) {
      relationTitles.push(match[1].trim());
    }

    this.props.addNote({
      title: this.state.title,
      body: this.state.body,
      tagIds: this.state.tagIds,
      cognitiveLoad: this.state.cognitiveLoad,
      relationTitles: [...new Set(relationTitles)],
    });

    this.setState(() => ({
      title: '',
      body: '',
      tagIds: [],
      cognitiveLoad: 1,
      errorMessage: '',
    }));
  }

  render() {

    return (
      <div className="note-input" data-testid="note-input">
        <h2>Create Note</h2>

        {this.state.errorMessage && (
          <p
            className="note-input__feedback note-input__feedback--error"
            data-testid="note-input-feedback-error"
            aria-live="polite"
          >
            {this.state.errorMessage}
          </p>
        )}

        <form
          onSubmit={this.onSubmitEventHandler}
          data-testid="note-input-form"
        >
          <input
            className="note-input__title"
            type="text"
            placeholder="This is a title..."
            aria-label="Judul catatan"
            value={this.state.title}
            onChange={this.onTitleChangeEventHandler}
            required
            data-testid="note-input-title-field"
          />
          <textarea
            ref={this.textareaRef}
            className="note-input__body"
            placeholder="Write your note here... (type #tag and press Space)"
            aria-label="Isi catatan"
            value={this.state.body}
            onChange={this.onBodyChangeEventHandler}
            onKeyDown={this.onBodyKeyDownHandler}
            required
            data-testid="note-input-body-field"
            style={{ overflow: 'hidden' }}
          />
          <TagSelect 
            availableTags={this.props.availableTags}
            selectedTagIds={this.state.tagIds}
            onChange={this.onTagsChangeEventHandler}
            onAddTag={this.props.onAddTag}
          />
          <CognitiveLoadSelector 
            value={this.state.cognitiveLoad} 
            onChange={this.onCognitiveLoadChange} 
          />
          <button type="submit" data-testid="note-input-submit-button">
            Create
          </button>
        </form>
      </div>
    );
  }
}

export default NoteInput;
