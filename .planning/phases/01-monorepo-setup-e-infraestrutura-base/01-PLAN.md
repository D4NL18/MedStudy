---
wave: 1
depends_on: []
files_modified:
  - docker-compose.yml
  - .gitignore
  - README.md
  - .env.example
  - frontend/.nvmrc
  - frontend/package.json
  - backend/pom.xml
  - backend/src/main/resources/application.yml
  - backend/src/main/resources/application-dev.yml
  - backend/src/main/resources/application-test.yml
autonomous: true
---

# Plan 1: Monorepo Setup & Infraestrutura Base

<task>
<description>Criar arquivos base do monorepo e infraestrutura de banco de dados (PostgreSQL).</description>
<read_first>
- .planning/phases/01-monorepo-setup-e-infraestrutura-base/01-CONTEXT.md
- .planning/ROADMAP.md
</read_first>
<action>
1. Create a `docker-compose.yml` in the root directory for PostgreSQL 16. Include a postgres service with `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` mapped from environment variables. Set port mapping to `5432:5432` and use a named volume for data persistence.
2. Create `.env.example` with placeholders for `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, and `JWT_SECRET`.
3. Create a root `.gitignore` that ignores `.env`, `node_modules/`, `target/`, `dist/`, `.idea/`, `.vscode/`, etc.
4. Update `README.md` with basic setup instructions (how to run docker-compose, how to run backend and frontend).
</action>
<acceptance_criteria>
- `docker-compose.yml` contains `image: postgres:16`
- `.env.example` contains `DB_USER=` and `JWT_SECRET=`
- `.gitignore` contains `.env`
</acceptance_criteria>
</task>

<task>
<description>Inicializar o projeto frontend em Angular 18 e fixar a versão do Node.js.</description>
<read_first>
- .planning/phases/01-monorepo-setup-e-infraestrutura-base/01-CONTEXT.md
</read_first>
<action>
1. Run `npx -y @angular/cli@18 new frontend --directory=frontend --routing=true --style=scss --standalone=true --skip-git=true --package-manager=npm`
2. Create `frontend/.nvmrc` containing the exact string `22` (for Node 22 LTS).
3. Ensure the Angular project uses `npm` as per the package manager setting.
</action>
<acceptance_criteria>
- `frontend/package.json` exists and includes Angular 18 dependencies.
- `frontend/.nvmrc` exists and contains `22`.
- `frontend/src/main.ts` exists.
</acceptance_criteria>
</task>

<task>
<description>Inicializar o projeto backend Spring Boot 3 e configurar Maven Enforcer e Profiles.</description>
<read_first>
- .planning/phases/01-monorepo-setup-e-infraestrutura-base/01-CONTEXT.md
</read_first>
<action>
1. Create a Spring Boot 3.2+ project in `backend/` (Java 21, Maven wrapper) with dependencies: `web`, `data-jpa`, `postgresql`, `security`, `validation`, `flyway` using Spring Initializr API or standard structure. Package name: `com.medstudy`.
2. Add MapStruct and OpenAPI (springdoc-openapi-starter-webmvc-ui) dependencies to `backend/pom.xml`.
3. Configure `maven-enforcer-plugin` in `pom.xml` under `<build><plugins>` to enforce `<requireJavaVersion><version>[21,)</version></requireJavaVersion>`.
4. Set up `application.yml`, `application-dev.yml`, and `application-test.yml` in `backend/src/main/resources/`.
5. In `application.yml`, set active profile to `${SPRING_PROFILES_ACTIVE:dev}` and configure `spring.datasource.url` to read `DB_NAME`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` from environment variables, defaulting to placeholders if necessary.
</action>
<acceptance_criteria>
- `backend/pom.xml` contains `maven-enforcer-plugin` checking for Java 21.
- `backend/pom.xml` contains `spring-boot-starter-data-jpa` and `springdoc-openapi-starter-webmvc-ui`.
- `backend/src/main/resources/application.yml` contains `spring.datasource.url`.
- `backend/mvnw` exists.
</acceptance_criteria>
</task>

## Verification Criteria
- [ ] `docker-compose up -d` starts PostgreSQL successfully.
- [ ] `cd frontend && nvm use && npm install` succeeds.
- [ ] `cd backend && ./mvnw clean install` builds successfully without Enforcer errors (assuming Java 21 is used).
- [ ] Requirements INFR-01, INFR-02, INFR-05, INFR-06 are fully addressed.
