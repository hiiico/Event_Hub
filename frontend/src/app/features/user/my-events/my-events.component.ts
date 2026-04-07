import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, Router, NavigationEnd} from '@angular/router';
import { EventService } from '../../../core/services/event/event.service';
import { EventCardComponent } from '../../../shared/components/event-card/event-card.component';
import { Event } from '../../../shared/interfaces/event';
import {filter} from 'rxjs';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, RouterLink, EventCardComponent],
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {
  createdEvents: Event[] = [];
  attendingEvents: Event[] = [];
  activeTab: 'created' | 'attending' = 'created';
  loadingCreated = false;
  loadingAttending = false;
  errorCreated = false;
  errorAttending = false;
  deleting = false;
  cancelling = false;

  constructor(
    private eventService: EventService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd && event.url === '/my-events')
  ).subscribe(() => {
    this.loadAttendingEvents();
  });}

  ngOnInit(): void {
    this.loadCreatedEvents();
    this.loadAttendingEvents();
  }

  loadCreatedEvents() {
    this.loadingCreated = true;
    this.errorCreated = false;
    this.eventService.getMyCreatedEvents().subscribe({
      next: (page) => {
        this.createdEvents = page.content;
        this.loadingCreated = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorCreated = true;
        this.loadingCreated = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadAttendingEvents() {
    this.loadingAttending = true;
    this.errorAttending = false;
    this.eventService.getMyAttendingEvents().subscribe({
      next: (page) => {
        this.attendingEvents = page.content;
        this.loadingAttending = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorAttending = true;
        this.loadingAttending = false;
        this.cdr.detectChanges();
      }
    });
  }

  editEvent(event: Event) {
    console.log('Edit button clicked for event:', event.id);
    this.router.navigate(['/events/edit', event.id]);
  }

  deleteEvent(id: string) {
    if (this.deleting) return;
    if (confirm('Are you sure you want to delete this event?')) {
      this.deleting = true;
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          this.loadCreatedEvents();
          this.deleting = false;
        },
        error: (err) => {
          console.error('Delete failed', err);
          this.deleting = false;
        }
      });
    }
  }

  cancelRsvp(id: string) {
    if (this.cancelling) return;
    this.cancelling = true;
    this.eventService.rsvpEvent(id).subscribe({
      next: () => {
        this.loadAttendingEvents();
        this.cancelling = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to cancel RSVP:', err);
        // alert('Failed to cancel RSVP. Please try again.');
        this.cancelling = false;
      }
    });
  }
}
