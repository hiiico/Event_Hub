import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth/auth.service';

describe('authInterceptor', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getToken']);
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authServiceMock }]
    });
  });

  it('should add Authorization header when token exists', () => {
    authServiceMock.getToken.and.returnValue('fake-token');
    const req = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = jasmine.createSpy().and.callFake((req) => {
      expect(req.headers.has('Authorization')).toBeTrue();
      expect(req.headers.get('Authorization')).toBe('Bearer fake-token');
      return {} as any;
    });

    TestBed.runInInjectionContext(() => authInterceptor(req, next));
    expect(next).toHaveBeenCalled();
  });

  it('should not add Authorization header when token is null', () => {
    authServiceMock.getToken.and.returnValue(null);
    const req = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = jasmine.createSpy().and.callFake((req) => {
      expect(req.headers.has('Authorization')).toBeFalse();
      return {} as any;
    });

    TestBed.runInInjectionContext(() => authInterceptor(req, next));
    expect(next).toHaveBeenCalled();
  });
});
