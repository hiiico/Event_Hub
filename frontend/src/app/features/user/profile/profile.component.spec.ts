import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { selectUser, selectAuthLoading, selectAuthError, selectUpdateSuccess } from '../../../store/auth/selectors/auth.selectors';
import { User } from '../../../shared/interfaces/user';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let store: MockStore;

  const mockUser: User = { id: '1', name: 'John', email: 'john@example.com' };

  const initialState = {
    auth: {
      user: mockUser,
      token: 'fake-token',
      loading: false,
      error: null,
      updateSuccess: false
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [provideMockStore({ initialState }), AuthService]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Reset all store overrides to avoid leaking between tests
    store?.resetSelectors();
  });

  it('should populate user from authService', () => {
    expect(component.user.name).toBe('John');
    expect(component.user.email).toBe('john@example.com');
  });

  it('should update profile successfully', () => {
    spyOn(store, 'dispatch').and.callThrough();
    component.user.name = 'Johnny';
    component.onSubmit();
    expect(store.dispatch).toHaveBeenCalled();

    // Override selectors to simulate success
    store.overrideSelector(selectUpdateSuccess, true);
    store.overrideSelector(selectAuthLoading, false);
    store.overrideSelector(selectAuthError, null);
    store.overrideSelector(selectUser, { ...mockUser, name: 'Johnny' });
    store.refreshState();

    fixture.detectChanges();
    expect(component.successMessage).toBe('Profile updated successfully');
    expect(component.user.name).toBe('Johnny');
  });

  it('should handle update error', () => {
    spyOn(store, 'dispatch');
    component.onSubmit();

    store.overrideSelector(selectUpdateSuccess, false);
    store.overrideSelector(selectAuthLoading, false);
    store.overrideSelector(selectAuthError, 'Update failed');
    store.refreshState();

    fixture.detectChanges();
    expect(component.errorMessage).toBe('Update failed');
    expect(component.successMessage).toBe('');
  });
});
