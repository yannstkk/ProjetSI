package com.backend.projet.elicitation.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.backend.projet.elicitation.dto.response.AnalysisResponse;
import com.backend.projet.mistral.exceptions.MistralApiException;
import com.backend.projet.MockMistralService;

public class ElicitationServiceTest {

    protected ElicitationService elicitationService;
    protected MockMistralService mockMistralService;

    @BeforeEach
    public void init() {
        this.mockMistralService = new MockMistralService();
        this.elicitationService = new ElicitationService(this.mockMistralService);
    }

    @Test
    public void validNotesReturnsAnalysisResponseTest() throws MistralApiException {
        AnalysisResponse response = this.elicitationService.analyserNotes("notes");
        assertEquals(1, this.mockMistralService.executerAnalyseCalled);
        assertNotNull(response);
    }

    @Test
    public void cannotAnalyseWithNullNotesTest() {
        assertThrows(IllegalArgumentException.class, () -> {this.elicitationService.analyserNotes(null);});
        assertEquals(0, this.mockMistralService.executerAnalyseCalled);
    }

    @Test
    public void cannotAnalyseWithBlankNotesTest() {
        assertThrows(IllegalArgumentException.class, () -> {this.elicitationService.analyserNotes("   ");});
        assertEquals(0, this.mockMistralService.executerAnalyseCalled);
    }

    @Test
    public void mistralApiErrorTest() {
        this.mockMistralService.shouldFail = true;
        assertThrows(MistralApiException.class, () -> {this.elicitationService.analyserNotes("notes");});
        assertEquals(1, this.mockMistralService.executerAnalyseCalled);
    }
}