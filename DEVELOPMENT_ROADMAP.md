# EventHub Development Roadmap

## 1. Project Overview

EventHub is a full‑stack web application where users can discover local events, RSVP, and create their own events.  
The platform consists of:

- **Backend**: Spring Boot (Java) providing a REST API with JWT authentication.
- **Frontend**: Angular (TypeScript) single‑page application consuming the API.
- **Database**: PostgreSQL (or MySQL) – managed via JPA/Hibernate.

The application must meet all requirements described in `project_requirements.pdf` and follow the UI/UX best practices from `best_practice.pdf`. The static prototype `resourses.html` serves as a visual reference.

---

## 2. Technology Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Backend     | Java 17+, Spring Boot 3.x, Spring Data JPA, Spring Security, JWT, Maven |
| Frontend    | Angular 17+, TypeScript, RxJS, Angular CLI, Bootstrap/Tailwind (optional) |
| Database    | PostgreSQL / MySQL                   |
| Container   | Docker + Docker Compose (optional)   |
| Cloud       | Azure (bonus)                        |
| Testing     | JUnit, MockMvc (backend); Jasmine/Karma (frontend) |

---

## 3. Development Phases

We will organise the work into five logical phases (sprints). Each phase delivers a working increment.

### Phase 1: Backend Core & Authentication (3–4 days)

**Goal:** Set up Spring Boot project, define data models, implement JWT authentication and basic CRUD for events.

- **Tasks:**
    1. Create Spring Boot project with dependencies: Web, Data JPA, Security, PostgreSQL, JWT.
    2. Define JPA entities:
        - `User` (id, name, email, password, profileSettings)
        - `Event` (id, title, description, dateTime, location, category, organiser, attendees, comments)
        - `Comment` (id, text, author, event, timestamp)
    3. Create repositories (Spring Data JPA) for each entity.
    4. Implement JWT authentication:
        - `AuthController` with `/api/auth/register` and `/api/auth/login`.
        - `UserDetailsService`, `JwtAuthenticationFilter`, and utility classes.
    5. Implement `EventController`:
        - `GET /api/events` – public, with optional filters (date, category) and pagination.
        - `GET /api/events/{id}` – public.
        - `POST /api/events` – protected, create event.
        - `PUT /api/events/{id}` – protected, update only if user is organiser.
        - `DELETE /api/events/{id}` – protected, delete only if user is organiser.
    6. Add endpoint `POST /api/events/{id}/rsvp` to toggle RSVP status.
    7. Add endpoint `POST /api/events/{id}/comments` to add a comment.
    8. Add endpoints for user‑specific data:
        - `GET /api/users/me/events` – events created by logged‑in user.
        - `GET /api/users/me/attending` – events the user is attending.
    9. Configure CORS to allow Angular development server.
    10. Write unit tests for repositories and controllers (bonus).

### Phase 2: Frontend Foundation & Public Pages (3–4 days)

**Goal:** Create Angular project, routing, services, and implement public views (catalog, details).

- **Tasks:**
    1. Generate Angular project using Angular CLI.
    2. Set up folder structure:
        - `core/` – auth service, guards, interceptors.
        - `shared/` – reusable components (event card, comment form, filter bar).
        - `features/event/` – event catalog, details, create/edit components.
        - `features/user/` – login, register, profile, my‑events.
    3. Implement routing with routes:
        - `/events` – catalog
        - `/events/:id` – details (parameter)
        - `/my-events` – protected
        - `/events/create` – protected
        - `/events/edit/:id` – protected
        - `/login`, `/register` – public (redirect if logged in)
    4. Create route guards:
        - `AuthGuard` – redirect to login if not authenticated.
        - `LoggedInGuard` – redirect to home if already logged in.
    5. Implement `AuthService` with login/register methods, store JWT in localStorage, and expose user state via `BehaviorSubject`.
    6. Implement `EventService` with methods to fetch events, event by id, create, update, delete, RSVP, add comment.
    7. Build `EventCatalogComponent`:
        - Display list of events using `EventCardComponent`.
        - Add search input with `debounceTime` to filter events (client‑side or via API).
        - Add filter chips (date, category) – use `ngOnChanges` to react to filter changes.
    8. Build `EventDetailsComponent`:
        - Fetch event by id from route parameter.
        - Show details, attendee list, RSVP count.
        - Display comments and allow logged‑in users to add comments.
        - RSVP button toggles status.
    9. Apply styling using the color palette from the prototype (calm blue primary, orange accent). Use external CSS with BEM naming.

