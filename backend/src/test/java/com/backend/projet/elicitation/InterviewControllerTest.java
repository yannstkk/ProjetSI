package com.backend.projet.elicitation;

import com.backend.projet.auth.security.JwtUtil;
import com.backend.projet.config.JwtConfig;
import com.backend.projet.elicitation.controller.InterviewController;
import com.backend.projet.elicitation.dto.request.InterviewRequest;
import com.backend.projet.elicitation.dto.response.InterviewResponse;
import com.backend.projet.elicitation.service.InterviewService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(InterviewController.class)
@WithMockUser
public class InterviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    @MockitoBean
    private InterviewService interviewService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private JwtConfig jwtConfig;

    @Test
    public void testGetByProjet() throws Exception {
        List<InterviewResponse> interviews = List.of(
                new InterviewResponse(
                        1L, 1L,
                        LocalDate.of(2026, 3, 28),
                        LocalDateTime.of(2026, 3, 28, 14, 0),
                        "Interview client",
                        "Dupont",
                        "Recueillir les besoins"
                ),
                new InterviewResponse(
                        2L, 1L,
                        LocalDate.of(2026, 3, 29),
                        LocalDateTime.of(2026, 3, 29, 10, 0),
                        "Interview technique",
                        "Martin",
                        "Valider l'architecture"
                )
        );

        when(interviewService.getByProjet(1L)).thenReturn(interviews);

        mockMvc.perform(get("/api/interviews/projet/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].titre").value("Interview client"))
                .andExpect(jsonPath("$[0].nomInterviewer").value("Dupont"))
                .andExpect(jsonPath("$[1].titre").value("Interview technique"));
    }

    @Test
    public void testGetByProjet_Empty() throws Exception {
        when(interviewService.getByProjet(99L)).thenReturn(List.of());

        mockMvc.perform(get("/api/interviews/projet/99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    public void testCreate() throws Exception {
        InterviewRequest request = new InterviewRequest();
        request.setIdProjet(1L);
        request.setDateInterview(LocalDate.of(2026, 3, 28));
        request.setHeureInterview(LocalDateTime.of(2026, 3, 28, 14, 0));
        request.setTitre("Interview client");
        request.setNomInterviewer("Dupont");
        request.setObjectifs("Recueillir les besoins");

        InterviewResponse response = new InterviewResponse(
                1L, 1L,
                LocalDate.of(2026, 3, 28),
                LocalDateTime.of(2026, 3, 28, 14, 0),
                "Interview client",
                "Dupont",
                "Recueillir les besoins"
        );

        when(interviewService.create(any(InterviewRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/interviews")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.numeroInterview").value(1))
                .andExpect(jsonPath("$.titre").value("Interview client"))
                .andExpect(jsonPath("$.nomInterviewer").value("Dupont"))
                .andExpect(jsonPath("$.idProjet").value(1));
    }

    @Test
    public void testCreate_BadRequest() throws Exception {
        InterviewRequest request = new InterviewRequest();
        request.setIdProjet(99L);
        request.setTitre("Interview client");

        when(interviewService.create(any(InterviewRequest.class)))
                .thenThrow(new RuntimeException("Projet non trouvé : 99"));

        mockMvc.perform(post("/api/interviews")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testUpdate() throws Exception {
        InterviewRequest request = new InterviewRequest();
        request.setDateInterview(LocalDate.of(2026, 4, 1));
        request.setHeureInterview(LocalDateTime.of(2026, 4, 1, 9, 0));
        request.setTitre("Interview modifiée");
        request.setNomInterviewer("Dupont");
        request.setObjectifs("Nouveaux objectifs");

        InterviewResponse response = new InterviewResponse(
                1L, 1L,
                LocalDate.of(2026, 4, 1),
                LocalDateTime.of(2026, 4, 1, 9, 0),
                "Interview modifiée",
                "Dupont",
                "Nouveaux objectifs"
        );

        when(interviewService.update(eq(1L), any(InterviewRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/interviews/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.numeroInterview").value(1))
                .andExpect(jsonPath("$.titre").value("Interview modifiée"));
    }

    @Test
    public void testUpdate_NotFound() throws Exception {
        InterviewRequest request = new InterviewRequest();
        request.setTitre("Interview modifiée");

        when(interviewService.update(eq(99L), any(InterviewRequest.class)))
                .thenThrow(new RuntimeException("Interview non trouvée : 99"));

        mockMvc.perform(put("/api/interviews/99")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }
}
