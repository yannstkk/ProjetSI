package com.backend.projet.common.exception;

public class AuthentificationException extends Exception {
    /**
     * Creates a new InvalidLoginException.
     * @param message description of the error
     */
    public AuthentificationException(String message) {
        super(message);
    }

}
