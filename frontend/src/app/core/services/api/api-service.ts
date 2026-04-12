import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../../../shared/interfaces/event';
import { Comment } from '../../../shared/interfaces/comment';
import { User } from '../../../shared/interfaces/user';
import { environment } from "../../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // Auth
  register(name: string, email: string, password: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/auth/register`, { name, email, password }, { responseType: 'text' });
  }
  login(email: string, password: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/auth/login`, { email, password }, { responseType: 'text' });
  }
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/me`);
  }
  updateUser(user: { name: string; email: string }): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/me`, user);
  }

  // Events
  getAllEvents(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/events`, { params: { page, size } });
  }
  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.baseUrl}/events/${id}`);
  }
  createEvent(event: Partial<Event>): Observable<Event> {
    return this.http.post<Event>(`${this.baseUrl}/events`, event);
  }
  updateEvent(id: string, event: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}/events/${id}`, event);
  }
  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/events/${id}`);
  }
  rsvpEvent(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/events/${id}/rsvp`, {});
  }
  addComment(eventId: string, text: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/events/${eventId}/comments`, { text });
  }
  getMyCreatedEvents(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/events/user/created`, { params: { page, size } });
  }
  getMyAttendingEvents(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/events/user/attending`, { params: { page, size } });
  }
}
