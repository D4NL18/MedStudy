# Phase 14: Security Hardening & OWASP Audit - Pattern Map

## Overview
Mapeamento de arquivos análogos e padrões existentes para orientar a implementação das medidas de segurança.

---

## 1. Backend Security Configuration
- **Analog File**: `backend/src/main/java/com/medstudy/backend/core/config/SecurityConfig.java`
- **Pattern**: `SecurityFilterChain` bean com DSL do Spring Security 6.
- **Excerpt**:
  ```java
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
      http
          .csrf(AbstractHttpConfigurer::disable)
          .cors(cors -> cors.configurationSource(corsConfigurationSource()))
          // ...
  ```

## 2. JWT Extraction & Authentication
- **Analog File**: `backend/src/main/java/com/medstudy/backend/core/security/JwtAuthenticationFilter.java`
- **Pattern**: Filtro que estende `OncePerRequestFilter` e extrai o token do header.
- **Excerpt**:
  ```java
  final String authHeader = request.getHeader("Authorization");
  if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
  }
  jwt = authHeader.substring(7);
  ```

## 3. Auth Controller (Token Delivery)
- **Analog File**: `backend/src/main/java/com/medstudy/backend/modules/auth/controller/AuthController.java`
- **Pattern**: Retorno de DTO com o token.
- **Excerpt**:
  ```java
  return ResponseEntity.ok(authService.login(request));
  ```

## 4. Frontend Auth Interceptor
- **Analog File**: `frontend/src/app/core/interceptors/auth.interceptor.ts`
- **Pattern**: Interceptor Angular que injeta o token do `localStorage`.
- **Excerpt**:
  ```java
  const token = localStorage.getItem('access_token');
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }
  ```

## 5. Logging Configuration
- **Analog File**: `backend/src/main/resources/logback-spring.xml`
- **Pattern**: Configuração XML do Logback com appenders para console e arquivo.
- **Excerpt**:
  ```xml
  <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
      <encoder>
          <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
      </encoder>
  </appender>
  ```

---
*Pattern Mapping Complete: 2026-05-11*
