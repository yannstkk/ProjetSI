package com.backend.projet.elicitation.controller;

import com.backend.projet.auth.security.JwtUtil;
import com.backend.projet.config.JwtConfig;
import com.backend.projet.elicitation.dto.request.ParticipantRequest;
import com.backend.projet.elicitation.dto.response.ParticipantResponse;
import com.backend.projet.elicitation.service.ParticipantService;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ParticipantController.class)
@WithMockUser
public class ParticipantControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    @MockitoBean
    private ParticipantService participantService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private JwtConfig jwtConfig;

    @Test
    public void testGetByInterview() throws Exception {
        List<ParticipantResponse> participants = List.of(
                new ParticipantResponse(1L, "Alice", "Décideur"),
                new ParticipantResponse(2L, "Bob", "Expert technique")
        );

        when(participantService.getByInterview(1L)).thenReturn(participants);

        mockMvc.perform(get("/api/participants/interview/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].nom").value("Alice"))
                .andExpect(jsonPath("$[0].role").value("Décideur"))
                .andExpect(jsonPath("$[1].nom").value("Bob"))
                .andExpect(jsonPath("$[1].role").value("Expert technique"));
    }

    @Test
    public void testGetByInterview_Empty() throws Exception {
        when(participantService.getByInterview(99L)).thenReturn(List.of());

        mockMvc.perform(get("/api/participants/interview/99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    public void testAjouterParticipant() throws Exception {
        ParticipantRequest request = new ParticipantRequest();
        request.setNom("Alice");
        request.setRole("Décideur");

        ParticipantResponse response = new ParticipantResponse(1L, "Alice", "Décideur");

        when(participantService.ajouterParticipant(eq(1L), any(ParticipantRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/participants/interview/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idParticipant").value(1))
                .andExpect(jsonPath("$.nom").value("Alice"))
                .andExpect(jsonPath("$.role").value("Décideur"));
    }

    @Test
    public void testAjouterParticipant_BadRequest() throws Exception {
        ParticipantRequest request = new ParticipantRequest();
        request.setNom("Alice");
        request.setRole("Décideur");

        when(participantService.ajouterParticipant(eq(99L), any(ParticipantRequest.class)))
                .thenThrow(new RuntimeException("Interview non trouvée : 99"));

        mockMvc.perform(post("/api/participants/interview/99")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testDeleteByInterview() throws Exception {
        doNothing().when(participantService).deleteByInterview(1L);

        mockMvc.perform(delete("/api/participants/interview/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    public void testDeleteByInterview_Empty() throws Exception {
        doNothing().when(participantService).deleteByInterview(99L);

        mockMvc.perform(delete("/api/participants/interview/99")
                        .with(csrf()))
                .andExpect(status().isNoContent());
    }
}
