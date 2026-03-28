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

| Layer       | Technology                                                                    |
|-------------|-------------------------------------------------------------------------------|
| Backend     | Java 17+, Spring Boot 3.2.x, Spring Data MongoDB, Spring Security, JWT, Maven |
| Frontend    | Angular 17+ (standalone), TypeScript, RxJS, Angular CLI, CSS (custom)         |
| Database    | MongoDB Atlas (or local MongoDB)                                              |
| Container   | Docker + Docker Compose (optional)                                            |
| Cloud       | Azure (bonus)                                                                 |
| Testing     | JUnit, MockMvc (backend); Jasmine/Karma (frontend)                            |

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
- Model classes: `User`, `EventService`, `Comment` (MongoDB documents).
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
5. Create models (interfaces) for `User`, `EventService`, `Comment`.
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

```
├── frontend/                          # Angular standalone frontend
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.html
│   │   ├── main.ts
│   │   ├── styles.css                 # Global styles (reset, variables, components)
│   │   └── app/
│   │       ├── app.component.ts
│   │       ├── app.component.html
│   │       ├── app.component.css      # Navbar styles
│   │       ├── app.config.ts          # ProvideHttpClient, interceptors, router
│   │       ├── app.routes.ts          # Routing table (lazy loading)
│   │       ├── core/
│   │       │   ├── guards/
│   │       │   │   ├── auth.guard.ts
│   │       │   │   └── logged-in.guard.ts
│   │       │   ├── interceptors/
│   │       │   │   └── auth.interceptor.ts
│   │       │   └── services/
│   │       │       ├── auth.service.ts
│   │       │       └── event.service.ts
│   │       ├── shared/
│   │       │   ├── components/
│   │       │   │   └── event-card/
│   │       │   │       ├── event-card.component.ts
│   │       │   │       ├── event-card.component.html
│   │       │   │       └── event-card.component.css
│   │       │   ├── models/
│   │       │   │   ├── user.ts
│   │       │   │   ├── event.ts
│   │       │   │   └── comment.ts
│   │       │   └── pipes/            # (optional, empty)
│   │       └── features/
│   │           ├── event/
│   │           │   ├── event-catalog/
│   │           │   │   ├── event-catalog.component.ts
│   │           │   │   ├── event-catalog.component.html
│   │           │   │   └── event-catalog.component.css
│   │           │   ├── event-details/
│   │           │   │   ├── event-details.component.ts
│   │           │   │   ├── event-details.component.html
│   │           │   │   └── event-details.component.css
│   │           │   ├── event-create/
│   │           │   │   ├── event-create.component.ts
│   │           │   │   ├── event-create.component.html
│   │           │   │   └── event-create.component.css
│   │           │   └── event-edit/
│   │           │       ├── event-edit.component.ts
│   │           │       ├── event-edit.component.html
│   │           │       └── event-edit.component.css
│   │           └── user/
│   │               ├── login/
│   │               │   ├── login.component.ts
│   │               │   ├── login.component.html
│   │               │   └── login.component.css
│   │               ├── register/
│   │               │   ├── register.component.ts
│   │               │   ├── register.component.html
│   │               │   └── register.component.css
│   │               ├── profile/
│   │               │   ├── profile.component.ts
│   │               │   ├── profile.component.html
│   │               │   └── profile.component.css
│   │               └── my-events/
│   │                   ├── my-events.component.ts
│   │                   ├── my-events.component.html
│   │                   └── my-events.component.css
│   └── node_modules/                  # Ignored
└── ... (other root files)
```


**Current Status:** Folder structure defined, HTML and CSS templates prepared. Implementation of services and components is ongoing.

---

### Phase 3: Private Features & User Area (Planned)

**Goal:** Implement user dashboard, event creation/editing, profile settings.

**Tasks:**
1. Build `MyEventsComponent`:
    - Two tabs (or sections): events created by user, events user is attending.
    - For created events, show edit/delete buttons.
    - For attending events, show “Cancel RSVP” button.
2. Implement `CreateEventComponent` and `EditEventComponent` (reuse a shared form):
    - Reactive form with validation.
    - Date/time picker.
    - Submit to `EventService`.
3. Add `ProfileSettingsComponent`:
    - Form to update name, email (and optionally password).
