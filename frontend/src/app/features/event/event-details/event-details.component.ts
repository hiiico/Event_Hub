import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event/event.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Event } from '../../../shared/interfaces/event';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: Event | null = null;
  isAttending = false;
  rsvpLoading = false;
  newComment = '';
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEvent(id);
    } else {
      this.loading = false;
      this.error = true;
      this.cdr.detectChanges();
    }
  }

  loadEvent(id: string) {
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.event = event;
        // TODO: Check if user is attending (requires current user ID)
        this.isAttending = false;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleRsvp() {
    if (!this.event) return;
    this.rsvpLoading = true;
    this.eventService.rsvpEvent(this.event.id).subscribe({
      next: () => {
        this.isAttending = !this.isAttending;
        if (this.event) {
          this.event.attendeeCount += this.isAttending ? 1 : -1;
        }
        this.rsvpLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.rsvpLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  addComment() {
    if (!this.event || !this.newComment.trim()) return;
    // TODO: implement comment endpoint
    alert('Comment feature coming soon');
    this.newComment = '';
    this.cdr.detectChanges();
  }
}
