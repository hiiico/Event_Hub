import { TestBed } from '@angular/core/testing';
import { EventService } from './event.service';
import { ApiService } from '../api/api-service';
import { of } from 'rxjs';
import { Event } from '../../../shared/interfaces/event';

describe('EventService', () => {
  let service: EventService;
  let apiServiceMock: jasmine.SpyObj<ApiService>;

  const fullEvent: Event = {
    id: '1',
    title: 'Test',
    description: 'desc',
    dateTime: new Date().toISOString(),
    location: 'loc',
    category: 'Music',
    organiser: { id: 'org1', name: 'Org', email: 'org@e.com' },
    attendees: [],
    comments: []
  };

  beforeEach(() => {
    apiServiceMock = jasmine.createSpyObj('ApiService', [
      'getAllEvents', 'getEventById', 'createEvent', 'updateEvent',
      'deleteEvent', 'rsvpEvent', 'addComment', 'getMyCreatedEvents',
      'getMyAttendingEvents'
    ]);

    TestBed.configureTestingModule({
      providers: [EventService, { provide: ApiService, useValue: apiServiceMock }]
    });

    service = TestBed.inject(EventService);
  });

  it('should call createEvent', () => {
    apiServiceMock.createEvent.and.returnValue(of(fullEvent));
    service.createEvent(fullEvent).subscribe(res => expect(res).toBe(fullEvent));
    expect(apiServiceMock.createEvent).toHaveBeenCalledWith(fullEvent);
  });
});
