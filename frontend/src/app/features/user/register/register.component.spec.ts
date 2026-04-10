import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { selectUser, selectAuthLoading, selectAuthError } from '../../../store/auth/auth.selectors';
import { User } from '../../../shared/interfaces/user';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let store: MockStore;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = { id: '1', name: 'John Doe', email: 'john@example.com' };

  const initialState = {
    auth: {
      user: null,
      token: null,
      loading: false,
      error: null,
      updateSuccess: false
    }
  };

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideMockStore({ initialState }),
        AuthService,
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.register on submit with valid data', () => {
    spyOn(store, 'dispatch');
    component.name = 'John Doe';
    component.email = 'john@example.com';
    component.password = 'password123';
    component.rePassword = 'password123';
    component.onSubmit();
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should not call register if passwords do not match', () => {
    spyOn(store, 'dispatch');
    component.password = 'password123';
    component.rePassword = 'different';
    component.onSubmit();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should not call register if password is shorter than 6 characters', () => {
    spyOn(store, 'dispatch');
    component.password = '12345';
    component.rePassword = '12345';
    component.onSubmit();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should set loading to true when register starts', () => {
    store.overrideSelector(selectAuthLoading, true);
    store.refreshState();
    fixture.detectChanges();
    expect(component.loading).toBe(true);
  });

  it('should display error message when error$ emits', () => {
    store.overrideSelector(selectAuthError, 'Email already exists');
    store.refreshState();
    fixture.detectChanges();
    expect(component.error).toBe('Email already exists');
  });

  it('should navigate to /events on successful registration', () => {
    store.overrideSelector(selectUser, mockUser);
    store.overrideSelector(selectAuthLoading, false);
    store.overrideSelector(selectAuthError, null);
    store.refreshState();
    fixture.detectChanges();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/events']);
  });

  it('should compute passwordMismatch correctly', () => {
    component.password = 'pass';
    component.rePassword = 'pass';
    expect(component.passwordMismatch).toBe(false);
    component.rePassword = 'different';
    expect(component.passwordMismatch).toBe(true);
  });
});
