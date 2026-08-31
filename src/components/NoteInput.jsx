// dikerjakan oleh: [distania_9]
import React from 'react';

class NoteInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      body: '',
      tagsString: '',
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

  onTagsChangeEventHandler(event) {
    this.setState(() => ({
      tagsString: event.target.value,
    }));
  }

  onSubmitEventHandler(event) {
    event.preventDefault();

    if (this.state.body.trim().length < 10) {
      this.setState({ errorMessage: 'Isi catatan minimal 10 karakter.' });
      return;
    }

    const tags = this.state.tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    this.props.addNote({
      title: this.state.title,
      body: this.state.body,
      tags,
    });

    this.setState(() => ({
      title: '',
      body: '',
      tagsString: '',
      errorMessage: '',
    }));
  }

  render() {
    const charLimit = 50;
    const remainingChars = charLimit - this.state.title.length;
    const isWarning = remainingChars < 10;
    const charLimitClassName = `note-input__title__char-limit${isWarning ? ' note-input__title__char-limit--warn' : ''}`;

    return (
      <div className="note-input" data-testid="note-input">
        <h2>Buat catatan</h2>

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
            Sisa karakter: {remainingChars}
          </p>
          <input
            className="note-input__title"
            type="text"
            placeholder="Ini adalah judul ..."
            aria-label="Judul catatan"
            value={this.state.title}
            onChange={this.onTitleChangeEventHandler}
            required
            data-testid="note-input-title-field"
          />
          <textarea
            className="note-input__body"
            placeholder="Tuliskan catatanmu di sini ..."
            aria-label="Isi catatan"
            value={this.state.body}
            onChange={this.onBodyChangeEventHandler}
            required
            data-testid="note-input-body-field"
          />
          <input
            className="note-input__tags"
            type="text"
            placeholder="Tags (pisahkan dengan koma, cth: Programming, Web)"
            aria-label="Tags catatan"
            value={this.state.tagsString}
            onChange={this.onTagsChangeEventHandler}
            data-testid="note-input-tags-field"
          />
          <button type="submit" data-testid="note-input-submit-button">
            Buat
          </button>
        </form>
      </div>
    );
  }
}

export default NoteInput;
