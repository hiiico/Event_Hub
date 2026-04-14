import { TestBed } from '@angular/core/testing';
import { GeolocationService } from './geolocation.service';

describe('GeolocationService', () => {
  let service: GeolocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeolocationService);
  });

  it('should calculate distance correctly', () => {
    const berlin = { lat: 52.5200, lon: 13.4050 };
    const paris = { lat: 48.8566, lon: 2.3522 };
    const distance = service.calculateDistance(berlin.lat, berlin.lon, paris.lat, paris.lon);
    expect(distance).toBeGreaterThan(800);
    expect(distance).toBeLessThan(900);
  });

  it('should return error if geolocation not supported', () => {
    spyOnProperty(navigator, 'geolocation', 'get').and.returnValue(undefined as unknown as Geolocation);
    service.getCurrentPosition().subscribe({
      error: (err) => expect(err).toBe('Geolocation is not supported by this browser.')
    });
  });
});
