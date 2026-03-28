import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../core/services/event/event.service';
import { EventFormComponent } from '../../../shared/components/event-form/event-form.component';
import { Event } from '../../../shared/interfaces/event';

@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [CommonModule, EventFormComponent],
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {
  event: Event = {
    id: '',
    title: '',
    description: '',
    dateTime: '',
    location: '',
    category: '',
    attendeeCount: 0,
    organiser: { id: '', name: '', email: '' }
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

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('EditComponent: id from route =', id);
    if (id) {
      this.loadEvent(id);
    } else {
      this.error = 'No event ID provided';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  loadEvent(id: string) {
    console.log('Loading event with id:', id);
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        console.log('Event received:', event);
        this.event = event;
        this.loading = false;
        // Force view update
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading event:', err);
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
      error: () => {
        this.error = 'Failed to update event';
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }
}
