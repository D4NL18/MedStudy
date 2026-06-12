# MedStudy — Medical Studies Platform

🌐 **Languages/Idiomas:** 🇺🇸 [English](./README-en.md) | 🇧🇷 [Português](./README.md)

🚀 **Production Access:** [https://medstudy-497617.web.app/login](https://medstudy-497617.web.app/login)

![Performance Dashboard](./docs/assets/dashboard_dark.png)

> **Core Value:** MedStudy is an innovative and modern platform designed specifically for doctors and medical students to optimize their preparation for residency and board certification exams. Through focused study sessions, real-time performance analysis, retention intelligence (spaced repetition), and competitive engagement, the student's journey becomes much more fluid and assertive.

---

## ✨ System Modules and Features

The system was designed with a modular architecture, where each screen solves a specific pain point in the student's preparation:

### 📊 Dashboard and Overview
The control center of your performance.
- **Real-Time KPIs:** Immediately track your overall accuracy rate, streak evolution, and study volume.
- **Monthly Evolution:** Interactive charts to identify peaks and valleys in your journey.
- **Critical Topics:** Surgical identification of the "Topics with the Highest Error Rate" in a Top 10 format, so you can focus on what matters most.
- **Achievements and Gamification:** Exclusive badges for engagement and perfection, keeping motivation high.

### 📂 Study Sessions Database
Your training arsenal.
- **Advanced Filters:** Cross-reference Broad Area, Institution, Topic, and Subtopic with just two clicks.
- **Optimized Resolution:** Immersive resolution interface with commented answers on the spot, instant hit/miss visual feedback, and a design focused on content absorption.
- **Question Statistics:** See the overall accuracy percentage of other students to understand the question's difficulty level.

![Database](./docs/assets/banco_dados_dark.png)

### 📝 Simulations (Mock Exams)
Endurance testing in exam mode.
- Simulate real residency exam conditions with timed sessions.
- Post-exam reviews with detailed performance analysis by subject.

![Simulations](./docs/assets/simulados_dark.png)

### 📖 Lesson Plan
Strategic tracker for theoretical content.
- **Smart Prioritization:** Classify topics by priority (Diamond, High, Medium, Low) to guide your studies.
- **Comprehensive Filters:** Filter by area, status, reinforcement, and priority.
- **Accuracy Tracking:** Link each lesson to your practical performance in questions.

![Lesson Plan](./docs/assets/aulas_dark.png)

### 🔁 Spaced Repetition (Interval Review)
Performance-based spaced repetition system.
- **Automatic Scheduling:** The system schedules reviews based on your performance, prioritizing what you forget the most.
- **Today's View:** See exactly what you need to review now, what's delayed, and what's coming next.
- **105+ Reviews Completed:** Complete history of engagement with the material.

![Spaced Repetition](./docs/assets/revisao_intervalada_dark.png)

### 🧠 Flashcards & Spaced Revision (Active Recall)
Where long-term retention happens.
- **Scheduling Algorithm:** Evaluate the difficulty when flipping the card (Easy, Medium, Hard). The system schedules the next appearance using forgetting curves.
- **Effortless Creation:** Quickly add flashcards from anywhere, with tag support.
- **Focused Sessions:** Study only "Today's Cards", keeping the queue up to date with maximum time efficiency.

![Flashcards](./docs/assets/flashcards_dark.png)

### 👥 Social Panel & Connections
Where the community drives performance.
- **Activity Feed:** Track your peers' achievements and studies in real-time.
- **Student Network:** Add friends, manage requests, and search for students by name.
- **Social Reactions:** Congratulate and motivate peers directly in the feed.

![Social Panel](./docs/assets/social_dark.png)

### 🏆 Competitions & Duels
For those who love the energy of healthy competition.
- **1v1 Duels:** Challenge a peer directly.
- **Groups and Leagues:** Participate in group rankings, track real-time scoreboards, and encourage your peers to study more.
- **Challenge Podium:** View the final ranking of each competition with accumulated scores.

![Competitions and Duels](./docs/assets/competicoes_dark.png)

### 📈 Area Analysis
Analytical intelligence about your performance by specialty.
- **Bar Chart by Broad Area:** Visually compare your accuracy rate across Surgery, Internal Medicine, Gynecology, Pediatrics, and more.
- **Performance Cards:** See answered questions, accuracy %, and comparative vs. average by area.
- **Drill-down to Questions:** Click on an area to directly filter the question bank.

![Area Analysis](./docs/assets/analise_area_dark.png)

### 🎨 Dynamic Design System (Themes)
Your environment, your rules.
- Choose between **8 exclusive color themes** (Pink, Light, Dark, Green, Blue, etc.).
- Native support for Light/Dark Mode integrated into each palette.
- Premium *Glassmorphism* aesthetics across all cards and modals.

---

## 🏗️ Architecture and Business Domains

The project architecture adopts a modular Domain-Driven approach. Each backend module is mirrored by autonomous components in the frontend:

### 🔐 Identity and Access Management (`auth`, `user`, `profile`)
- **Secure Authentication**: JWT via `HttpOnly` cookies to mitigate XSS attacks.
- **Abuse Prevention**: Temporary block after failed login attempts (`LoginAttemptService`).
- **Prolonged Sessions**: *Refresh Token* rotation to maintain the session without compromising security.

### 🧪 Assessments and Simulations (`simulado`)
- **Dynamic Generation**: Simulations by institution, broad area, and subtopic filters.
- **Real-time Auto-correction**: Submissions feed back into the student's overall statistics.

### 🧠 Active Recall and Spaced Repetition (`flashcard`, `revision`)
- **Algorithmic Scheduling**: `SpacedRepetitionService` calculates the next review based on feedback (Easy/Medium/Hard), shortening intervals for mistakes and expanding for correct answers.
- **Daily Review Queue**: Only cards with expired maturation are presented.

### 📊 Telemetry and Study Habits (`sessao`, `aula`)
- **Session Tracking**: Validates and counts active study time, feeding the consistency (streak) calculation.
- **Progress Control**: View checkpoints prevent context loss.

### 📈 Data Intelligence (`analytics`, `dashboard`)
- **Analytical Aggregation**: `AnalyticsService` processes asynchronous data from sessions, simulations, and reviews to plot monthly evolution charts and calculate Streaks.

### 🏆 Engagement, Gamification and Social (`feed`, `friendship`, `competition`)
- **Achievement Distribution**: `BadgeSchedulerService` periodically audits milestones (e.g., "7 days in a row", "100 correct answers in Surgery").
- **Real-time Feed**: SSE (Server-Sent Events) for immediate updates of friends' achievements.
- **Ranked Competitions**: Scores updated in batches based on specific criteria per specialty.

### 🌐 API Endpoints

| Group | Prefix |
|---|---|
| Security & Identity | `/api/auth`, `/api/profiles` |
| Metrics & Dashboard | `/api/dashboard`, `/api/analytics` |
| Educational Content | `/api/lessons`, `/api/study-sessions` |
| Academic Practice | `/api/simulados`, `/api/flashcards`, `/api/revisoes` |
| Social & Feed | `/api/feed`, `/api/friendships`, `/api/notifications` |
| Gamification | `/api/competitions`, `/api/badges` |
| Utilities | `/api/export` (CSV/PDF) |

---

## 📐 Engineering Standards

### Strong Typing and Strict Contracts
- Prohibited use of `any` in TypeScript and omission of generic types in Java.
- Communication between layers mediated by **Interfaces** (Frontend) and **DTOs/Records** (Backend) — database entities are never directly exposed.

### Single Responsibility Principle (SRP)
- Components and Services with a single reason to change.
- Dependency injection via constructor in Spring Boot and Angular.

### Resilience and Error Handling
- *Fail-Fast*: validation at the system boundaries (`@Valid` in backend, Reactive Forms in frontend).
- `GlobalExceptionHandler` (`@ControllerAdvice`) ensures all errors follow a predictable contract.

---

## 🔄 Development Workflow

### Backend (Spring Boot)
1. **Entity** → `@Entity` in `modules/your_module/entity/`
2. **Repository** → `JpaRepository` in `.../repository/`
3. **DTOs** → `Records` in `.../dto/` — never send the entity back to the client
4. **Service** → `@Service` with all business logic — business rules **prohibited** in Controllers
5. **Controller** → `@RestController` with correct HTTP semantics
6. **Tests** → Mockito + `./mvnw test` (zero regression)

### Frontend (Angular 18)
1. **Interfaces** → Mirror backend DTOs in `/shared/models/`
2. **Services** → `@Injectable` in `/core/services/` with typed `Observable<T>`
3. **Pages** → `/features/your_module/pages/`
4. **Components** → `/features/your_module/components/` or `/shared/components/`
5. **Design System** → Inherit global CSS variables — hardcoded values will be rejected

### Pre-PR Checklist
- [ ] Jasmine/Karma tests passing (`npm test`)
- [ ] Manual smoke test at `http://localhost:4200`
- [ ] Zero regression in pre-existing flows

---

## 🛠️ Technology Stack

- **Frontend**: [Angular 18](https://angular.dev/) (Standalone Components, NgRx, RxJS, Signals)
- **Backend**: [Spring Boot 3](https://spring.io/projects/spring-boot) (Java 21, Spring Security, JPA)
- **Database**: [PostgreSQL 16](https://www.postgresql.org/)
- **Security and Performance**: Stateless authentication, resilient persistence, responsive layout in grid and flexbox.

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Docker and Docker Compose
- Node.js (LTS v22)
- Java 21

### 1. Prepare Environment
```bash
cp .env.example .env
docker-compose up -d
```

### 2. Start Backend
```bash
cd backend
./mvnw spring-boot:run
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run start
```

Access at: `http://localhost:4200`

---

## 📚 Complementary Documentation

- [**Security Policy**](./SECURITY.md): How to report vulnerabilities and hardening details.
- [**API Documentation**](http://localhost:8080/swagger-ui/index.html#/): Interactive Swagger/OpenAPI (requires backend running).
