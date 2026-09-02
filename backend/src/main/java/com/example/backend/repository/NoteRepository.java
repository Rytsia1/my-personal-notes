package com.example.backend.repository;

import com.example.backend.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, String> {
    Optional<Note> findByTitle(String title);
}
