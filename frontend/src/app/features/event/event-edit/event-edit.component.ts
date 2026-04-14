import { ChangeDetectorRef, Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EventService } from '../../../core/services/event/event.service';
import { EventFormComponent } from '../../../shared/components/event-form/event-form.component';

@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [CommonModule, EventFormComponent, RouterLink],
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css'],
})
export class EventEditComponent implements OnInit, OnDestroy {
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
  originalEvent: string = '';
  loading = true;
  saving = false;
  error = '';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEvent(id);
    } else {
      this.error = 'No event ID provided';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  loadEvent(id: string) {
    this.eventService.getEventById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (eventData) => {
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
          this.originalEvent = JSON.stringify(this.event);
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load event', err);
          this.error = err.error?.message || 'Failed to load event';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onSubmit() {
    if (this.loading || this.saving) return;
    this.saving = true;
    this.error = '';
    this.eventService.updateEvent(this.event.id, this.event)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/events', this.event.id]);
        },
        error: (err) => {
          console.error('Update failed', err);
          this.error = err.error?.message || 'Failed to update event';
          this.saving = false;
          this.cdr.detectChanges();
        }
      });
  }

  cancel() {
    if (this.hasUnsavedChanges()) {
      const confirmLeave = confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmLeave) return;
    }
    this.router.navigate(['/events', this.event.id]);
  }

  hasUnsavedChanges(): boolean {
    if (this.loading || this.saving) return false;
    const current = JSON.stringify(this.event);
    return current !== this.originalEvent;
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.hasUnsavedChanges()) {
      event.preventDefault();
      event.returnValue = true;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
