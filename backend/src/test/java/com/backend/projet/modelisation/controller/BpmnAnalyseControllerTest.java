package com.backend.projet.modelisation.controller;

import com.backend.projet.auth.security.JwtUtil;
import com.backend.projet.config.JwtConfig;
import com.backend.projet.mistral.exceptions.MistralApiException;
import com.backend.projet.mistral.service.MistralService;
import com.backend.projet.modelisation.dto.request.BpmnAnalyseRequest;
import com.backend.projet.modelisation.dto.response.BpmnCoherenceIaResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BpmnAnalyseController.class)
@WithMockUser
public class BpmnAnalyseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    @MockitoBean
    private MistralService mistralService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private JwtConfig jwtConfig;

    @Test
    public void testAnalyserCoherence() throws Exception {
        BpmnAnalyseRequest request = new BpmnAnalyseRequest();
        request.setContenuBpmn("<bpmn>...</bpmn>");
        request.setUserStories("En tant qu'utilisateur, je veux me connecter");

        BpmnCoherenceIaResponse response = new BpmnCoherenceIaResponse();

        when(mistralService.analyserCoherenceBpmn(
                request.getContenuBpmn(),
                request.getUserStories()
        )).thenReturn(response);

        mockMvc.perform(post("/api/bpmn/analyser-coherence")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    public void testAnalyserCoherence_BpmnVide() throws Exception {
        BpmnAnalyseRequest request = new BpmnAnalyseRequest();
        request.setContenuBpmn("");
        request.setUserStories("En tant qu'utilisateur, je veux me connecter");

        mockMvc.perform(post("/api/bpmn/analyser-coherence")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testAnalyserCoherence_BpmnNull() throws Exception {
        BpmnAnalyseRequest request = new BpmnAnalyseRequest();
        request.setContenuBpmn(null);
        request.setUserStories("En tant qu'utilisateur, je veux me connecter");

        mockMvc.perform(post("/api/bpmn/analyser-coherence")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testAnalyserCoherence_UserStoriesVides() throws Exception {
        BpmnAnalyseRequest request = new BpmnAnalyseRequest();
        request.setContenuBpmn("<bpmn>...</bpmn>");
        request.setUserStories("");

        mockMvc.perform(post("/api/bpmn/analyser-coherence")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testAnalyserCoherence_UserStoriesNull() throws Exception {
        BpmnAnalyseRequest request = new BpmnAnalyseRequest();
        request.setContenuBpmn("<bpmn>...</bpmn>");
        request.setUserStories(null);

        mockMvc.perform(post("/api/bpmn/analyser-coherence")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testAnalyserCoherence_ErreurMistral() throws Exception {
        BpmnAnalyseRequest request = new BpmnAnalyseRequest();
        request.setContenuBpmn("<bpmn>...</bpmn>");
        request.setUserStories("En tant qu'utilisateur, je veux me connecter");

        when(mistralService.analyserCoherenceBpmn(
                request.getContenuBpmn(),
                request.getUserStories()
        )).thenThrow(new MistralApiException("Erreur API Mistral"));

        mockMvc.perform(post("/api/bpmn/analyser-coherence")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    public void testAnalyserCoherence_ErreurServeur() throws Exception {
        BpmnAnalyseRequest request = new BpmnAnalyseRequest();
        request.setContenuBpmn("<bpmn>...</bpmn>");
        request.setUserStories("En tant qu'utilisateur, je veux me connecter");

        when(mistralService.analyserCoherenceBpmn(
                request.getContenuBpmn(),
                request.getUserStories()
        )).thenThrow(new RuntimeException("Erreur inattendue"));

        mockMvc.perform(post("/api/bpmn/analyser-coherence")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError());
    }
}
