import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { EventService } from '../../../core/services/event/event.service';
import { Comment } from '../../interfaces/comment';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent {
  @Input() comments: Comment[] = [];
  @Input() eventId = '';  // ← This receives the event ID
  @Output() commentAdded = new EventEmitter<Comment>();

  newComment = '';
  submitting = false;
  error = '';

  constructor(
    public authService: AuthService,
    private eventService: EventService
  ) {}

  addComment() {
    if (!this.newComment.trim()) return;
    if (!this.eventId) {
      this.error = 'Event ID is missing';
      return;
    }

    this.submitting = true;
    this.error = '';

    this.eventService.addComment(this.eventId, this.newComment).subscribe({
      next: (comment) => {
        this.commentAdded.emit(comment);
        this.newComment = '';
        this.submitting = false;
      },
      error: (err) => {
        console.error('Failed to add comment:', err);
        this.error = 'Failed to add comment. Please try again.';
        this.submitting = false;
      }
    });
  }
}
