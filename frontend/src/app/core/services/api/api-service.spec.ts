import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api-service';
import { environment } from '../../../../environments/environment.prod';

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

  it('should register a user', () => {
    const mockResponse = 'token123';
    service.register('John', 'john@example.com', 'pass').subscribe(res => {
      expect(res).toBe(mockResponse);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'John', email: 'john@example.com', password: 'pass' });
    req.flush(mockResponse, { status: 200, statusText: 'OK' });
  });

  it('should login', () => {
    const mockToken = 'token456';
    service.login('test@test.com', '123').subscribe(res => {
      expect(res).toBe(mockToken);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockToken);
  });

  it('should get current user', () => {
    const mockUser = { id: '1', name: 'John', email: 'john@example.com' };
    service.getCurrentUser().subscribe(user => {
      expect(user).toEqual(mockUser);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/users/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});
