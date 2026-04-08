import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventDetailsComponent } from './event-details.component';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../core/services/event/event.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { of } from 'rxjs';
import { Event } from '../../../shared/interfaces/event';
import { RouterTestingModule } from '@angular/router/testing';

describe('EventDetailsComponent', () => {
  let component: EventDetailsComponent;
  let fixture: ComponentFixture<EventDetailsComponent>;
  let eventServiceMock: jasmine.SpyObj<EventService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  const mockFullEvent: Event = {
    id: '123',
    title: 'Jazz Night',
    description: 'Great jazz',
    dateTime: new Date().toISOString(),
    location: 'Club',
    category: 'Music',
    organiser: { id: 'org1', name: 'Org', email: 'org@e.com' },
    attendees: [{ id: 'u1', name: 'User', email: 'u@e.com' }],
    comments: []
  };

  beforeEach(async () => {
    eventServiceMock = jasmine.createSpyObj('EventService', ['getEventById', 'rsvpEvent']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isAuthenticated']);
    authServiceMock.isAuthenticated.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [EventDetailsComponent, RouterTestingModule],
      providers: [
        { provide: EventService, useValue: eventServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '123' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should load event and check if current user is attending', () => {
    authServiceMock.getCurrentUser.and.returnValue({ id: 'u1', name: 'User', email: 'u@e.com' });
    eventServiceMock.getEventById.and.returnValue(of(mockFullEvent));
    fixture.detectChanges();
    expect(component.event).toEqual(mockFullEvent);
    expect(component.isAttending).toBeTrue();
  });

  it('should toggle RSVP', () => {
    authServiceMock.getCurrentUser.and.returnValue({ id: 'u2', name: 'Other', email: 'o@e.com' });
    eventServiceMock.getEventById.and.returnValue(of(mockFullEvent));
    eventServiceMock.rsvpEvent.and.returnValue(of(undefined));
    fixture.detectChanges();
    component.toggleRsvp();
    expect(eventServiceMock.rsvpEvent).toHaveBeenCalledWith('123');
    expect(component.isAttending).toBeTrue();
  });
});
