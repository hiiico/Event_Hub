import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api-service';
import { environment } from '../../../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should login', () => {
    const mockToken = 'fake-token';
    const email = 'test@example.com';
    const password = 'password';

    service.login(email, password).subscribe(token => {
      expect(token).toBe(mockToken);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email, password });
    req.flush(mockToken);
  });

  it('should register a user', () => {
    const mockToken = 'fake-token';
    const name = 'Test User';
    const email = 'test@example.com';
    const password = 'password';

    service.register(name, email, password).subscribe(token => {
      expect(token).toBe(mockToken);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name, email, password });
    req.flush(mockToken);
  });

  it('should get current user', () => {
    const mockUser = { id: '1', name: 'Test', email: 'test@example.com' };

    service.getCurrentUser().subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});
