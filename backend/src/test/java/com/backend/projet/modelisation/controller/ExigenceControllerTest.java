package com.backend.projet.modelisation.controller;

import com.backend.projet.auth.security.JwtUtil;
import com.backend.projet.config.JwtConfig;
import com.backend.projet.elicitation.entity.UserStory;
import com.backend.projet.elicitation.repository.UserStoryRepository;
import com.backend.projet.mistral.service.MistralService;
import com.backend.projet.modelisation.dto.request.ExigenceRequest;
import com.backend.projet.modelisation.dto.response.ExigenceResponse;
import com.backend.projet.modelisation.service.ExigenceService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test du contrôleur des exigences.
 */
@WebMvcTest(ExigenceController.class)
@WithMockUser
public class ExigenceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    @MockitoBean
    private MistralService mistralService;

    @MockitoBean
    private ExigenceService exigenceService;

    @MockitoBean
    private UserStoryRepository userStoryRepository;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private JwtConfig jwtConfig;

    /**
     * Test de la génération via Mistral.
     * Vérifie que si le backlog est vide, on renvoie une liste vide immédiatement.
     */
    @Test
    void testGenerer_BacklogVide() throws Exception {
        when(userStoryRepository.findByProjetIdProjet(41L)).thenReturn(List.of());

        mockMvc.perform(post("/api/modelisation/exigences/generer/41")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exigences.length()").value(0));
    }

    /**
     * Test de la génération réussie avec IA.
     */
    @Test
    void testGenerer_AvecSucces() throws Exception {
        UserStory us = new UserStory();
        when(userStoryRepository.findByProjetIdProjet(41L)).thenReturn(List.of(us));

        ExigenceController.ExigencesWrapper wrapper = new ExigenceController.ExigencesWrapper();
        wrapper.setExigences(List.of(new ExigenceResponse("EF-01", "Libelle", "Desc", List.of("US-01"))));

        when(mistralService.executerAnalyse(anyString(), anyString(), any())).thenReturn(wrapper);

        mockMvc.perform(post("/api/modelisation/exigences/generer/41")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exigences[0].code").value("EF-01"));
    }

    /**
     * Test de la sauvegarde des exigences.
     * Vérifie la réception du JSON et l'appel au service.
     */
    @Test
    void testSauvegarder() throws Exception {
        ExigenceRequest req = new ExigenceRequest();
        req.setCode("EF-01");
        req.setLibelle("Test");

        mockMvc.perform(post("/api/modelisation/exigences/sauvegarder/41")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(List.of(req))))
                .andExpect(status().isOk());
    }
}