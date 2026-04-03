# EventHub – Frontend

Angular 17+ standalone application for EventHub – discover events, RSVP, create events, and manage profile.

---

## Tech Stack
- Angular 17+ (standalone components)
- TypeScript, RxJS
- CSS (custom, responsive)
- Font Awesome 6

## Project Structure

```
src/app/
├── core/ # Guards, interceptors, services (auth, event, geolocation)
├── shared/ # Models, reusable components (event-card, comment-section, event-form, event-search, location-picker)
├── features/ # Feature modules (home, about, event-catalog, event-details, event-create, event-edit, login, register, profile, my-events)
├── app.config.ts
├── app.routes.ts
└── app.component.ts
```

## Running Locally

### Prerequisites
- Node.js 20+
- Angular CLI (`npm install -g @angular/cli`)

### Install dependencies

```bash
npm install
```

### Development server

```bash
ng serve
```

Navigate to [http://localhost:4200](http://localhost:4200). The application will automatically reload on code change

### Build for production

```bash
ng build --prod
```

The output is in `dist/frontend/browser/`.

## Environment Configuration

| File                                 | API URL                                                       |
|--------------------------------------|---------------------------------------------------------------|
| src/environments/environment.ts      | `http://localhost:3000/api` (development)                     |
| src/environments/environment.prod.ts | `https://eventhub-backend.azurewebsites.net/api` (production) |

## Features
- Public pages: Home, About, event catalog, event details, login, register
- Private pages (require authentication): My events (created + attending), create/edit event, profile
- RSVP – toggle attendance on event details page
- Comments – add comments to events (authenticated)
- Geolocation – “Near you” carousel (within 50km)
- Search/filter – by title/location, category, date (date picker in hero)
- Responsive – works on mobile, tablet, desktop

## Docker

You can run the frontend as a standalone container from Docker Hub.

### Pull from Docker Hub

```bash
docker pull hiiico/eventhub-frontend:latest
```

### Run the container

```bash
docker run -p 4200:80 hiiico/eventhub-frontend:latest
```

> The frontend container serves the Angular app via nginx. All client‑side routing (e.g., `/events`) works because nginx is configured to fallback to `index.html`.

## Frontend Routes

| Path               | Component               |      Guard      | Description                                       |
|--------------------|-------------------------|:---------------:|---------------------------------------------------|
| `/`                | `HomeComponent`         |        –        | Landing page with hero, features, featured events |
| `/about`           | `AboutComponent`        |        –        | Information about the platform                    |
| `/events`          | `EventCatalogComponent` |        –        | Event catalog with search, filters, carousels     |
| `/events/:id`      | `EventDetailsComponent` |        –        | Detailed view of a single event                   |
| `/login`           | `LoginComponent`        | `loggedInGuard` | Login form (redirects if already logged in)       |
| `/register`        | `RegisterComponent`     | `loggedInGuard` | Registration form (redirects if logged in)        |
| `/my-events`       | `MyEventsComponent`     |   `authGuard`   | User dashboard – created and attending events     |
| `/events/create`   | `EventCreateComponent`  |   `authGuard`   | Form to create a new event                        |
| `/events/edit/:id` | `EventEditComponent`    |   `authGuard`   | Form to edit an existing event (owner only)       |
| `/profile`         | `ProfileComponent`      |   `authGuard`   | User profile settings (name, email)               |
| `**` (wildcard)    | –                       |        –        | Redirects to `/events` (404 fallback)             |

### Guards:

- `loggedInGuard` – prevents authenticated users from accessing login/register (redirects to `/events`).
- `authGuard` – prevents unauthenticated users from accessing private pages (redirects to `/login`).

> All frontend routes are handled by Angular’s Router and are served by the static website (Azure Storage). The backend only serves the API endpoints and the health check (`/`).
