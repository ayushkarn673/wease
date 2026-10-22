package com.wease.core;

// Simple `{ "message": "..." }` body for endpoints that only confirm an action.
public record MessageResponse(String message) {
}
