import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Event } from '../../interfaces/event';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent {
  @Input() event!: Event;
  @Input() showActions = false;
  @Input() showRsvp = false;
  @Output() edit = new EventEmitter<Event>();
  @Output() delete = new EventEmitter<string>();
  @Output() cancelRsvp = new EventEmitter<string>();

  onEdit() {
    this.edit.emit(this.event);
  }

  onDelete() {
    this.delete.emit(this.event.id);
  }

  onCancelRsvp() {
    this.cancelRsvp.emit(this.event.id);
  }
}
