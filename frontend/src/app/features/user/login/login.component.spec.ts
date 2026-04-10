import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { Subject } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  let userSubject: Subject<any>;
  let loadingSubject: Subject<boolean>;
  let errorSubject: Subject<string>;

  beforeEach(async () => {
    userSubject = new Subject();
    loadingSubject = new Subject();
    errorSubject = new Subject();

    authServiceMock = jasmine.createSpyObj('AuthService', ['login', 'clearError'], {
      user$: userSubject.asObservable(),
      loading$: loadingSubject.asObservable(),
      error$: errorSubject.asObservable()
    });

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
        provideMockStore({ initialState: {} })  // needed because AuthService injects Store
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login on submit', () => {
    component.email = 'test@example.com';
    component.password = 'pass';
    component.onSubmit();
    expect(authServiceMock.login).toHaveBeenCalledWith('test@example.com', 'pass');
  });

  it('should show loading state', () => {
    loadingSubject.next(true);
    fixture.detectChanges();
    expect(component.loading).toBe(true);
  });

  it('should show error message', () => {
    errorSubject.next('Invalid credentials');
    fixture.detectChanges();
    expect(component.error).toBe('Invalid credentials');
  });

  it('should navigate to /events on successful login', () => {
    userSubject.next({ id: '1', name: 'Test', email: 'test@example.com' });
    fixture.detectChanges();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/events']);
  });
});
