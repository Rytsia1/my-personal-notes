package com.example.backend.service;

import com.example.backend.dto.NoteRequestDTO;
import com.example.backend.model.Note;
import com.example.backend.model.Tag;
import com.example.backend.repository.NoteRepository;
import com.example.backend.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final TagRepository tagRepository;

    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    @Transactional
    public Note createNote(NoteRequestDTO dto) {
        Note note = Note.builder()
                .title(dto.getTitle())
                .body(dto.getBody())
                .cognitiveLoad(dto.getCognitiveLoad())
                .archived(dto.isArchived())
                .build();
        
        return saveOrUpdateNote(note, dto);
    }

    @Transactional
    public Note updateNote(String id, NoteRequestDTO dto) {
        Note note = noteRepository.findById(id).orElseThrow(() -> new RuntimeException("Note not found"));
        
        if (dto.getTitle() != null) note.setTitle(dto.getTitle());
        if (dto.getBody() != null) note.setBody(dto.getBody());
        note.setCognitiveLoad(dto.getCognitiveLoad());
        note.setArchived(dto.isArchived());

        return saveOrUpdateNote(note, dto);
    }

    private Note saveOrUpdateNote(Note note, NoteRequestDTO dto) {
        // Handle Tags
        Set<Tag> tags = new HashSet<>();
        if (dto.getTagIds() != null) {
            for (String tagId : dto.getTagIds()) {
                tagRepository.findById(tagId).ifPresent(tags::add);
            }
        }
        note.setTags(tags);

        // Handle Relations (by Title)
        Set<Note> relations = new HashSet<>();
        if (dto.getRelationTitles() != null) {
            for (String relationTitle : dto.getRelationTitles()) {
                noteRepository.findByTitle(relationTitle).ifPresent(relations::add);
            }
        }
        note.setRelations(relations);

        return noteRepository.save(note);
    }

    @Transactional
    public void deleteNote(String id) {
        noteRepository.findById(id).ifPresent(note -> {
            // Remove this note from other notes' relations before deleting
            List<Note> allNotes = noteRepository.findAll();
            for (Note n : allNotes) {
                if (n.getRelations().contains(note)) {
                    n.getRelations().remove(note);
                    noteRepository.save(n);
                }
            }
            noteRepository.delete(note);
        });
    }
}
