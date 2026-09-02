package com.example.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class NoteRequestDTO {
    private String title;
    private String body;
    private int cognitiveLoad = 1;
    private boolean archived = false;
    private List<String> tagIds;
    private List<String> relationTitles;
}
