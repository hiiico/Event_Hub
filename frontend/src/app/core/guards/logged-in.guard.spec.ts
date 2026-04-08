import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { loggedInGuard } from './logged-in.guard';
import { AuthService } from '../services/auth/auth.service';

describe('loggedInGuard', () => {
  let guard: CanActivateFn;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    routerMock = jasmine.createSpyObj('Router', ['parseUrl']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = loggedInGuard;
  });

  it('should return true if user is NOT authenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(false);
    const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(result).toBeTrue();
  });

  it('should redirect to "/" if user IS authenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(true);
    const urlTree = {} as UrlTree;
    routerMock.parseUrl.and.returnValue(urlTree);
    const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(result).toBe(urlTree);
    expect(routerMock.parseUrl).toHaveBeenCalledWith('/');
  });
});
