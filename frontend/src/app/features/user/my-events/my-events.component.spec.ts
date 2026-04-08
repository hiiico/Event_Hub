import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyEventsComponent } from './my-events.component';
import { EventService } from '../../../core/services/event/event.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Event } from '../../../shared/interfaces/event';

describe('MyEventsComponent', () => {
  let component: MyEventsComponent;
  let fixture: ComponentFixture<MyEventsComponent>;
  let eventServiceMock: jasmine.SpyObj<EventService>;

  const fixedDate = '2026-01-01T00:00:00Z';
  const createMockEvent = (id: string): Event => ({
    id, title: `Event ${id}`, description: 'desc', dateTime: fixedDate,
    location: 'loc', category: 'Music',
    organiser: { id: 'org', name: 'Org', email: 'org@e.com' },
    attendees: [], comments: []
  });

  beforeEach(async () => {
    eventServiceMock = jasmine.createSpyObj('EventService', [
      'getMyCreatedEvents', 'getMyAttendingEvents', 'deleteEvent', 'rsvpEvent'
    ]);

    await TestBed.configureTestingModule({
      imports: [MyEventsComponent, RouterTestingModule.withRoutes([])],
      providers: [{ provide: EventService, useValue: eventServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(MyEventsComponent);
    component = fixture.componentInstance;
  });

  it('should load created and attending events', () => {
    eventServiceMock.getMyCreatedEvents.and.returnValue(of({ content: [createMockEvent('1')] }));
    eventServiceMock.getMyAttendingEvents.and.returnValue(of({ content: [createMockEvent('2')] }));
    fixture.detectChanges();
    expect(component.createdEvents).toEqual([createMockEvent('1')]);
    expect(component.attendingEvents).toEqual([createMockEvent('2')]);
  });

  it('should delete an event', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    eventServiceMock.deleteEvent.and.returnValue(of(undefined));
    eventServiceMock.getMyCreatedEvents.and.returnValue(of({ content: [] }));
    component.deleteEvent('123');
    expect(eventServiceMock.deleteEvent).toHaveBeenCalledWith('123');
  });
});
