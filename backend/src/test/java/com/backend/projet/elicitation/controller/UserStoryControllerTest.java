package com.backend.projet.elicitation.controller;

import com.backend.projet.auth.security.JwtUtil;
import com.backend.projet.config.JwtConfig;
import com.backend.projet.elicitation.dto.request.UserStoryRequest;
import com.backend.projet.elicitation.dto.response.UserStoryResponse;
import com.backend.projet.elicitation.service.UserStoryService;
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
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserStoryController.class)
@WithMockUser
public class UserStoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    @MockitoBean
    private UserStoryService userStoryService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private JwtConfig jwtConfig;

    @Test
    public void testGetByProjet() throws Exception {
        List<UserStoryResponse> userstories = List.of(
                new UserStoryResponse(1L, "US-001", "me connecter",
                        "accéder à mes projets", "HIGH",
                        "Email + mdp", "Login -> Accueil",
                        "TAIGA-1", 1L, null),
                new UserStoryResponse(2L, "US-002", "voir mes projets",
                        "choisir sur lequel travailler", "MEDIUM",
                        "Liste triée par date", null,
                        "TAIGA-2", 1L, 1L)
        );

        when(userStoryService.getByProjet(1L)).thenReturn(userstories);

        mockMvc.perform(get("/api/userstories/projet/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].ref").value("US-001"))
                .andExpect(jsonPath("$[0].veux").value("me connecter"))
                .andExpect(jsonPath("$[0].priorite").value("HIGH"))
                .andExpect(jsonPath("$[1].ref").value("US-002"))
                .andExpect(jsonPath("$[1].idActeur").value(1));
    }

    @Test
    public void testGetByProjet_Empty() throws Exception {
        when(userStoryService.getByProjet(99L)).thenReturn(List.of());

        mockMvc.perform(get("/api/userstories/projet/99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    public void testAdd() throws Exception {
        UserStoryRequest request = new UserStoryRequest();
        request.setIdProjet(1L);
        request.setRef("US-001");
        request.setVeux("me connecter");
        request.setAfin("accéder à mes projets");
        request.setPriorite("HIGH");
        request.setCriteres("Email + mdp");
        request.setFlux("Login -> Accueil");
        request.setTaigaRef("TAIGA-1");
        request.setIdActeur(null);

        UserStoryResponse response = new UserStoryResponse(
                1L, "US-001", "me connecter",
                "accéder à mes projets", "HIGH",
                "Email + mdp", "Login -> Accueil",
                "TAIGA-1", 1L, null
        );

        when(userStoryService.add(any(UserStoryRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/userstories")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idUs").value(1))
                .andExpect(jsonPath("$.ref").value("US-001"))
                .andExpect(jsonPath("$.veux").value("me connecter"))
                .andExpect(jsonPath("$.priorite").value("HIGH"))
                .andExpect(jsonPath("$.idProjet").value(1));
    }

    @Test
    public void testDelete() throws Exception {
        doNothing().when(userStoryService).delete(1L);

        mockMvc.perform(delete("/api/userstories/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    public void testDelete_NotFound() throws Exception {
        doThrow(new com.backend.projet.projet.exception.ResourceNotFoundException(
                "User Story non trouvée : 99"))
                .when(userStoryService).delete(eq(99L));

        mockMvc.perform(delete("/api/userstories/99")
                        .with(csrf()))
                .andExpect(status().isNotFound());
    }
}
