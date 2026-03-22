package com.backend.projet.mistral.exceptions;

public class MistralApiException extends RuntimeException {
    public MistralApiException(String message) {
        super(message);
    }
}
