import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ApiService } from '../../../core/services/api/api-service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['register']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isAuthenticated']);
    authServiceMock.getCurrentUser.and.returnValue(null);

    TestBed.configureTestingModule({
      imports: [RegisterComponent, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register and navigate to /events on success', () => {
    apiServiceMock.register.and.returnValue(of('token'));
    component.name = 'Test';
    component.email = 'test@test.com';
    component.password = 'pass';
    component.rePassword = 'pass';
    component.onSubmit();
    expect(apiServiceMock.register).toHaveBeenCalled();
  });

  it('should show error if passwords mismatch', () => {
    component.password = 'pass';
    component.rePassword = 'diff';
    component.onSubmit();
    expect(apiServiceMock.register).not.toHaveBeenCalled();
  });
});