4. Ensure interceptors attach JWT token to every request.
5. Handle errors with toast notifications or inline messages.
6. Add loading spinners for async operations.

---

### Phase 4: Polish & Testing (Planned)

**Goal:** Enhance UX, add animations, write tests, ensure responsiveness.

**Tasks:**
1. Finalise UI/UX:
    - Add hover/active states, transition animations.
    - Use Angular animations for RSVP toggle (bonus).
    - Ensure accessibility (ARIA labels, focus management).
2. Make the application fully responsive (mobile, tablet, desktop) using CSS Grid/Flexbox and media queries (already covered by global styles).
3. Write unit tests for critical components:
    - `EventDetailsComponent` (bonus).
    - `EventService` (mock HTTP requests).
4. Perform end‑to‑end testing manually (or with Cypress).
5. Add `README.md` documentation for the project (how to run backend and frontend, architecture).

---

### Phase 5: Bonus Features & Deployment (Optional)

**Tasks:**
1. **Deploy to Azure**:
    - Backend as Azure App Service or container.
    - Frontend as Azure Static Web App.
2. **Google Drive API integration**:
    - Add file upload field when creating/editing event.
    - Store file in Google Drive and save the public link.
3. **Geolocation**:
    - Add a “Nearby Events” button.
    - Use HTML5 Geolocation to get user coordinates.
    - Filter events based on distance (requires storing lat/lon in EventService document).
4. **NgRx**:
    - Replace simple service state with NgRx for RSVP status management.
5. **Docker**:
    - Create `Dockerfile` for backend and frontend.
    - Use `docker-compose.yml` to run both services with a local MongoDB (optional).

---

## 4. Backend Structure (for Reference)

```
backend/
├── pom.xml
├── src/
│ └── main/
│ ├── java/com/eventhub/
│ │ ├── EventHubApplication.java
│ │ ├── controller/
│ │ │ ├── AuthController.java
│ │ │ └── EventController.java
│ │ ├── dto/
│ │ │ ├── AuthRequest.java
│ │ │ ├── RegisterRequest.java
│ │ │ ├── EventRequest.java
│ │ │ ├── EventResponse.java
│ │ │ ├── UserDto.java
│ │ │ └── CommentDto.java
│ │ ├── model/
│ │ │ ├── User.java
│ │ │ ├── EventService.java
│ │ │ └── Comment.java
│ │ ├── repository/
│ │ │ ├── UserRepository.java
│ │ │ ├── EventRepository.java
│ │ │ └── CommentRepository.java
│ │ ├── security/
│ │ │ ├── JwtUtil.java
│ │ │ ├── JwtAuthenticationFilter.java
│ │ │ ├── SecurityConfig.java
│ │ │ └── UserDetailsServiceImpl.java
│ │ └── service/
│ │ ├── AuthService.java
│ │ └── EventService.java
│ └── resources/
│ └── application.properties
└── target/
```

---

## 5. Running the Full Stack

### Backend
```bash
cd backend
export MONGODB_USERNAME=your_user
export MONGODB_PASSWORD=your_pass
./mvnw spring-boot:run
```
### Frontend
``` bash
cd frontend
npm install
ng serve
```

- Backend runs on http://localhost:3000
- Frontend runs on http://localhost:4200

---

### 6. API Endpoints Summary

| Method | Endpoint                   | Description                 | AuthService |
|--------|----------------------------|-----------------------------|------|
| POST   | /api/auth/register         | Register a new user         | No   |
| POST   | /api/auth/login            | Login – returns JWT token   | No   |
| GET    | /api/events                | List all events (paginated) | No   |
| GET    | /api/events/{id}           | Get event details           | No   |
| POST   | /api/events                | Create a new event          | Yes  |
| PUT    | /api/events/{id}           | Update an event             | Yes  |
| DELETE | /api/events/{id}           | Delete an event             | Yes  |
| POST   | /api/events/{id}/rsvp      | Toggle RSVP status          | Yes  |
| GET    | /api/events/user/created   | Events created by the user  | Yes  |
| GET    | /api/events/user/attending | Events the user attends     | Yes  |

---

Document version: 3.0
Last updated: 2026-03-27