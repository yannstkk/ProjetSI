package com.backend.projet.modelisation.controller;

import com.backend.projet.auth.security.JwtUtil;
import com.backend.projet.config.JwtConfig;
import com.backend.projet.modelisation.dto.request.BpmnRequest;
import com.backend.projet.modelisation.dto.response.BpmnResponse;
import com.backend.projet.modelisation.service.BpmnService;
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

@WebMvcTest(BpmnSaveController.class)
@WithMockUser
public class BpmnSaveControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    @MockitoBean
    private BpmnService bpmnService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private JwtConfig jwtConfig;

    @Test
    public void testGetByProjet() throws Exception {
        List<BpmnResponse> bpmns = List.of(
                new BpmnResponse(1L, 1L, "BPMN 1", "<bpmn>...</bpmn>"),
                new BpmnResponse(2L, 1L, "BPMN 2", "<bpmn>...</bpmn>")
        );

        when(bpmnService.getByProjet(1L)).thenReturn(bpmns);

        mockMvc.perform(get("/api/bpmn/projet/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].titre").value("BPMN 1"))
                .andExpect(jsonPath("$[1].titre").value("BPMN 2"));
    }

    @Test
    public void testGetByProjet_Empty() throws Exception {
        when(bpmnService.getByProjet(99L)).thenReturn(List.of());

        mockMvc.perform(get("/api/bpmn/projet/99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    public void testGetById() throws Exception {
        BpmnResponse response = new BpmnResponse(1L, 1L, "BPMN 1", "<bpmn>...</bpmn>");

        when(bpmnService.getById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/bpmn/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idBpmn").value(1))
                .andExpect(jsonPath("$.titre").value("BPMN 1"));
    }

    @Test
    public void testSaveBpmn() throws Exception {
        BpmnRequest request = new BpmnRequest();
        request.setTitre("BPMN 1");
        request.setContenu("<bpmn>...</bpmn>");
        request.setIdProjet(1L);

        BpmnResponse response = new BpmnResponse(1L, 1L, "BPMN 1", "<bpmn>...</bpmn>");

        when(bpmnService.save(any(BpmnRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/bpmn/save")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idBpmn").value(1))
                .andExpect(jsonPath("$.titre").value("BPMN 1"))
                .andExpect(jsonPath("$.idProjet").value(1));
    }

    @Test
    public void testSaveBpmn_BadRequest() throws Exception {
        BpmnRequest request = new BpmnRequest();
        request.setTitre("");
        request.setContenu("<bpmn>...</bpmn>");
        request.setIdProjet(1L);

        when(bpmnService.save(any(BpmnRequest.class)))
                .thenThrow(new IllegalArgumentException("Le titre est requis"));

        mockMvc.perform(post("/api/bpmn/save")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation échouée : Le titre est requis"));
    }

    @Test
    public void testSaveBpmn_ErreurServeur() throws Exception {
        BpmnRequest request = new BpmnRequest();
        request.setTitre("BPMN 1");
        request.setContenu("<bpmn>...</bpmn>");
        request.setIdProjet(1L);

        when(bpmnService.save(any(BpmnRequest.class)))
                .thenThrow(new RuntimeException("Erreur inattendue"));

        mockMvc.perform(post("/api/bpmn/save")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("Erreur lors de la sauvegarde : Erreur inattendue"));
    }

    @Test
    public void testUpdateBpmn() throws Exception {
        BpmnRequest request = new BpmnRequest();
        request.setTitre("BPMN modifié");
        request.setContenu("<bpmn>modifié</bpmn>");

        BpmnResponse response = new BpmnResponse(1L, 1L, "BPMN modifié", "<bpmn>modifié</bpmn>");

        when(bpmnService.update(eq(1L), any(BpmnRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/bpmn/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idBpmn").value(1))
                .andExpect(jsonPath("$.titre").value("BPMN modifié"));
    }

    @Test
    public void testUpdateBpmn_ErreurServeur() throws Exception {
        BpmnRequest request = new BpmnRequest();
        request.setTitre("BPMN modifié");

        when(bpmnService.update(eq(99L), any(BpmnRequest.class)))
                .thenThrow(new RuntimeException("BPMN non trouvé"));

        mockMvc.perform(put("/api/bpmn/99")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("Erreur lors de la mise à jour : BPMN non trouvé"));
    }

    @Test
    public void testDeleteBpmn() throws Exception {
        doNothing().when(bpmnService).delete(1L);

        mockMvc.perform(delete("/api/bpmn/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    public void testDeleteBpmn_ErreurServeur() throws Exception {
        doThrow(new RuntimeException("BPMN non trouvé"))
                .when(bpmnService).delete(eq(99L));

        mockMvc.perform(delete("/api/bpmn/99")
                        .with(csrf()))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("Erreur lors de la suppression : BPMN non trouvé"));
    }
}
