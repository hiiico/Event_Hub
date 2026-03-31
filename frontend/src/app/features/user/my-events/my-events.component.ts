import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { EventService } from '../../../core/services/event/event.service';
import { EventCardComponent } from '../../../shared/components/event-card/event-card.component';
import { Event } from '../../../shared/interfaces/event';

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

  constructor(
    private eventService: EventService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

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
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe({
        next: () => this.loadCreatedEvents(),
        error: (err) => console.error('Delete failed', err)
      });
    }
  }

  cancelRsvp(id: string) {
    console.log('Canceling RSVP for event:', id);
    this.eventService.rsvpEvent(id).subscribe({
      next: () => {
        console.log('RSVP cancelled successfully');
        this.loadAttendingEvents(); // Refresh the list
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to cancel RSVP:', err);
        alert('Failed to cancel RSVP. Please try again.');
      }
    });
  }
}
