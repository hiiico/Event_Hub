import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventCardComponent } from './event-card.component';
import { Event } from '../../interfaces/event';
import { ShortenLocationPipe } from '../../pipes/shorten-location.pipe';
import { RouterTestingModule } from '@angular/router/testing';

describe('EventCardComponent', () => {
  let component: EventCardComponent;
  let fixture: ComponentFixture<EventCardComponent>;

  const mockEvent: Event = {
    id: '1',
    title: 'Test Event',
    description: 'desc',
    dateTime: '2026-01-01T00:00:00Z',
    location: 'Long Address, City, Country',
    category: 'Music',
    organiser: { id: 'org', name: 'Org', email: 'org@e.com' },
    attendees: [],
    comments: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCardComponent, ShortenLocationPipe, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EventCardComponent);
    component = fixture.componentInstance;
    component.event = mockEvent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display event title', () => {
    const compiled = fixture.nativeElement;
    const titleEl = compiled.querySelector('.event-card__title');
    expect(titleEl).toBeTruthy();
    expect(titleEl.textContent).toContain('Test Event');
  });
});
