import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../../core/services/event/event.service';
import { EventFormComponent } from '../../../shared/components/event-form/event-form.component';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [EventFormComponent],
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css'],
})
export class EventCreateComponent {
  event = {
    title: '',
    description: '',
    dateTime: '',
    location: '',
    category: '',
    latitude: null as number | null,
    longitude: null as number | null
  };
  loading = false;
  error = '';

  constructor(private eventService: EventService, private router: Router) {}

  onSubmit() {

    if (this.loading) {
      console.log('Already submitting, ignoring...');
      return;
    }
    console.log('📤 CreateComponent – event before send:', this.event);

    this.loading = true;
    console.log('Submitting event creation...');
    this.eventService.createEvent(this.event).subscribe({
      next: (created) => {
        console.log('✅ Event created:', created);
        this.router.navigate(['/events', created.id]);
      },
      error: (err) => {
        console.error('❌ Creation failed:', err);
        this.error = 'Failed to create event';
        this.loading = false;
      }
    });
  }
}
