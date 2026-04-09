# EventHub Development Roadmap

## Documentation

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

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

## Development Phases

graph TD
A[Phase 1: Backend Core<br/>Spring Boot, MongoDB, JWT] --> B[Phase 2: Frontend Foundation<br/>Angular, Services, Public Pages]
B --> C[Phase 3: Private Features<br/>My Events, Create/Edit, Profile, RSVP]
C --> D[Phase 4: Polish & Geolocation<br/>Near you, Search/Filter, Route Guards]
D --> E[Phase 5: Azure Deployment<br/>Terraform, GitHub Actions, App Service + Storage]



[//]: # (### Phase 1: Backend Core &#40;Completed&#41;)

[//]: # (- Set up Spring Boot with MongoDB and JWT)

[//]: # (- User, Event, Comment models and repositories)

[//]: # (- REST controllers: auth, events, users)

[//]: # (- CRUD operations, RSVP, comments)

[//]: # (- Security: JWT filter, CORS, environment variables)

[//]: # ()
[//]: # (### Phase 2: Frontend Foundation &#40;Completed&#41;)

[//]: # (- Angular standalone app with routing)

[//]: # (- Core services &#40;Auth, Event, Geolocation&#41;)

[//]: # (- Public pages: home, about, catalog, details, login, register)

[//]: # (- Shared components: event card, search bar, location picker, comment section)

[//]: # (- Responsive styling &#40;CSS Grid, Flexbox&#41;)

[//]: # ()
[//]: # (### Phase 3: Private Features &#40;Completed&#41;)

[//]: # (- My events dashboard &#40;created + attending&#41;)

[//]: # (- Create / edit event forms &#40;shared form component&#41;)

[//]: # (- Profile settings &#40;update name/email&#41;)

[//]: # (- RSVP toggle and comments UI)

[//]: # ()
[//]: # (### Phase 4: Polish & Geolocation &#40;Completed&#41;)

[//]: # (- Geolocation – “Near you” carousel &#40;distance 50km&#41;)

[//]: # (- Date picker filter in hero graphic)

[//]: # (- Client‑side search and filtering)

[//]: # (- Loading/error states, empty state messages)

[//]: # (- Route guards &#40;auth, logged‑in&#41;)

[//]: # ()
[//]: # (### Phase 5: Azure Deployment &#40;Completed&#41;)

[//]: # (- Terraform for infrastructure &#40;App Service, Storage Account, Resource Group&#41;)

[//]: # (- GitHub Actions workflow:)

[//]: # (    - Build backend JAR with Maven)

[//]: # (    - Deploy JAR to Azure App Service &#40;publish profile&#41;)

[//]: # (    - Build Angular frontend and upload to Azure Storage static website &#40;`$web`&#41;)

[//]: # (- Health check endpoints added to satisfy Azure probes)

## Sequence Diagrams

### User Registration

```sequenceDiagram
participant User
participant Frontend
participant AuthService
participant Backend as Backend (POST /api/auth/register)
participant MongoDB

    User->>Frontend: Submit registration form
    Frontend->>AuthService: register(name, email, password)
    AuthService->>Backend: POST /api/auth/register
    Backend->>MongoDB: Save user
    MongoDB-->>Backend: User saved
    Backend-->>AuthService: Return JWT token
    AuthService-->>Frontend: Store token & user
    Frontend->>Frontend: Navigate to /events
```
[//]: # (```mermaid)

[//]: # (    User → Frontend → AuthService → Backend &#40;POST /api/auth/register&#41; → MongoDB &#40;save user&#41; → Backend returns token → Frontend stores token & user → Navigate to /events)

[//]: # (```)

### Create Event

```sequenceDiagram
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


[//]: # (```mermaid)

[//]: # ()
[//]: # (User &#40;logged in&#41; → Frontend → EventFormComponent → EventService → Backend &#40;POST /api/events&#41; with JWT → MongoDB &#40;save event&#41; → Backend returns created event → Frontend navigates to event details)

[//]: # ()
[//]: # (```)


### RSVP to Event

```sequenceDiagram
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


[//]: # (```mermaid)

[//]: # (User &#40;logged in&#41; → EventDetailsComponent → EventService → Backend &#40;POST /api/events/{id}/rsvp&#41; → MongoDB &#40;add user to attendees&#41; → Backend 200 OK → Frontend updates local attendees list and button state)

[//]: # (```)

### Geolocation “Near you”

```sequenceDiagram
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


 ```mermaid

User clicks “Enable location” → Browser asks permission → GeolocationService returns coordinates → Frontend calculates distance to each event → Filters events within 50km → Updates “Near you” carousel

```

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

## Deployment to Azure

The repository is configured for automatic deployment via GitHub Actions on push to `main`.
- Backend: `AZURE_WEBAPP_PUBLISH_PROFILE` secret required
- Frontend: `AZURE_STORAGE_KEY` secret required

Infrastructure can be provisioned with Terraform (see `terraform/` folder).  
After deployment:
- Backend: [https://eventhub-backend.azurewebsites.net](https://eventhub-backend.azurewebsites.net)
- Frontend: [https://eventhubfrontend.z28.web.core.windows.net](https://eventhubfrontend.z28.web.core.windows.net)

## Future Improvements (Bonuses)

- Add NgRx for state management
- Implement Google Drive API for event flyers
- Use Azure Front Door for global load balancing