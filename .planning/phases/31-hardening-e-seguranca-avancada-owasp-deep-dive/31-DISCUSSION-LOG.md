# Discussion Log: Phase 31

## Q1: Como você prefere implementar o Rate Limiting para proteger a API contra abusos?
- [x] (Recommended) Implement Bucket4j with in-memory caching for API endpoints (easy, no external dependencies).
- [ ] Implement rate limiting using Redis (better for horizontal scaling, requires Redis setup).
- [ ] Basic Spring AOP custom rate limiter (simplest, but less robust).

## Q2: Como devemos lidar com a injeção de Headers de Segurança (proteção contra XSS, Clickjacking, etc)?
- [x] (Recommended) Configure strict security headers in Spring Security (Content-Security-Policy, X-Frame-Options, HSTS).
- [ ] Only configure basic standard headers (X-XSS-Protection, X-Frame-Options).
- [ ] Handle headers on the frontend/proxy side (e.g., Nginx), leave backend as is.

## Q3: Deseja adicionar verificação automatizada de vulnerabilidades nas dependências (OWASP Dependency Check)?
- [x] (Recommended) Add OWASP Dependency Check plugin to pom.xml to fail builds on Critical/High vulnerabilities.
- [ ] Do not add automated dependency checks at this phase.
