package com.backend.projet.elicitation.controller;

import com.backend.projet.auth.security.JwtUtil;
import com.backend.projet.config.JwtConfig;
import com.backend.projet.elicitation.dto.request.QuestionRequest;
import com.backend.projet.elicitation.dto.response.QuestionResponse;
import com.backend.projet.elicitation.service.QuestionService;
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

@WebMvcTest(QuestionController.class)
@WithMockUser
public class QuestionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    @MockitoBean
    private QuestionService questionService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private JwtConfig jwtConfig;

    @Test
    public void testGetByInterview() throws Exception {
        List<QuestionResponse> questions = List.of(
                new QuestionResponse(1L, 1L, "Quels sont vos besoins ?"),
                new QuestionResponse(2L, 1L, "Quels sont vos contraintes ?")
        );

        when(questionService.getByInterview(1L)).thenReturn(questions);

        mockMvc.perform(get("/api/questions/interview/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].libelle").value("Quels sont vos besoins ?"))
                .andExpect(jsonPath("$[0].numeroInterview").value(1))
                .andExpect(jsonPath("$[1].libelle").value("Quels sont vos contraintes ?"));
    }

    @Test
    public void testGetByInterview_Empty() throws Exception {
        when(questionService.getByInterview(99L)).thenReturn(List.of());

        mockMvc.perform(get("/api/questions/interview/99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    public void testCreer() throws Exception {
        QuestionRequest request = new QuestionRequest();
        request.setNumeroInterview(1L);
        request.setLibelle("Quels sont vos besoins ?");

        QuestionResponse response = new QuestionResponse(
                1L, 1L, "Quels sont vos besoins ?"
        );

        when(questionService.creer(any(QuestionRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/questions")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.numeroQuestion").value(1))
                .andExpect(jsonPath("$.numeroInterview").value(1))
                .andExpect(jsonPath("$.libelle").value("Quels sont vos besoins ?"));
    }

    @Test
    public void testCreer_BadRequest() throws Exception {
        QuestionRequest request = new QuestionRequest();
        request.setNumeroInterview(99L);
        request.setLibelle("Quels sont vos besoins ?");

        when(questionService.creer(any(QuestionRequest.class)))
                .thenThrow(new RuntimeException("Interview non trouvée : 99"));

        mockMvc.perform(post("/api/questions")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testDeleteByInterview() throws Exception {
        doNothing().when(questionService).deleteByInterview(1L);

        mockMvc.perform(delete("/api/questions/interview/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    public void testDeleteByInterview_Empty() throws Exception {
        doNothing().when(questionService).deleteByInterview(99L);

        mockMvc.perform(delete("/api/questions/interview/99")
                        .with(csrf()))
                .andExpect(status().isNoContent());
    }
}