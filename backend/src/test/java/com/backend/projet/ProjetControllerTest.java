package com.backend.projet;

import com.backend.projet.projet.dto.request.ProjetRequest;
import com.backend.projet.projet.dto.response.ProjetResponse;
import com.backend.projet.projet.service.ProjetService;
import com.backend.projet.auth.security.JwtUtil;
import com.backend.projet.config.JwtConfig;
import com.backend.projet.projet.controller.ProjetController;
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
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@WebMvcTest(ProjetController.class)
@WithMockUser
public class ProjetControllerTest {

    @Autowired
    private MockMvc mockMvc;
    
    private ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @MockitoBean
    private ProjetService projetService;
    
    @MockitoBean
    private JwtUtil jwtUtil;
    
    @MockitoBean
    private JwtConfig jwtConfig;
    
    @Test
    public void testGetAllProjets() throws Exception {
        List<ProjetResponse> projets = List.of(
                new ProjetResponse(1L, "Projet A", LocalDate.of(2026, 1, 1), "user1"),
                new ProjetResponse(2L, "Projet B", LocalDate.of(2026, 2, 1), "user2")
        );

        when(projetService.getAllProjets()).thenReturn(projets);

        mockMvc.perform(get("/api/projets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].nom").value("Projet A"))
                .andExpect(jsonPath("$[1].nom").value("Projet B"));
    }
    
    
    @Test
    public void testGetProjetById() throws Exception {
        ProjetResponse projet = new ProjetResponse(1L, "Projet A", LocalDate.of(2026, 1, 1), "user1");

        when(projetService.getProjetById(1L)).thenReturn(projet);

        mockMvc.perform(get("/api/projets/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idProjet").value(1))
                .andExpect(jsonPath("$.nom").value("Projet A"))
                .andExpect(jsonPath("$.idUser").value("user1"));
    }
    
    @Test
    public void testGetProjetsByUser() throws Exception {
        List<ProjetResponse> projets = List.of(
                new ProjetResponse(1L, "Projet A", LocalDate.of(2026, 1, 1), "user1")
        );

        when(projetService.getProjetsByUser("user1")).thenReturn(projets);

        mockMvc.perform(get("/api/projets/user/user1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].idUser").value("user1"));
    }
    
    @Test
    public void testCreerProjet() throws Exception {
        ProjetRequest request = new ProjetRequest();
        request.setNom("Nouveau Projet");
        request.setIdUser("user1");

        ProjetResponse response = new ProjetResponse(1L, "Nouveau Projet", LocalDate.now(), "user1");

        when(projetService.creerProjet(any(ProjetRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/projets")
        				.with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idProjet").value(1))
                .andExpect(jsonPath("$.nom").value("Nouveau Projet"))
                .andExpect(jsonPath("$.idUser").value("user1"));
    }
    
    @Test
    public void testGetProjetById_NotFound() throws Exception {
        when(projetService.getProjetById(99L))
                .thenThrow(new com.backend.projet.projet.exception.ResourceNotFoundException("Projet non trouvé : 99"));

        mockMvc.perform(get("/api/projets/99"))
                .andExpect(status().isNotFound());
    }
}
