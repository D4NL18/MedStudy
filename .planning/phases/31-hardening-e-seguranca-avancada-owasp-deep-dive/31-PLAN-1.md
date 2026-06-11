# Phase 31: Hardening e Segurança Avançada (OWASP Deep Dive)

## Wave 1: Security Configuration Tuning

### Task 1: Fine-tune Rate Limiting
<read_first>
- backend/src/main/java/com/medstudy/backend/core/config/RateLimitInterceptor.java
</read_first>
<action>
Modify `RateLimitInterceptor.java` to implement production-ready rate limits:
- Check if `request.getRequestURI().startsWith("/api/auth")`. If so, use a strict limit of 5 requests per minute by IP (`"auth:" + clientIp`).
- For other requests from authenticated users (with Bearer token), set the limit to 100 requests per minute (`"user:" + authorizationHeader`).
- For other requests from anonymous users, keep the limit at 7 requests per minute (`"ip:" + clientIp`).
Implement this logic by restructuring the `key` and `bucket` creation in `preHandle`.
</action>
<acceptance_criteria>
- `grep '100, Duration.ofMinutes(1)' backend/src/main/java/com/medstudy/backend/core/config/RateLimitInterceptor.java` returns a match.
- `grep '5, Duration.ofMinutes(1)' backend/src/main/java/com/medstudy/backend/core/config/RateLimitInterceptor.java` returns a match.
- `grep 'request.getRequestURI().startsWith("/api/auth")' backend/src/main/java/com/medstudy/backend/core/config/RateLimitInterceptor.java` returns a match.
</acceptance_criteria>

### Task 2: Add X-Frame-Options to HTTP Security Headers
<read_first>
- backend/src/main/java/com/medstudy/backend/core/config/SecurityConfig.java
</read_first>
<action>
In `SecurityConfig.java`, inside the `.headers()` configuration block for the `SecurityFilterChain` bean:
- Add `.frameOptions(frameOptions -> frameOptions.deny())` to prevent Clickjacking attacks.
Make sure it chains properly with `contentSecurityPolicy` and `httpStrictTransportSecurity`.
</action>
<acceptance_criteria>
- `grep 'frameOptions.deny()' backend/src/main/java/com/medstudy/backend/core/config/SecurityConfig.java` returns at least 1 match.
</acceptance_criteria>

### Task 3: CSRF Fine-Tuning and Documentation
<read_first>
- backend/src/main/java/com/medstudy/backend/core/config/SecurityConfig.java
- backend/src/test/java/com/medstudy/backend/core/config/SecurityConfigTest.java
</read_first>
<action>
In `SecurityConfig.java`:
- Add the following comment above the CSRF configuration: `// Application is fully stateless (JWT), no CSRF token required for /api endpoints`.
- Ensure `.csrf(csrf -> csrf.ignoringRequestMatchers("/api/**"))` is explicitly set.

Create or update `backend/src/test/java/com/medstudy/backend/core/config/SecurityConfigTest.java`:
- Add a test method `shouldIgnoreCsrfForApiEndpoints` to verify that a POST to an API endpoint without a CSRF token does not fail with 403 CSRF error (though it may fail with 401 unauthorized, but not 403 due to missing CSRF).
</action>
<acceptance_criteria>
- `grep 'no CSRF token required for /api endpoints' backend/src/main/java/com/medstudy/backend/core/config/SecurityConfig.java` returns at least 1 match.
- `grep 'shouldIgnoreCsrfForApiEndpoints' backend/src/test/java/com/medstudy/backend/core/config/SecurityConfigTest.java` returns at least 1 match.
</acceptance_criteria>

### Task 4: Enforce Build Failure on High/Critical Vulnerabilities
<read_first>
- backend/pom.xml
</read_first>
<action>
In `backend/pom.xml`, locate the `dependency-check-maven` plugin within the `<build><plugins>` section.
Add a `<configuration>` block to it, containing `<failBuildOnCVSS>7</failBuildOnCVSS>`.
This will configure the build to fail if any vulnerabilities with a CVSS score of 7 or higher (High/Critical) are found.
</action>
<acceptance_criteria>
- `grep '<failBuildOnCVSS>7</failBuildOnCVSS>' backend/pom.xml` returns 1 match.
</acceptance_criteria>

### Task 5: Run Static Analysis & Remediation
<read_first>
- backend/pom.xml
</read_first>
<action>
Run `mvn dependency-check:check` inside the `backend` directory.
If any vulnerabilities are found, update the affected dependencies in `pom.xml` to patched versions or add suppression files if they are false positives. Ensure the final `pom.xml` and any suppression XML files are committed.
</action>
<acceptance_criteria>
- `grep 'failBuildOnCVSS' backend/pom.xml` returns 1 match.
- `cd backend && mvn dependency-check:check` executes without failure (exit code 0).
</acceptance_criteria>
