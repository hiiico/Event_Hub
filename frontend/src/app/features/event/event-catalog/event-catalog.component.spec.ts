import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EventCatalogComponent } from './event-catalog.component';
import { EventService } from '../../../core/services/event/event.service';
import { GeolocationService } from '../../../core/services/geolocation/geolocation.service';
import { of, throwError } from 'rxjs';
import { Event } from '../../../shared/interfaces/event';
import { RouterTestingModule } from '@angular/router/testing';

describe('EventCatalogComponent', () => {
  let component: EventCatalogComponent;
  let fixture: ComponentFixture<EventCatalogComponent>;
  let eventServiceMock: jasmine.SpyObj<EventService>;
  let geolocationMock: jasmine.SpyObj<GeolocationService>;

  const createMockEvent = (id: string, title: string, dateTime: string, lat?: number, lon?: number): Event => ({
    id, title, description: 'desc', dateTime, location: 'loc', category: 'Music',
    organiser: { id: 'org', name: 'Org', email: 'org@e.com' },
    attendees: [], comments: [], latitude: lat, longitude: lon
  });

  const mockEventsPage = {
    content: [
      createMockEvent('1', 'Concert', new Date().toISOString(), 10, 20),
      createMockEvent('2', 'Tech Talk', new Date(Date.now() + 86400000).toISOString(), 11, 21)
    ]
  };

  beforeEach(async () => {
    eventServiceMock = jasmine.createSpyObj('EventService', ['getAllEvents']);
    geolocationMock = jasmine.createSpyObj('GeolocationService', ['getCurrentPosition', 'calculateDistance']);

    await TestBed.configureTestingModule({
      imports: [EventCatalogComponent, RouterTestingModule],
      providers: [
        { provide: EventService, useValue: eventServiceMock },
        { provide: GeolocationService, useValue: geolocationMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventCatalogComponent);
    component = fixture.componentInstance;
  });

  it('should load events on init', () => {
    eventServiceMock.getAllEvents.and.returnValue(of(mockEventsPage));
    fixture.detectChanges();
    expect(component.allEvents).toEqual(mockEventsPage.content);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading events', () => {
    eventServiceMock.getAllEvents.and.returnValue(throwError(() => new Error()));
    fixture.detectChanges();
    expect(component.error).toBeTrue();
    expect(component.loading).toBeFalse();
  });

  it('should filter events by search term', () => {
    eventServiceMock.getAllEvents.and.returnValue(of(mockEventsPage));
    fixture.detectChanges();
    component.onFiltersChanged({ search: 'Concert', category: '' });
    // Because we removed debouncing for test simplicity, we can check immediately
    expect(component.filteredEvents.length).toBe(1);
    expect(component.filteredEvents[0].title).toBe('Concert');
  });
});
