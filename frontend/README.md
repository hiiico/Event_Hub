# EventHub – Frontend (Angular 17+)

EventHub is a full‑stack web application for discovering and managing local events.  
This repository contains the **Angular frontend** (standalone components) that consumes the Spring Boot REST API.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Backend Structure](#backend-structure)
- [Frontend Structure](#frontend-structure)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Development Commands](#development-commands)
- [Built With](#built-with)

---

## Project Overview

- **Frontend**: Angular 17+ (standalone components) – built with TypeScript, RxJS, and custom CSS (BEM naming).
- **Backend**: Spring Boot 3.2 with Spring Security, JWT authentication, and MongoDB Atlas.
- **Database**: MongoDB Atlas (or local MongoDB) – data stored as JSON documents.

The frontend provides:
- Public pages: event catalog, event details, login, register.
- Private pages: my events dashboard, event creation/editing, profile settings.
- Interactive features: RSVP, commenting, search/filter, pagination.

---

## Backend Structure

- The backend is located in the `backend/` folder.
---
## Frontend Structure

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

The frontend is built with **Angular standalone components** (no NgModules).  
- All source code is in `src/app/`.
---

## Running the Application
Prerequisites
- Node.js 18+ and npm
- Java 17+ and Maven (for the backend)
- MongoDB Atlas account (or local MongoDB)
---
### Start the Backend
```
cd backend
export MONGODB_USERNAME=your_db_username
export MONGODB_PASSWORD=your_db_password
./mvnw spring-boot:run
```

The backend will start at http://localhost:3000.

---
### Start the Frontend

```
cd ../frontend
npm install
ng serve
```

The frontend will be available at http://localhost:4200.

## API Endpoints

The frontend consumes the following REST endpoints (all prefixed with /api):

| Method | Endpoint               | Description                  | AuthService Required |
|--------|------------------------|------------------------------|:-------------:|
| POST   | /auth/register         | Register a new user          |      No       |
| POST   | /auth/login            | Login – returns JWT token    |      No       |
| GET    | /events                | List events (paginated)      |      No       |
| GET    | /events/{id}           | Get event details            |      No       |
| POST   | /events                | Create a new event           |     Yes       |
| PUT    | /events/{id}           | Update an event              |  Yes (owner)  |
| DELETE | /events/{id}           | Delete an event              |  Yes (owner)  |
| POST   | /events/{id}/rsvp      | Toggle RSVP status           |      Yes      |
| GET    | /events/user/created   | Events created by the user   |      Yes      |
| GET    | /events/user/attending | Events the user is attending |      Yes      |

## Development Commands

| Command	                | Description                               |
|-------------------------|-------------------------------------------|
| ng serve	               | Start dev server at http://localhost:4200 |
| ng build	               | Build the project (output in dist/)       |
| ng test                 | 	Run unit tests (Vitest)                  |       
| ng generate component x | 	Generate a new component                 |
| ng generate service x	  | Generate a new service                    |

## Built With

- Angular 17+ – standalone components, control flow syntax (@if, @for)

- TypeScript – static typing

- RxJS – observables, operators (debounceTime, catchError)

- CSS – custom styling with BEM methodology

- Font Awesome – free icons (loaded from CDN)
