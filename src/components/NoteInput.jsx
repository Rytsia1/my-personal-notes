// dikerjakan oleh: [distania_9]
import React from 'react';
import TagSelect from './TagSelect';

class NoteInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      body: '',
      tagIds: [],
      errorMessage: '',
    };

    this.onTitleChangeEventHandler = this.onTitleChangeEventHandler.bind(this);
    this.onBodyChangeEventHandler = this.onBodyChangeEventHandler.bind(this);
    this.onTagsChangeEventHandler = this.onTagsChangeEventHandler.bind(this);
    this.onSubmitEventHandler = this.onSubmitEventHandler.bind(this);
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

  onTagsChangeEventHandler(newTagIds) {
    this.setState(() => ({
      tagIds: newTagIds,
    }));
  }

  onSubmitEventHandler(event) {
    event.preventDefault();

    if (this.state.body.trim().length < 10) {
      this.setState({ errorMessage: 'Isi catatan minimal 10 karakter.' });
      return;
    }

    this.props.addNote({
      title: this.state.title,
      body: this.state.body,
      tagIds: this.state.tagIds,
    });

    this.setState(() => ({
      title: '',
      body: '',
      tagIds: [],
      errorMessage: '',
    }));
  }

  render() {
    const charLimit = 50;
    const remainingChars = charLimit - this.state.title.length;
    const isWarning = remainingChars < 10 && remainingChars > 0;
    const isError = remainingChars === 0;
    
    let charLimitClassName = 'note-input__title__char-limit';
    if (isError) {
      charLimitClassName += ' note-input__title__char-limit--error';
    } else if (isWarning) {
      charLimitClassName += ' note-input__title__char-limit--warn';
    }

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
          <p
            className={charLimitClassName}
            data-testid="note-input-title-remaining"
            aria-live="polite"
          >
            Remaining characters: {remainingChars}
          </p>
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
            className="note-input__body"
            placeholder="Write your note here..."
            aria-label="Isi catatan"
            value={this.state.body}
            onChange={this.onBodyChangeEventHandler}
            required
            data-testid="note-input-body-field"
          />
          <TagSelect 
            availableTags={this.props.availableTags}
            selectedTagIds={this.state.tagIds}
            onChange={this.onTagsChangeEventHandler}
            onAddTag={this.props.onAddTag}
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
