# EventHub Development Roadmap

## 1. Project Overview

EventHub is a full‑stack web application where users can discover local events, RSVP, and create their own events.  
The platform consists of:

- **Backend**: Spring Boot (Java) providing a REST API with JWT authentication and MongoDB as the database.
- **Frontend**: Angular 17+ (standalone components) consuming the API.
- **Database**: MongoDB Atlas (or local MongoDB) – data is stored in JSON‑like documents.

The application meets all requirements described in `project_requirements.pdf` and follows the UI/UX best practices from `best_practice.pdf`. The static prototype `resourses.html` serves as a visual reference.

---

## 2. Technology Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Backend     | Java 17+, Spring Boot 3.2.x, Spring Data MongoDB, Spring Security, JWT, Maven |
| Frontend    | Angular 17+ (standalone), TypeScript, RxJS, Angular CLI, CSS (custom) |
| Database    | MongoDB Atlas (or local MongoDB)    |
| Container   | Docker + Docker Compose (optional)  |
| Cloud       | Azure (bonus)                       |
| Testing     | JUnit, MockMvc (backend); Jasmine/Karma (frontend) |

---

## 3. Development Phases

### Phase 1: Backend Core & Authentication (Completed)

**Goal:** Set up Spring Boot project, define MongoDB documents, implement JWT authentication and basic CRUD for events.

**Actual Implementation:**
- **MongoDB Documents** (models) with `@Document` and `@DBRef` for relationships.
- **Repositories** extend `MongoRepository`.
- **JWT authentication** with `JwtUtil`, `JwtAuthenticationFilter`, `UserDetailsServiceImpl`, and `SecurityConfig`.
- **REST Controllers**:
    - `AuthController` (`/api/auth/register`, `/api/auth/login`)
    - `EventController` with endpoints:
        - `GET /api/events` – public, paginated
        - `GET /api/events/{id}` – public
        - `POST /api/events` – protected (create)
        - `PUT /api/events/{id}` – protected (update only if organiser)
        - `DELETE /api/events/{id}` – protected (delete only if organiser)
        - `POST /api/events/{id}/rsvp` – protected (toggle RSVP)
        - `GET /api/events/user/created` – protected (user’s created events)
        - `GET /api/events/user/attending` – protected (user’s attending events)
- **CORS** configured for Angular (http://localhost:4200).
- **Environment variables** used for MongoDB credentials (`MONGODB_USERNAME`, `MONGODB_PASSWORD`) and JWT secret.
- **Unit tests** (basic) – can be expanded.

**Key Files:**
- `pom.xml` – includes Spring Data MongoDB, Spring Security, JJWT.
- `src/main/resources/application.properties` – database URI, JWT secret.
- Model classes: `User`, `Event`, `Comment` (MongoDB documents).
- Repositories, DTOs, services, security configuration.

**Current Status:** Backend is up and running on port 3000, connected to MongoDB Atlas.

---

### Phase 2: Frontend Foundation & Public Pages (In Progress)

**Goal:** Create Angular 17+ standalone project, routing, services, and implement public views (catalog, details).

**Tasks to complete:**
1. Generate Angular project with `--standalone` flag.
2. Set up folder structure (as below).
3. Implement core services:
    - `AuthService` (register, login, token storage, user state)
    - `EventService` (all CRUD operations, RSVP, comments)
4. Implement functional route guards:
    - `authGuard` – protects private routes.
    - `loggedInGuard` – prevents authenticated users from accessing login/register.
5. Create models (interfaces) for `User`, `Event`, `Comment`.
6. Build shared components:
    - `EventCardComponent` (reusable card for events)
    - `CommentListComponent` (optional)
7. Build public pages:
    - `LoginComponent` and `RegisterComponent` with forms.
    - `EventCatalogComponent` (lists events, search/filter, pagination) – includes hero section, upcoming events horizontal scroll.
    - `EventDetailsComponent` (full details, RSVP, comments).
8. Apply styling from `resourses.html` using global CSS (`src/styles.css`) and component-specific CSS.
9. Use RxJS operators: `debounceTime` for search, `catchError` for error handling.
10. Use Angular lifecycle hooks: `ngOnChanges` for filter changes (or use signals).
11. Add pipe: `async` for observables, `date` for event dates.

**Folder Structure (standalone):**