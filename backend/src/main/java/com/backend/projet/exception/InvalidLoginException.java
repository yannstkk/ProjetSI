package com.backend.projet.exception;

public class InvalidLoginException extends Exception {
    /**
     * Creates a new InvalidLoginException.
     * @param message description of the error
     */
    public InvalidLoginException(String message) {
        super(message);
    }

}
