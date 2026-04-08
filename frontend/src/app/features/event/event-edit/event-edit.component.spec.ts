import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEditComponent } from './event-edit.component';
import { EventService } from '../../../core/services/event/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Event } from '../../../shared/interfaces/event';

describe('EventEditComponent', () => {
  let component: EventEditComponent;
  let fixture: ComponentFixture<EventEditComponent>;
  let eventServiceMock: jasmine.SpyObj<EventService>;

  const mockEvent: Event = {
    id: '1',
    title: 'Test',
    description: 'desc',
    dateTime: new Date().toISOString(),
    location: 'loc',
    category: 'Music',
    organiser: { id: 'o1', name: 'Org', email: 'org@e.com' },
    attendees: [],
    comments: []
  };

  beforeEach(async () => {
    eventServiceMock = jasmine.createSpyObj('EventService', ['getEventById', 'updateEvent']);

    await TestBed.configureTestingModule({
      imports: [EventEditComponent, RouterTestingModule],
      providers: [
        { provide: EventService, useValue: eventServiceMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventEditComponent);
    component = fixture.componentInstance;
    eventServiceMock.getEventById.and.returnValue(of(mockEvent));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
