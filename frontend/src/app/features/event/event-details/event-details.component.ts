import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event/event.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CommentSectionComponent } from '../../../shared/components/comment-section/comment-section.component';
import { Event } from '../../../shared/interfaces/event';
import { Comment } from '../../../shared/interfaces/comment';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CommentSectionComponent],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: Event | null = null;
  isAttending = false;
  rsvpLoading = false;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadEvent(id);
    else { this.error = true; this.loading = false; }
  }

  loadEvent(id: string) {
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.event = event;
        // TODO: check if current user is attending (needs user id from token)
        this.isAttending = false;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.error = true; this.loading = false; this.cdr.detectChanges(); }
    });
  }

  toggleRsvp() {
    if (!this.event) return;
    this.rsvpLoading = true;
    this.eventService.rsvpEvent(this.event.id).subscribe({
      next: () => {
        this.isAttending = !this.isAttending;
        if (this.event) this.event.attendeeCount += this.isAttending ? 1 : -1;
        this.rsvpLoading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.rsvpLoading = false; }
    });
  }

  onCommentAdded(comment: Comment) {
    if (!this.event) return;
    if (!this.event.comments) this.event.comments = [];
    this.event.comments.push(comment);
    this.cdr.detectChanges();
  }
}
