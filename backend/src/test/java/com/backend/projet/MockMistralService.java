package com.backend.projet;

import org.springframework.web.client.RestTemplate;

import com.backend.projet.mistral.service.MistralService;
import com.backend.projet.mistral.exceptions.MistralApiException;

public class MockMistralService extends MistralService {

    public int executerAnalyseCalled = 0;
    public boolean shouldFail = false;

    public MockMistralService() {
        super(new RestTemplate());
    }

    @Override
    public <T> T executerAnalyse(String userContent, String prompt, Class<T> returnType) throws MistralApiException {
        this.executerAnalyseCalled++;

        if (this.shouldFail) {
            throw new MistralApiException("Erreur API Mistral simulée");
        }

        try {
            return returnType.getDeclaredConstructor().newInstance();
        } catch (Exception e) {
            return null;
        }
    }
}