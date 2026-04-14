import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { EventService } from '../../core/services/event/event.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let eventServiceMock: jasmine.SpyObj<EventService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  const mockEventsPage = {
    content: [
      { id: '1', title: 'Event1', description: '', dateTime: '', location: '', category: '', organiser: { id: '', name: '', email: '' }, attendees: [], comments: [] },
      { id: '2', title: 'Event2', description: '', dateTime: '', location: '', category: '', organiser: { id: '', name: '', email: '' }, attendees: [], comments: [] },
      { id: '3', title: 'Event3', description: '', dateTime: '', location: '', category: '', organiser: { id: '', name: '', email: '' }, attendees: [], comments: [] },
      { id: '4', title: 'Event4', description: '', dateTime: '', location: '', category: '', organiser: { id: '', name: '', email: '' }, attendees: [], comments: [] }
    ]
  };

  beforeEach(async () => {
    eventServiceMock = jasmine.createSpyObj('EventService', ['getAllEvents']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isAuthenticated']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [
        { provide: EventService, useValue: eventServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should load featured events on init', () => {
    eventServiceMock.getAllEvents.and.returnValue(of(mockEventsPage));
    fixture.detectChanges();
    expect(eventServiceMock.getAllEvents).toHaveBeenCalledWith(0, 3);
    expect(component.featuredEvents().length).toBe(3);
    expect(component.loading()).toBeFalse();
  });
});
