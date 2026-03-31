import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { EventService } from '../../../core/services/event/event.service';
import { EventFormComponent } from '../../../shared/components/event-form/event-form.component';
import { Event } from '../../../shared/interfaces/event';

@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [CommonModule, EventFormComponent, RouterLink],
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css'],
})
export class EventEditComponent implements OnInit {
  event = {
    id: '',
    title: '',
    description: '',
    dateTime: '',
    location: '',
    category: '',
    latitude: null as number | null,
    longitude: null as number | null
  };
  loading = true;
  saving = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Edit component: id from route =', id);
    if (id) {
      this.loadEvent(id);
    } else {
      this.error = 'No event ID provided';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  loadEvent(id: string) {
    this.eventService.getEventById(id).subscribe({
      next: (eventData) => {
        console.log('Event loaded:', eventData);
        // Map the data to our event object
        this.event = {
          id: eventData.id,
          title: eventData.title,
          description: eventData.description,
          dateTime: eventData.dateTime,
          location: eventData.location,
          category: eventData.category,
          latitude: eventData.latitude ?? null,
          longitude: eventData.longitude ?? null
        };
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load event', err);
        this.error = 'Failed to load event';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit() {
    this.saving = true;
    this.error = '';
    this.eventService.updateEvent(this.event.id, this.event).subscribe({
      next: () => {
        this.router.navigate(['/events', this.event.id]);
      },
      error: (err) => {
        console.error('Update failed', err);
        this.error = 'Failed to update event';
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }
}
