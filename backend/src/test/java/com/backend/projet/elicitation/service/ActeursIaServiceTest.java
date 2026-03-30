package com.backend.projet.elicitation.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.backend.projet.elicitation.service.ActeursIaService;
import com.backend.projet.elicitation.dto.response.ActeurIaResponse;
import com.backend.projet.mistral.exceptions.MistralApiException;
import com.backend.projet.MockMistralService;

public class ActeursIaServiceTest {

    protected ActeursIaService acteursIaService;
    protected MockMistralService mockMistralService;

    @BeforeEach
    public void init() {
        this.mockMistralService = new MockMistralService();
        this.acteursIaService = new ActeursIaService(this.mockMistralService);
    }

    @Test
    public void validNotesReturnsActeurIaResponseTest() throws MistralApiException {
        ActeurIaResponse response = this.acteursIaService.detecterActeurs("notes");
        assertEquals(1, this.mockMistralService.executerAnalyseCalled);
        assertNotNull(response);
    }

    @Test
    public void cannotDetectWithNullNotesTest() {
        assertThrows(IllegalArgumentException.class, () -> {this.acteursIaService.detecterActeurs(null);});
        assertEquals(0, this.mockMistralService.executerAnalyseCalled);
    }

    @Test
    public void mistralApiErrorTest() {
        this.mockMistralService.shouldFail = true;
        assertThrows(MistralApiException.class, () -> {this.acteursIaService.detecterActeurs("notes");});
        assertEquals(1, this.mockMistralService.executerAnalyseCalled);
    }
}