# Phase 31 Research: Hardening e Segurança Avançada (OWASP Deep Dive)

## Overview
This phase aims to implement advanced security measures, specifically fine-tuning rate limiting, adding strict HTTP security headers, and configuring automated vulnerability scanning via Maven OWASP Dependency Check.

## 1. Rate Limiting Implementation
**Current State:**
- The dependency `bucket4j-core` (v8.10.1) is **already present** in `backend/pom.xml`.
- The interceptor `RateLimitInterceptor.java` is **already implemented** and registered via `WebMvcConfig.java` to intercept `/api/**`.
- **The Gap:** The current limits are intentionally set very high for migration purposes:
  - Logged-in users (Bearer token): 5000 requests / minute.
  - Anonymous users (IP): 7 requests / minute.
- **Action Required:**
  - Adjust these limits to production-ready values (e.g., 60-100 requests/minute for users).
  - Consider adding specific granular limits for sensitive endpoints like `/api/auth/**` to prevent brute-force attacks.

## 2. Security Headers (XSS, Clickjacking)
**Current State:**
- `SecurityConfig.java` already defines a `.headers()` configuration block.
- It includes a `Content-Security-Policy` (CSP) and `Strict-Transport-Security` (HSTS).
- **The Gap:**
  - The `X-Frame-Options` header is missing. The context explicitly requires `X-Frame-Options (DENY/SAMEORIGIN)`.
- **Action Required:**
  - Add `.frameOptions(frameOptions -> frameOptions.deny())` (or `sameOrigin()`) inside the `.headers()` configuration in `SecurityConfig.java`.

## 3. Vulnerability Scanning
**Current State:**
- The `dependency-check-maven` plugin (v10.0.3) is **already configured** in `backend/pom.xml`.
- **The Gap:** It is not configured to fail the build based on CVSS scores.
- **Action Required:**
  - Update the plugin configuration in `backend/pom.xml` to include `<configuration><failBuildOnCVSS>7</failBuildOnCVSS></configuration>` so that the build fails on High/Critical vulnerabilities (CVSS >= 7).

## 4. CSRF Fine-Tuning
**Current State:**
- `SecurityConfig.java` disables CSRF for all API endpoints: `.ignoringRequestMatchers("/api/**")`.
- **Consideration:** Since the application relies on stateless JWT authentication (`SessionCreationPolicy.STATELESS`), disabling CSRF is standard and secure. No changes needed here unless specific stateful mechanisms are introduced.

## Summary for Planner
The PLAN must focus on **refining and strictly enforcing** existing configurations rather than building them from scratch:
1. Tune `RateLimitInterceptor` limits.
2. Add `X-Frame-Options` to `SecurityConfig`.
3. Add `failBuildOnCVSS` to the OWASP plugin in `pom.xml`.
