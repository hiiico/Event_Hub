import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationPickerComponent, LocationData } from '../location-picker/location-picker.component';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LocationPickerComponent],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnChanges {
  minDateTime = new Date().toISOString().slice(0, 16);

  @Input() event = {
    title: '',
    description: '',
    dateTime: '',
    location: '',
    category: '',
    latitude: null as number | null,
    longitude: null as number | null
  };
  @Input() buttonLabel = 'Create Event';
  @Input() loading = false;
  @Input() error = '';
  @Output() submit = new EventEmitter<void>();
  @Output() eventChange = new EventEmitter<any>();

  locationData: LocationData = {
    address: '',
    latitude: null,
    longitude: null
  };

  isPastDate(): boolean {
    if (!this.event.dateTime) return false;
    const selected = new Date(this.event.dateTime);
    const now = new Date();
    return selected < now;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['event'] && this.event) {
      console.log('🔄 EventFormComponent – event input changed:', this.event);
      this.locationData = {
        address: this.event.location || '',
        latitude: this.event.latitude ?? null,
        longitude: this.event.longitude ?? null
      };
    }
  }

  onLocationChange(data: LocationData) {
    console.log('📍 Location picker emitted:', data);
    // Update the event object directly
    this.event.location = data.address;
    this.event.latitude = data.latitude;
    this.event.longitude = data.longitude;
    this.eventChange.emit(this.event);
    console.log('✅ Event after update:', this.event);
  }

  onSubmit() {
    console.log('🚀 Submitting event:', this.event);
    if (this.loading) return;
    if (this.isPastDate()) return;
    this.submit.emit();
  }
}
