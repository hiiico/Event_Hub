# EventHub Development Roadmap
---

## Documentation

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
---

## Project Overview

EventHub is a full‑stack web application for discovering and managing local events.
- **Backend**: Spring Boot 3.2, MongoDB Atlas, JWT authentication
- **Frontend**: Angular 17+ standalone, RxJS, responsive CSS
- **Deployment**: Azure App Service (backend) + Azure Storage static website (frontend)
---

## Technology Stack

| Layer     | Technology                                                                    |
|-----------|-------------------------------------------------------------------------------|
| Backend   | Java 17+, Spring Boot 3.2.x, Spring Data MongoDB, Spring Security, JWT, Maven |
| Frontend  | Angular 17+ (standalone), TypeScript, RxJS, Angular CLI, CSS (custom)         |
| Database  | MongoDB Atlas (or local MongoDB)                                              |
| Container | Docker + Docker Compose (optional)                                            |
| CI/CD     | GitHub Actions (backend JAR deployment)                                       |
| Hosting   | Azure App Service (backend), Azure Storage (frontend)                         |
---

## Development Phases

- [Project Board](https://github.com/users/hiiico/projects/14)

```mermaid
graph TD
A[Phase 1: Backend Core<br/>Spring Boot, MongoDB, JWT] --> B[Phase 2: Frontend Foundation<br/>Angular, Services, Public Pages];
B --> C[Phase 3: Private Features<br/>My Events, Create/Edit, Profile, RSVP];
C --> D[Phase 4: Polish & Geolocation<br/>Near you, Search/Filter, Route Guards];
D --> E[Phase 5: Azure Deployment<br/>Terraform, GitHub Actions, App Service + Storage];
```
---

## Sequence Diagrams

### User Registration (with NgRx)

What changed:

- `AuthService` now dispatches an action instead of calling the API directly.
- NgRx Effects handle the API call, success/failure actions, and the subsequent `loadUser` call.
- Store manages the state (user, token) and notifies the component via selectors.
- The final navigation is triggered by the component reacting to the `user$` observable (or a success action).

The same pattern applies to the Login, Register, Logout and Profile flows.

```mermaid
sequenceDiagram
    participant User
    participant Frontend (RegisterComponent)
    participant AuthService (facade)
    participant Store
    participant AuthEffects
    participant ApiService
    participant Backend as Backend (POST /api/auth/register)
    participant MongoDB

    User->>Frontend: Submit registration form
    Frontend->>AuthService: register(name, email, password)
    AuthService->>Store: dispatch(register action)
    Store->>AuthEffects: register action
    AuthEffects->>ApiService: POST /api/auth/register
    ApiService->>Backend: HTTP request
    Backend->>MongoDB: Save user
    MongoDB-->>Backend: User saved
    Backend-->>ApiService: JWT token
    ApiService-->>AuthEffects: token
    AuthEffects->>Store: dispatch(registerSuccess)
    AuthEffects->>Store: dispatch(loadUser)
    Store->>AuthEffects: loadUser action
    AuthEffects->>ApiService: GET /users/me
    ApiService->>Backend: HTTP request (with token)
    Backend-->>ApiService: user object
    ApiService-->>AuthEffects: user
    AuthEffects->>Store: dispatch(loadUserSuccess)
    Store->>Store: reducer updates user, token
    Store-->>AuthService: user$ emits
    AuthService-->>Frontend: user observable
    Frontend->>User: redirect to /events
```

### Create Event (without NgRx)

```mermaid
sequenceDiagram
    participant User as User (logged in)
    participant Frontend
    participant EventFormComponent
    participant EventService
    participant Backend as Backend (POST /api/events)
    participant MongoDB

    User->>EventFormComponent: Fill event data & submit
    EventFormComponent->>EventService: createEvent(eventData)
    EventService->>Backend: POST /api/events (with JWT)
    Backend->>MongoDB: Save event
    MongoDB-->>Backend: Event saved
    Backend-->>EventService: Return created event
    EventService-->>EventFormComponent: Event object
    EventFormComponent->>Frontend: Navigate to event details
```

### RSVP to Event (without NgRx)

```mermaid
sequenceDiagram
    participant User as User (logged in)
    participant EventDetailsComponent
    participant EventService
    participant Backend as Backend (POST /api/events/{id}/rsvp)
    participant MongoDB

    User->>EventDetailsComponent: Click RSVP button
    EventDetailsComponent->>EventService: rsvpEvent(eventId)
    EventService->>Backend: POST /api/events/{id}/rsvp
    Backend->>MongoDB: Add user to attendees list
    MongoDB-->>Backend: Update confirmed
    Backend-->>EventService: 200 OK
    EventService-->>EventDetailsComponent: Success
    EventDetailsComponent->>EventDetailsComponent: Update attendees list & button state
```

### Geolocation “Near you” (without NgRx)

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant GeolocationService
    participant EventList as Event List (carousel)

    User->>Frontend: Click "Enable location"
    Frontend->>GeolocationService: getCurrentPosition()
    GeolocationService->>User: Browser asks permission
    User-->>GeolocationService: Allow
    GeolocationService-->>Frontend: Return coordinates (lat, lng)
    Frontend->>Frontend: Calculate distance to each event
    Frontend->>Frontend: Filter events within 50km
    Frontend->>EventList: Update "Near you" carousel
```
---

## Running the Full Stack Locally

1. **Backend** (port 3000):  
```bash
cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

2. **Frontend** (port 4200):  
```bash
cd frontend && ng serve
```

3. **Open** [http://localhost:4200](http://localhost:4200)

### Running with Docker (from pre‑built images)

If you have the images available on Docker Hub, you can run the entire stack with a single command:

```bash
docker-compose up -d
```

To pull the images first and then run:

```bash
docker pull hiiico/eventhub-backend:latest
docker pull hiiico/eventhub-frontend:latest
docker-compose up -d
```

To run only the backend or frontend separately:

```bash
docker run -p 3000:3000 --env-file .env hiiico/eventhub-backend:latest
```
```bash
docker run -p 4200:80 hiiico/eventhub-frontend:latest
```

> Note: The backend requires the .env file with MongoDB Atlas credentials. The frontend is a static nginx container serving the Angular app.
---

## Deployment to Azure

The repository is configured for automatic deployment via GitHub Actions on push to `main`.
- Backend: `AZURE_WEBAPP_PUBLISH_PROFILE` secret required
- Frontend: `AZURE_STORAGE_KEY` secret required

Infrastructure can be provisioned with Terraform (see `terraform/` folder).  
After deployment:
- Backend: [https://eventhub-backend.azurewebsites.net](https://eventhub-backend.azurewebsites.net)
- Frontend: [https://eventhubfrontend.z28.web.core.windows.net](https://eventhubfrontend.z28.web.core.windows.net)
---

## Completed Improvements

### ✅ NgRx State Management for Authentication

The authentication module now uses NgRx for predictable state management, side effect handling, and better scalability.

- **State**: user, token, loading, error, updateSuccess
- **Actions**: login, register, logout, updateUser, loadUser, clearError
- **Effects**: handle API calls, token storage, navigation, auto‑clear success message
- **Selectors**: user$, isAuthenticated$, loading$, error$, updateSuccess$
- **Facade**: `AuthService` wraps the store, keeping components decoupled

#### Sequence Diagram – NgRx Authentication Flow (Login)

```mermaid
sequenceDiagram
    participant User
    participant LoginComponent
    participant AuthService (facade)
    participant Store
    participant AuthEffects
    participant ApiService
    participant Backend
    participant LocalStorage

    User->>LoginComponent: Enter credentials & submit
    LoginComponent->>AuthService: login(email, password)
    AuthService->>Store: dispatch(login action)
    Store->>AuthEffects: login action intercepted
    AuthEffects->>ApiService: POST /auth/login
    ApiService->>Backend: HTTP request
    Backend-->>ApiService: JWT token
    ApiService-->>AuthEffects: token
    AuthEffects->>Store: dispatch(loginSuccess)
    AuthEffects->>Store: dispatch(loadUser)
    Store->>AuthEffects: loadUser action
    AuthEffects->>ApiService: GET /users/me
    ApiService->>Backend: HTTP request (with token)
    Backend-->>ApiService: user object
    ApiService-->>AuthEffects: user
    AuthEffects->>Store: dispatch(loadUserSuccess)
    Store->>LocalStorage: persist token & user
    Store-->>AuthService: user$ emits
    AuthService-->>LoginComponent: user observable
    LoginComponent->>User: redirect to /events
```

The same pattern applies to `register`, `logout`, and `updateUser`. All components (`Header`, `Profile`, `Login`, `Register`) have been refactored to use the NgRx‑backed `AuthService` facade.

---
## Future Improvements (Bonuses)
- ~~Add NgRx for state management~~ (✅ Completed for authentication)
- Extend NgRx to Events, RSVP, and Geolocation modules
- Add unit test coverage for NgRx effects and reducers
- Implement Google Drive API for event flyers
- Use Azure Front Door for global load balancing

---