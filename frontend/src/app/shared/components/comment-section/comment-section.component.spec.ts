import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentSectionComponent } from './comment-section.component';
import { EventService } from '../../../core/services/event/event.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('CommentSectionComponent', () => {
  let component: CommentSectionComponent;
  let fixture: ComponentFixture<CommentSectionComponent>;
  let eventServiceMock: jasmine.SpyObj<EventService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    eventServiceMock = jasmine.createSpyObj('EventService', ['addComment']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isAuthenticated']);
    authServiceMock.isAuthenticated.and.returnValue(true);
    authServiceMock.getCurrentUser.and.returnValue({ id: '1', name: 'User', email: 'u@e.com' });

    await TestBed.configureTestingModule({
      imports: [CommentSectionComponent, RouterTestingModule],
      providers: [
        { provide: EventService, useValue: eventServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CommentSectionComponent);
    component = fixture.componentInstance;
    component.eventId = '123';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