### Phase 3: Private Features & User Area (3–4 days)

**Goal:** Implement user dashboard, event creation/editing, profile settings.

- **Tasks:**
    1. Build `MyEventsComponent`:
        - Show two lists: events created by the user, events the user is attending.
        - For created events, provide edit/delete icons (only visible to organiser).
        - For attending events, show a “Cancel RSVP” option.
    2. Implement `CreateEventComponent` and `EditEventComponent` (reuse a shared form component):
        - Form with fields: title, description, date/time, location, category, image URL (optional).
        - Validation with error messages.
        - On submit, call `EventService` create/update.
    3. Add `ProfileSettingsComponent`:
        - Form to update name, email, profile picture (optional).
    4. Add interceptors to attach JWT token to every request.
    5. Implement error handling: show toast notifications or inline messages for API errors.
    6. Use RxJS `catchError` in services to handle failures gracefully.
    7. Add loading spinners during API calls.

### Phase 4: Polish & Testing (2–3 days)

**Goal:** Enhance UX, add animations, write tests, ensure responsiveness.

- **Tasks:**
    1. Finalise UI/UX:
        - Ensure all interactive elements (RSVP button, form inputs) have visual feedback.
        - Add animations for RSVP toggle (Angular animations bonus).
        - Ensure whitespace, readability, and accessibility.
    2. Make the application fully responsive (mobile, tablet, desktop) using CSS Grid/Flexbox and media queries.
    3. Write unit tests for critical components:
        - `EventDetailsComponent` – bonus.
        - `EventService` – mock HTTP requests.
    4. Perform end‑to‑end testing manually or with Cypress (optional).
    5. Add `README.md` documentation:
        - How to run backend and frontend.
        - Brief architecture description.
        - List of used frameworks/libraries.

### Phase 5: Bonus Features & Deployment (optional, time‑permitting)

- **Tasks:**
    1. **Deploy to Azure**:
        - Backend as Azure App Service (or container).
        - Frontend as Azure Static Web App.
    2. **Google Drive API integration**:
        - Add file upload field when creating/editing event.
        - Store file in Google Drive and save the public link.
    3. **Geolocation**:
        - Add a “Nearby Events” button.
        - Use HTML5 Geolocation to get user coordinates.
        - Filter events based on distance (requires storing lat/lon in Event).
    4. **NgRx**:
        - Replace simple service state with NgRx for RSVP status management.
    5. **Docker**:
        - Create `Dockerfile` for backend and frontend.
        - Use `docker-compose.yml` to run both services with a database.

---

## 4. Development Guidelines

### Code Quality

- **Backend**:
    - Use meaningful package structure (`controller`, `service`, `repository`, `model`, `security`, `dto`).
    - Always use DTOs for request/response – never expose entities directly.
    - Write unit tests for all services and controllers.
- **Frontend**:
    - Use TypeScript with strict typing – avoid `any`.
    - Follow Angular style guide.
    - Use reactive forms for complex forms.
    - Keep components lean – move business logic to services.
- **Version Control**:
    - Commit frequently with descriptive messages.
    - Use feature branches and pull requests if multiple developers.

### API Design

All endpoints should be prefixed with `/api`.  
Example responses:

```json
{
  "id": 1,
  "title": "Jazz in the Park",
  "dateTime": "2026-04-15T18:00:00",
  "location": "Central Park",
  "category": "Music",
  "organiser": { "id": 2, "name": "John Doe" },
  "attendeeCount": 24,
  "comments": [ ... ]
}