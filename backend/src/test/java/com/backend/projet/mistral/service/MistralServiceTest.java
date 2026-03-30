package com.backend.projet.mistral.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestTemplate;

import com.backend.projet.mistral.exceptions.MistralApiException;
import com.backend.projet.elicitation.dto.response.AnalysisResponse;
import com.backend.projet.mistral.dto.BacklogAnalyseResponse;
import com.backend.projet.modelisation.dto.FluxResponse;
import com.backend.projet.modelisation.dto.response.BpmnCoherenceIaResponse;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class MistralServiceTest {

    protected MistralService mistralService;
    protected MockRestTemplate mockRestTemplate;

    @BeforeEach
    public void init() {
        this.mockRestTemplate = new MockRestTemplate();
        this.mistralService = new MistralService(this.mockRestTemplate);
    }

    @Test
    public void validNotesReturnsAnalysisResponseTest() {
        AnalysisResponse response = this.mistralService.analyserNotes("notes");
        assertEquals(1, this.mockRestTemplate.postForObjectCalled);
        assertNotNull(response);
    }

    @Test
    public void apiErrorReturnsEmptyAnalysisResponseTest() {
        this.mockRestTemplate.shouldFail = true;
        AnalysisResponse response = this.mistralService.analyserNotes("notes");
        assertEquals(1, this.mockRestTemplate.postForObjectCalled);
        assertNotNull(response);
    }

    @Test
    public void validNotesReturnsSuggestedQuestionsTest() {
        String response = this.mistralService.suggererQuestions("notes");
        assertEquals(1, this.mockRestTemplate.postForObjectCalled);
        assertNotNull(response);
    }

    @Test
    public void validPlantUmlReturnsFluxResponseTest() {
        FluxResponse response = this.mistralService.analyserMFC("plantUml");
        assertEquals(1, this.mockRestTemplate.postForObjectCalled);
        assertNotNull(response);
    }

    @Test
    public void validBacklogReturnsBacklogAnalyseResponseTest() throws MistralApiException {
        BacklogAnalyseResponse response = this.mistralService.analyserBacklog("backlog");
        assertEquals(1, this.mockRestTemplate.postForObjectCalled);
        assertNotNull(response);
    }

    @Test
    public void cannotAnalyseBacklogWhenApiErrorTest() {
        this.mockRestTemplate.shouldFail = true;
        assertThrows(MistralApiException.class, () -> {this.mistralService.analyserBacklog("backlog");});
        assertEquals(1, this.mockRestTemplate.postForObjectCalled);
    }

    @Test
    public void validBpmnReturnsBpmnCoherenceIaResponseTest() throws MistralApiException {
        BpmnCoherenceIaResponse response = this.mistralService.analyserCoherenceBpmn("bpmn", "us");
        assertEquals(1, this.mockRestTemplate.postForObjectCalled);
        assertNotNull(response);
    }

    private class MockRestTemplate extends RestTemplate {

        public int postForObjectCalled = 0;
        public boolean shouldFail = false;

        @Override
        public <T> T postForObject(String url, Object request, Class<T> responseType, Object... uriVariables) {
            this.postForObjectCalled++;
            if (this.shouldFail) {
                throw new RuntimeException("Erreur API");
            }

            Map<String, Object> mistralResponse = new HashMap<>();
            Map<String, Object> choice = new HashMap<>();
            Map<String, Object> message = new HashMap<>();
            message.put("content", "{}");
            choice.put("message", message);
            mistralResponse.put("choices", Collections.singletonList(choice));
            return (T) mistralResponse;
        }
    }
}