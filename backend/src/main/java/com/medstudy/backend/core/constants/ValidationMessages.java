package com.medstudy.backend.core.constants;

public final class ValidationMessages {

    private ValidationMessages() {
        // Prevent instantiation
    }

    public static final String FIELD_REQUIRED = "This field is required";
    public static final String INVALID_EMAIL = "Please provide a valid email address";
    public static final String PASSWORD_MIN_LENGTH = "Password must be at least 8 characters long";
    public static final String INVALID_FORMAT = "Invalid format";
}
