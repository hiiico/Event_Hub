import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../../core/services/event/event.service';
import { EventFormComponent } from '../../../shared/components/event-form/event-form.component';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [EventFormComponent],
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent {
  event = {
    title: '',
    description: '',
    dateTime: '',
    location: '',
    category: ''
  };
  loading = false;
  error = '';

  constructor(private eventService: EventService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.eventService.createEvent(this.event).subscribe({
      next: (created) => {
        this.router.navigate(['/events', created.id]);
      },
      error: () => {
        this.error = 'Failed to create event';
        this.loading = false;
      }
    });
  }
}
