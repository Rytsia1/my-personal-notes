// dikerjakan oleh: [distania_9]
import React from 'react';

class NoteInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // TODO [Basic] kelola nilai title sebagai controlled input.
      title: '',
      // TODO [Basic] kelola nilai body sebagai controlled textarea.
      body: '',
      errorMessage: '',
    };

    this.onTitleChangeEventHandler = this.onTitleChangeEventHandler.bind(this);
    this.onBodyChangeEventHandler = this.onBodyChangeEventHandler.bind(this);
    this.onSubmitEventHandler = this.onSubmitEventHandler.bind(this);
  }

  onTitleChangeEventHandler(event) {
    // TODO [Basic] update state dengan nilai event.target.value.
    // TODO [Skilled] batasi judul maksimal 50 karakter dan tampilkan peringatan saat sisa karakter < 10.
    const title = event.target.value.slice(0, 50);
    this.setState(() => ({
      title,
      errorMessage: '',
    }));
  }

  onBodyChangeEventHandler(event) {
    // TODO [Basic] update state body agar textarea menjadi controlled component.
    this.setState(() => ({
      body: event.target.value,
      errorMessage: '',
    }));
  }

  onSubmitEventHandler(event) {
    event.preventDefault();

    // TODO [Basic] panggil props.addNote dengan data title & body dari state, lalu reset form.
    // TODO [Advanced] tolak submit ketika body kurang dari 10 karakter dan tampilkan pesan error.
    if (this.state.body.trim().length < 10) {
      this.setState({ errorMessage: 'Isi catatan minimal 10 karakter.' });
      return;
    }

    this.props.addNote({
      title: this.state.title,
      body: this.state.body,
    });

    this.setState(() => ({
      title: '',
      body: '',
      errorMessage: '',
    }));
  }

  render() {
    // TODO [Skilled] hitung sisa karakter jika menerapkan limit 50 karakter.
    const charLimit = 50;
    const remainingChars = charLimit - this.state.title.length;
    const isWarning = remainingChars < 10;
    const charLimitClassName = `note-input__title__char-limit${isWarning ? ' note-input__title__char-limit--warn' : ''}`;

    return (
      <div className="note-input" data-testid="note-input">
        <h2>Buat catatan</h2>

        {/* // TODO [Advanced] tampilkan pesan error menggunakan elemen dengan class note-input__feedback--error. */}
        {this.state.errorMessage && (
          <p
            className="note-input__feedback note-input__feedback--error"
            data-testid="note-input-feedback-error"
          >
            {this.state.errorMessage}
          </p>
        )}

        <form
          onSubmit={this.onSubmitEventHandler}
          data-testid="note-input-form"
        >
          {/* TODO [Skilled] tampilkan sisa karakter secara dinamis ketika limit judul diterapkan */}
          <p
            className={charLimitClassName}
            data-testid="note-input-title-remaining"
          >
            Sisa karakter: {remainingChars}
          </p>
          <input
            className="note-input__title"
            type="text"
            placeholder="Ini adalah judul ..."
            value={this.state.title}
            onChange={this.onTitleChangeEventHandler}
            required
            data-testid="note-input-title-field"
          />
          <textarea
            className="note-input__body"
            placeholder="Tuliskan catatanmu di sini ..."
            value={this.state.body}
            onChange={this.onBodyChangeEventHandler}
            required
            data-testid="note-input-body-field"
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
