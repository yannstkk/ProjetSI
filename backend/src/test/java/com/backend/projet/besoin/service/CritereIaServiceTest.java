package com.backend.projet.besoin.service;

import static org.junit.jupiter.api.Assertions.*;

import com.backend.projet.MockMistralService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.backend.projet.besoin.dto.response.CritereIaResponse;
import com.backend.projet.mistral.exceptions.MistralApiException;

public class CritereIaServiceTest {

    protected CritereIaService critereIaService;
    protected MockMistralService mockMistralService;

    @BeforeEach
    public void init() {
        this.mockMistralService = new MockMistralService();
        this.critereIaService = new CritereIaService(this.mockMistralService);
    }

    @Test
    public void validParametersReturnsCritereIaResponseTest() throws MistralApiException {
        String acteur = "User";
        String veux = "Login";
        String afin = "Access system";
        CritereIaResponse response = this.critereIaService.genererCritereIa(acteur, veux, afin);
        assertEquals(1, this.mockMistralService.executerAnalyseCalled);
        assertNotNull(response);
    }

    @Test
    public void cannotGenerateWithNullacteurTest() {
        String veux = "Login";
        String afin = "Access system";
        assertThrows(IllegalArgumentException.class, () -> {this.critereIaService.genererCritereIa(null, veux, afin);});
        assertEquals(0, this.mockMistralService.executerAnalyseCalled);
    }

    @Test
    public void cannotGenerateWithBlankacteurTest() {
        String acteur = "   ";
        String veux = "Login";
        String afin = "Access system";
        assertThrows(IllegalArgumentException.class, () -> {this.critereIaService.genererCritereIa(acteur, veux, afin);});
        assertEquals(0, this.mockMistralService.executerAnalyseCalled);
    }

    @Test
    public void cannotGenerateWithNullVeuxTest() {
        String acteur = "User";
        String afin = "Access system";
        assertThrows(IllegalArgumentException.class, () -> {this.critereIaService.genererCritereIa(acteur, null, afin);});
        assertEquals(0, this.mockMistralService.executerAnalyseCalled);
    }

    @Test
    public void cannotGenerateWithBlankVeuxTest() {
        String acteur = "User";
        String veux = "";
        String afin = "Access system";
        assertThrows(IllegalArgumentException.class, () -> {this.critereIaService.genererCritereIa(acteur, veux, afin);});
        assertEquals(0, this.mockMistralService.executerAnalyseCalled);
    }

    @Test
    public void cannotGenerateWithNullAfinTest() {
        String acteur = "User";
        String veux = "Login";
        assertThrows(IllegalArgumentException.class, () -> {this.critereIaService.genererCritereIa(acteur, veux, null);});
        assertEquals(0, this.mockMistralService.executerAnalyseCalled);
    }

    @Test
    public void cannotGenerateWithBlankAfinTest() {
        String acteur = "User";
        String veux = "Login";
        String afin = "  ";
        assertThrows(IllegalArgumentException.class, () -> {this.critereIaService.genererCritereIa(acteur, veux, afin);});
        assertEquals(0, this.mockMistralService.executerAnalyseCalled);
    }

    @Test
    public void mistralApiErrorTest() {
        String acteur = "User";
        String veux = "Login";
        String afin = "Access system";
        this.mockMistralService.shouldFail = true;
        assertThrows(MistralApiException.class, () -> {this.critereIaService.genererCritereIa(acteur, veux, afin);});
        assertEquals(1, this.mockMistralService.executerAnalyseCalled);
    }
}