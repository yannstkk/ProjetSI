package com.backend.projet.modelisation;

import com.backend.projet.auth.security.JwtUtil;
import com.backend.projet.config.JwtConfig;
import com.backend.projet.modelisation.controller.ActeurController;
import com.backend.projet.modelisation.dto.request.ActeurRequest;
import com.backend.projet.modelisation.dto.response.ActeurResponse;
import com.backend.projet.modelisation.service.ActeurService;
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
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ActeurController.class)
@WithMockUser
public class ActeurControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    @MockitoBean
    private ActeurService acteurService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private JwtConfig jwtConfig;

    @Test
    public void testGetByProjet() throws Exception {
        List<ActeurResponse> acteurs = List.of(
                new ActeurResponse(1L, 1L, "Client A", "CLIENT", "INTERVIEW", "Décideur"),
                new ActeurResponse(2L, 1L, "Technicien B", "TECHNICIEN", "ANALYSE", "Expert")
        );

        when(acteurService.getByProjet(1L)).thenReturn(acteurs);

        mockMvc.perform(get("/api/acteur/projet/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].nom").value("Client A"))
                .andExpect(jsonPath("$[0].type").value("CLIENT"))
                .andExpect(jsonPath("$[1].nom").value("Technicien B"));
    }

    @Test
    public void testGetByProjet_Empty() throws Exception {
        when(acteurService.getByProjet(99L)).thenReturn(List.of());

        mockMvc.perform(get("/api/acteur/projet/99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    public void testCreate() throws Exception {
        ActeurRequest request = new ActeurRequest();
        request.setIdProjet(1L);
        request.setNom("Client A");
        request.setType("CLIENT");
        request.setSource("INTERVIEW");
        request.setRole("Décideur");

        ActeurResponse response = new ActeurResponse(
                1L, 1L, "Client A", "CLIENT", "INTERVIEW", "Décideur"
        );

        when(acteurService.create(any(ActeurRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/acteur")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idActeur").value(1))
                .andExpect(jsonPath("$.nom").value("Client A"))
                .andExpect(jsonPath("$.type").value("CLIENT"))
                .andExpect(jsonPath("$.idProjet").value(1));
    }

    @Test
    public void testCreate_BadRequest() throws Exception {
        ActeurRequest request = new ActeurRequest();
        request.setIdProjet(99L);
        request.setNom("Client A");

        when(acteurService.create(any(ActeurRequest.class)))
                .thenThrow(new RuntimeException("Projet non trouvé : 99"));

        mockMvc.perform(post("/api/acteur")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}