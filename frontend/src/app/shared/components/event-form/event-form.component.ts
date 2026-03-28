import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent {
  @Input() event = {
    title: '',
    description: '',
    dateTime: '',
    location: '',
    category: ''
  };
  @Input() buttonLabel = 'Create Event';
  @Input() loading = false;
  @Input() error = '';

  @Output() submit = new EventEmitter<void>();

  onSubmit() {
    this.submit.emit();
  }
}
