import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api-service';
import { Event } from '../../../shared/interfaces/event';
import { Comment } from '../../../shared/interfaces/comment';

@Injectable({ providedIn: 'root' })
export class EventService {
  private apiService = inject(ApiService);

  getAllEvents(page: number = 0, size: number = 10): Observable<any> {
    return this.apiService.getAllEvents(page, size);
  }

  getEventById(id: string): Observable<Event> {
    return this.apiService.getEventById(id);
  }

  createEvent(event: Partial<Event>): Observable<Event> {
    return this.apiService.createEvent(event);
  }

  updateEvent(id: string, event: Partial<Event>): Observable<Event> {
    return this.apiService.updateEvent(id, event);
  }

  deleteEvent(id: string): Observable<void> {
    return this.apiService.deleteEvent(id);
  }

  rsvpEvent(id: string): Observable<void> {
    return this.apiService.rsvpEvent(id);
  }

  addComment(eventId: string, text: string): Observable<Comment> {
    return this.apiService.addComment(eventId, text);
  }

  getMyCreatedEvents(page: number = 0, size: number = 10): Observable<any> {
    return this.apiService.getMyCreatedEvents(page, size);
  }

  getMyAttendingEvents(page: number = 0, size: number = 10): Observable<any> {
    return this.apiService.getMyAttendingEvents(page, size);
  }
}
