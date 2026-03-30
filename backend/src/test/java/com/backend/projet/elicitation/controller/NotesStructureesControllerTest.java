package com.backend.projet.elicitation.controller;

import com.backend.projet.auth.security.JwtUtil;
import com.backend.projet.config.JwtConfig;
import com.backend.projet.elicitation.controller.NotesStructureesController;
import com.backend.projet.elicitation.dto.request.NotesStructureesRequest;
import com.backend.projet.elicitation.dto.response.NotesStructureesResponse;
import com.backend.projet.elicitation.service.NotesStructureesService;
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

@WebMvcTest(NotesStructureesController.class)
@WithMockUser
public class NotesStructureesControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    @MockitoBean
    private NotesStructureesService notesStructureesService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private JwtConfig jwtConfig;

    @Test
    public void testGetByInterview() throws Exception {
        List<NotesStructureesResponse> notes = List.of(
                new NotesStructureesResponse(1L, 1L, "BESOIN", "Le client veut X"),
                new NotesStructureesResponse(2L, 1L, "CONTRAINTE", "Délai serré")
        );

        when(notesStructureesService.getByInterview(1L)).thenReturn(notes);

        mockMvc.perform(get("/api/notes-structurees/interview/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].categorie").value("BESOIN"))
                .andExpect(jsonPath("$[0].contenu").value("Le client veut X"))
                .andExpect(jsonPath("$[1].categorie").value("CONTRAINTE"))
                .andExpect(jsonPath("$[1].contenu").value("Délai serré"));
    }

    @Test
    public void testGetByInterview_Empty() throws Exception {
        when(notesStructureesService.getByInterview(99L)).thenReturn(List.of());

        mockMvc.perform(get("/api/notes-structurees/interview/99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    public void testCreer() throws Exception {
        NotesStructureesRequest request = new NotesStructureesRequest();
        request.setNumeroInterview(1L);
        request.setCategorie("BESOIN");
        request.setContenu("Le client veut X");

        NotesStructureesResponse response = new NotesStructureesResponse(
                1L, 1L, "BESOIN", "Le client veut X"
        );

        when(notesStructureesService.creer(any(NotesStructureesRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/notes-structurees")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idNotesStructurees").value(1))
                .andExpect(jsonPath("$.numeroInterview").value(1))
                .andExpect(jsonPath("$.categorie").value("BESOIN"))
                .andExpect(jsonPath("$.contenu").value("Le client veut X"));
    }

    @Test
    public void testCreer_BadRequest() throws Exception {
        NotesStructureesRequest request = new NotesStructureesRequest();
        request.setNumeroInterview(99L);
        request.setCategorie("BESOIN");
        request.setContenu("Le client veut X");

        when(notesStructureesService.creer(any(NotesStructureesRequest.class)))
                .thenThrow(new RuntimeException("Interview non trouvée : 99"));

        mockMvc.perform(post("/api/notes-structurees")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testDeleteByInterview() throws Exception {
        doNothing().when(notesStructureesService).deleteByInterview(1L);

        mockMvc.perform(delete("/api/notes-structurees/interview/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    public void testDeleteByInterview_Empty() throws Exception {
        doNothing().when(notesStructureesService).deleteByInterview(99L);

        mockMvc.perform(delete("/api/notes-structurees/interview/99")
                        .with(csrf()))
                .andExpect(status().isNoContent());
    }
}
