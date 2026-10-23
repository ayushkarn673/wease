package com.wease.core.exception;

// The phone number is verified but has no account yet: the client should ask for a name and try again.
public class NewAccountRequiredException extends RuntimeException {
    public NewAccountRequiredException(String message) {
        super(message);
    }
}