package com.backend.projet.elicitation.controller;

import com.backend.projet.auth.security.JwtUtil;
import com.backend.projet.config.JwtConfig;
import com.backend.projet.elicitation.dto.request.NotesRequest;
import com.backend.projet.elicitation.dto.response.NotesResponse;
import com.backend.projet.elicitation.service.NotesService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(NotesController.class)
@WithMockUser
public class NotesControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    @MockitoBean
    private NotesService notesService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private JwtConfig jwtConfig;

    @Test
    public void testGetAllNotes() throws Exception {
        List<NotesResponse> notes = List.of(
                new NotesResponse(1L, 1L, "Note 1"),
                new NotesResponse(2L, 1L, "Note 2"),
                new NotesResponse(3L, 2L, "Note 3")
        );

        when(notesService.getAllNotes()).thenReturn(notes);

        mockMvc.perform(get("/api/notes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3))
                .andExpect(jsonPath("$[0].contenu").value("Note 1"))
                .andExpect(jsonPath("$[1].contenu").value("Note 2"))
                .andExpect(jsonPath("$[2].numeroInterview").value(2));
    }

    @Test
    public void testGetByInterview() throws Exception {
        List<NotesResponse> notes = List.of(
                new NotesResponse(1L, 1L, "Note 1"),
                new NotesResponse(2L, 1L, "Note 2")
        );

        when(notesService.getNotesByInterview(1L)).thenReturn(notes);

        mockMvc.perform(get("/api/notes/interview/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].numeroInterview").value(1))
                .andExpect(jsonPath("$[1].contenu").value("Note 2"));
    }

    @Test
    public void testGetByInterview_Empty() throws Exception {
        when(notesService.getNotesByInterview(99L)).thenReturn(List.of());

        mockMvc.perform(get("/api/notes/interview/99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    public void testAjouterNote() throws Exception {
        NotesRequest request = new NotesRequest();
        request.setNumeroInterview(1L);
        request.setContenu("Nouvelle note");

        NotesResponse response = new NotesResponse(1L, 1L, "Nouvelle note");

        when(notesService.ajouterNote(any(NotesRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/notes")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.numeroNotes").value(1))
                .andExpect(jsonPath("$.numeroInterview").value(1))
                .andExpect(jsonPath("$.contenu").value("Nouvelle note"));
    }

    @Test
    public void testDeleteByInterview() throws Exception {
        doNothing().when(notesService).deleteByInterview(1L);

        mockMvc.perform(delete("/api/notes/interview/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    public void testDeleteByInterview_Empty() throws Exception {
        doNothing().when(notesService).deleteByInterview(99L);

        mockMvc.perform(delete("/api/notes/interview/99")
                        .with(csrf()))
                .andExpect(status().isNoContent());
    }
}
