import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Event } from '../../interfaces/event';
import {ShortenLocationPipe} from '../../pipes/shorten-location.pipe';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [RouterLink, DatePipe, ShortenLocationPipe],
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
    console.log('Card edit clicked for event:', this.event.id);
    this.edit.emit(this.event);
  }

  onDelete() {
    this.delete.emit(this.event.id);
  }

  onCancelRsvp() {
    console.log('Cancel RSVP clicked for event:', this.event.id);
    this.cancelRsvp.emit(this.event.id);
  }
}
