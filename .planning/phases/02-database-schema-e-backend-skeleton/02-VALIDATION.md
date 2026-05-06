# Phase 2 Validation Strategy

## Architecture & Integration Tests
- **Database Schema:** Verify Flyway migrations run cleanly against a fresh PostgreSQL database.
- **DTO Validation:** Verify `jakarta.validation` annotations correctly reject invalid inputs.
- **MapStruct Mapping:** Verify Entity to DTO and DTO to Entity conversions work correctly, and null values are ignored.
- **Exception Handling:** Verify `@ControllerAdvice` returns the expected simple JSON format structure for simulated errors (e.g., triggering a validation error or Not Found error).
