import { Routes } from '@angular/router';
import {LoginComponent} from './features/user/login/login.component';
import {RegisterComponent} from './features/user/register/register.component';
import {EventDetailsComponent} from './features/event/event-details/event-details.component';
import {MyEventsComponent} from './features/user/my-events/my-events.component';
import {EventCreateComponent} from './features/event/event-create/event-create.component';
import {EventEditComponent} from './features/event/event-edit/event-edit.component';
import {ProfileComponent} from './features/user/profile/profile.component';
import {Home} from './features/home/home';
import {loggedInGuard} from './core/guards/logged-in.guard';
import {EventCatalogComponent} from './features/event/event-catalog/event-catalog.component';
import { authGuard} from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: LoginComponent, canActivate: [loggedInGuard]},
  { path: 'register', component: RegisterComponent, canActivate: [loggedInGuard] },
  { path: 'events', component: EventCatalogComponent },
  { path: 'events/create' , component: EventCreateComponent, canActivate: [authGuard]},
  { path: 'events/edit/:id' , component: EventEditComponent, canActivate: [authGuard]},
  { path: 'events/:id', component: EventDetailsComponent},
  { path: 'my-events', component: MyEventsComponent, canActivate: [authGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
  { path: '**', redirectTo: '/events' }
];
