import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { ApiService } from '../api/api-service';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let apiServiceMock: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    apiServiceMock = jasmine.createSpyObj('ApiService', [
      'register', 'login', 'getCurrentUser', 'updateUser'
    ]);
    // Stub getCurrentUser to avoid errors during service instantiation
    apiServiceMock.getCurrentUser.and.returnValue(of(null as any));

    TestBed.configureTestingModule({
      providers: [AuthService, { provide: ApiService, useValue: apiServiceMock }]
    });

    localStorage.clear();
    service = TestBed.inject(AuthService);
  });

  it('should register and store token and user', (done) => {
    const token = 'reg-token';
    const user = { id: '1', name: 'John', email: 'john@example.com' };
    apiServiceMock.register.and.returnValue(of(token));
    // Override for this test
    apiServiceMock.getCurrentUser.and.returnValue(of(user));

    service.register('John', 'john@example.com', 'pass').subscribe(() => {
      expect(localStorage.getItem('eventhub_token')).toBe(token);
      expect(service.getCurrentUser()).toEqual(user);
      done();
    });
  });
});
