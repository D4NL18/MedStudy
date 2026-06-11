# Phase 31 Context: Hardening e Segurança Avançada (OWASP Deep Dive)

This document captures the implementation decisions for Phase 31.
Downstream agents (researcher, planner, executor) MUST follow these decisions.

## Domain
- Backend Security (Spring Security, Spring Boot)
- Build pipeline security (Maven OWASP Dependency Check)
- HTTP Security Headers

## Decisions

### 1. Rate Limiting Implementation
- **Decision:** Implement Bucket4j with in-memory caching for API endpoints.
- **Rationale:** Protects the API against abuse, brute-force attacks, and DDoS without introducing the complexity of external dependencies like Redis at this stage.

### 2. Security Headers (XSS, Clickjacking)
- **Decision:** Configure strict security headers in Spring Security.
- **Specifics:** Must include Content-Security-Policy (CSP), X-Frame-Options (DENY/SAMEORIGIN), and HSTS (Strict-Transport-Security).

### 3. Vulnerability Scanning
- **Decision:** Add OWASP Dependency Check plugin to `pom.xml`.
- **Specifics:** Configure the plugin to fail the build on Critical or High vulnerabilities.

## Out of Scope
- Changing the primary authentication mechanism (JWT will remain as is).
- Moving rate-limiting to an API Gateway (decided to keep it in-memory within Spring Boot for now).
