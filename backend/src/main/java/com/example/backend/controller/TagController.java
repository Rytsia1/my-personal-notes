package com.example.backend.controller;

import com.example.backend.model.Tag;
import com.example.backend.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class TagController {

    private final TagRepository tagRepository;

    @GetMapping
    public ResponseEntity<List<Tag>> getAllTags() {
        return ResponseEntity.ok(tagRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Tag> createTag(@RequestBody Tag tagRequest) {
        if (tagRequest.getName() == null || tagRequest.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Return existing if found
        var existing = tagRepository.findByNameIgnoreCase(tagRequest.getName().trim());
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get());
        }
        
        Tag newTag = Tag.builder().name(tagRequest.getName().trim()).build();
        return ResponseEntity.ok(tagRepository.save(newTag));
    }
}
