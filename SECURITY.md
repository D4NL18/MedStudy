# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within MedStudy, please do not open a public issue. Instead, report it directly to the project maintainer.

## Security Hardening (v1.0)

The MedStudy platform has been hardened following OWASP best practices:

- **Authentication**: Using secure HttpOnly, Secure, and SameSite=Strict cookies for JWT storage. No sensitive tokens are stored in `localStorage`.
- **CSRF Protection**: Double Submit Cookie pattern implemented.
- **Security Headers**: 
  - `Content-Security-Policy`: Default-src 'self'.
  - `Strict-Transport-Security`: HSTS enabled for 1 year.
  - `X-Frame-Options`: Deny.
  - `X-Content-Type-Options`: Nosniff.
- **Log Sanitization**: Global masking filter for sensitive fields (passwords, tokens, emails).
- **Dependency Audit**: Regular scans with `mvn dependency-check` and `npm audit`.

## Security Checklist for Deployment

- [ ] Ensure HTTPS is enabled (required for `Secure` cookies).
- [ ] Update `JWT_SECRET` in `.env` with a strong random key.
- [ ] Configure Rate Limiting on the `/api/auth/login` endpoint for production.
