# Phase 3 Research: Auth Backend (Spring Security 7 + JWT)

## Overview
Phase 3 focuses on implementing a secure authentication system using Spring Security 7 and JWT. This research covers the modern configuration patterns for Spring Boot 4.x, choice of libraries, and specific implementation details for progressive delay and refresh token rotation.

## 1. Spring Security 7 Configuration
Spring Security 7 (bundled with Spring Boot 4.0.6) mandates a lambda-based DSL for `HttpSecurity`.

### Key Changes:
- `authorizeRequests()` removed in favor of `authorizeHttpRequests()`.
- `.and()` chaining removed; everything must use lambdas.
- `SessionCreationPolicy.STATELESS` is critical for JWT.
- `BCryptPasswordEncoder` remains the standard for password hashing.

### Modern Filter Chain Pattern:
```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
        .build();
}
```

## 2. JWT Implementation
We will use **io.jsonwebtoken:jjwt-api:0.12.5** (and its impl/jackson artifacts). It is mature, supports modern Java versions, and has a clean API for building and parsing tokens.

### Token Strategy:
- **Access Token (JWT)**: Short-lived (15 min), signed with HS256 using a secret key from environment variables.
- **Refresh Token**: Long-lived (7 days), stored in the database, rotated on every use (one-time use).

## 3. Progressive Delay (Rate Limiting)
Instead of hard IP blocking (which can be bypassed by proxies or block legitimate users behind the same IP), we will implement a **Progressive Delay** on failed login attempts.

### Implementation Pattern:
1. Create an `AuthenticationFailureListener` or a filter.
2. Maintain a "failure count" (potentially in a cache like Caffeine or a simple Map for v1).
3. On failure: `Thread.sleep(Math.min(maxDelay, baseDelay * failureCount))`.
4. This effectively slows down brute-force attacks exponentially.

## 4. Mailtrap Integration
Spring Boot 4 maintains compatibility with `spring-boot-starter-mail`.

### Configuration in application.yml:
```yaml
spring:
  mail:
    host: sandbox.smtp.mailtrap.io
    port: 2525
    username: ${MAILTRAP_USER}
    password: ${MAILTRAP_PASS}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
```

## 5. User Roles & Authorities
For MedStudy v1, we will support two roles:
- `ROLE_USER`: Standard student access.
- `ROLE_ADMIN`: For future management features.

## 6. Password Complexity Validation
As decided, the password must satisfy:
- Min 8 characters.
- At least one uppercase letter.
- At least one lowercase letter.
- At least one digit.

Implementation: Regex in `@Pattern` annotation on `UserRequest` DTO.

## 7. Canonical References
- [Spring Security 7 Reference](https://docs.spring.io/spring-security/reference/index.html)
- [JJWT Documentation](https://github.com/jwtk/jjwt)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
