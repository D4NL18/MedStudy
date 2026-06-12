package com.medstudy.backend.core.exception;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Standardized error response payload returned when an API request fails.")
public record ErrorResponse(
    @Schema(description = "Timestamp when the error occurred.", example = "2024-05-20T15:30:00")
    LocalDateTime timestamp,
    
    @Schema(description = "HTTP status code representing the error category.", example = "404")
    int status,
    
    @Schema(description = "Short HTTP error reason phrase.", example = "Not Found")
    String error,
    
    @Schema(description = "Detailed human-readable message describing the specific error.", example = "User not found")
    String message,
    
    @Schema(description = "The request path that resulted in the error.", example = "/api/v1/users/123")
    String path
) {}
