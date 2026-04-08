import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { of, throwError } from 'rxjs';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['updateUser', 'user$']);
    authServiceMock.user$ = of({ id: '1', name: 'John', email: 'john@example.com' });

    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should populate user from authService', () => {
    expect(component.user.name).toBe('John');
    expect(component.user.email).toBe('john@example.com');
  });

  it('should update profile successfully', () => {
    const updated = { id: '1', name: 'Johnny', email: 'johnny@example.com' };
    authServiceMock.updateUser.and.returnValue(of(updated));
    component.user.name = 'Johnny';
    component.onSubmit();
    expect(authServiceMock.updateUser).toHaveBeenCalledWith({ name: 'Johnny', email: 'john@example.com' });
    expect(component.user).toEqual(updated);
    expect(component.successMessage).toBe('Profile updated successfully');
  });
});
