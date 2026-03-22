package com.backend.projet.common.exception;

public class AuthentificationException extends Exception {

    public AuthentificationException() {
        super();
    }

    public AuthentificationException(String message) {
        super(message);
    }

    public AuthentificationException(String message, Throwable cause) {
        super(message, cause);
    }

    public AuthentificationException(Throwable cause) {
        super(cause);
    }
}
