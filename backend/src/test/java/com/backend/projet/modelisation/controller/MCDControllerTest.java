package com.backend.projet.modelisation.controller;

import com.backend.projet.auth.security.JwtUtil;
import com.backend.projet.config.JwtConfig;
import com.backend.projet.mistral.exceptions.MistralApiException;
import com.backend.projet.modelisation.controller.MCDController;
import com.backend.projet.modelisation.dto.request.MCDAnalyseRequest;
import com.backend.projet.modelisation.dto.request.MCDRequest;
import com.backend.projet.modelisation.dto.response.MCDAnalyseResponse;
import com.backend.projet.modelisation.dto.response.MCDResponse;
import com.backend.projet.modelisation.service.MCDService;
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

@WebMvcTest(MCDController.class)
@WithMockUser
public class MCDControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    @MockitoBean
    private MCDService mcdService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private JwtConfig jwtConfig;

    @Test
    public void testCreer() throws Exception {
        MCDRequest request = new MCDRequest();
        request.setIdProjet(1L);
        request.setNom("Mon MCD");
        request.setContenu("@startuml ...");

        MCDResponse response = new MCDResponse(1L, "Mon MCD", 1L, "@startuml ...", null);

        when(mcdService.creer(any(MCDRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/mcd")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idMcd").value(1))
                .andExpect(jsonPath("$.nom").value("Mon MCD"))
                .andExpect(jsonPath("$.idProjet").value(1));
    }

    @Test
    public void testCreer_BadRequest() throws Exception {
        MCDRequest request = new MCDRequest();
        request.setIdProjet(99L);
        request.setNom("Mon MCD");

        when(mcdService.creer(any(MCDRequest.class)))
                .thenThrow(new RuntimeException("Projet non trouvé : 99"));

        mockMvc.perform(post("/api/mcd")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testGetByProjet() throws Exception {
        List<MCDResponse> mcds = List.of(
                new MCDResponse(1L, "MCD 1", 1L, "@startuml ...", null),
                new MCDResponse(2L, "MCD 2", 1L, "@startuml ...", "Analyse Mistral")
        );

        when(mcdService.getByProjet(1L)).thenReturn(mcds);

        mockMvc.perform(get("/api/mcd/projet/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].nom").value("MCD 1"))
                .andExpect(jsonPath("$[1].reponseMistral").value("Analyse Mistral"));
    }

    @Test
    public void testGetById() throws Exception {
        MCDResponse response = new MCDResponse(1L, "Mon MCD", 1L, "@startuml ...", null);

        when(mcdService.getById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/mcd/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idMcd").value(1))
                .andExpect(jsonPath("$.nom").value("Mon MCD"));
    }

    @Test
    public void testGetById_NotFound() throws Exception {
        when(mcdService.getById(99L))
                .thenThrow(new RuntimeException("MCD non trouvé : 99"));

        mockMvc.perform(get("/api/mcd/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testMettreAJour() throws Exception {
        MCDRequest request = new MCDRequest();
        request.setNom("MCD modifié");
        request.setContenu("@startuml modifié...");

        MCDResponse response = new MCDResponse(1L, "MCD modifié", 1L, "@startuml modifié...", null);

        when(mcdService.mettreAJour(eq(1L), any(MCDRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/mcd/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idMcd").value(1))
                .andExpect(jsonPath("$.nom").value("MCD modifié"));
    }

    @Test
    public void testMettreAJour_NotFound() throws Exception {
        MCDRequest request = new MCDRequest();
        request.setNom("MCD modifié");

        when(mcdService.mettreAJour(eq(99L), any(MCDRequest.class)))
                .thenThrow(new RuntimeException("MCD non trouvé : 99"));

        mockMvc.perform(put("/api/mcd/99")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testSupprimer() throws Exception {
        doNothing().when(mcdService).supprimer(1L);

        mockMvc.perform(delete("/api/mcd/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    public void testSupprimer_NotFound() throws Exception {
        doThrow(new RuntimeException("MCD non trouvé : 99"))
                .when(mcdService).supprimer(eq(99L));

        mockMvc.perform(delete("/api/mcd/99")
                        .with(csrf()))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testAnalyser() throws Exception {
        MCDAnalyseRequest request = new MCDAnalyseRequest();
        request.setContenuPlantuml("@startuml ...");

        MCDAnalyseResponse response = new MCDAnalyseResponse();

        when(mcdService.analyser(any(String.class))).thenReturn(response);

        mockMvc.perform(post("/api/mcd/analyser")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    public void testAnalyser_ContenuVide() throws Exception {
        MCDAnalyseRequest request = new MCDAnalyseRequest();
        request.setContenuPlantuml("");

        mockMvc.perform(post("/api/mcd/analyser")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testAnalyser_ErreurMistral() throws Exception {
        MCDAnalyseRequest request = new MCDAnalyseRequest();
        request.setContenuPlantuml("@startuml ...");

        when(mcdService.analyser(any(String.class)))
                .thenThrow(new MistralApiException("Erreur API Mistral"));

        mockMvc.perform(post("/api/mcd/analyser")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError());
    }
}