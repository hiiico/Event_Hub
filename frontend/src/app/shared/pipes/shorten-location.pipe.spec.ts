import { ShortenLocationPipe } from './shorten-location.pipe';

describe('ShortenLocationPipe', () => {
  const pipe = new ShortenLocationPipe();

  it('should extract the 5th part of a comma‑separated address', () => {
    const longAddress = 'Stadtpark, Hugenberg, Engen, 78234, Berlin, Germany';
    expect(pipe.transform(longAddress)).toBe('Berlin');
  });

  it('should return first part when fewer than 5 parts', () => {
    const shortAddress = 'New York, NY';
    expect(pipe.transform(shortAddress)).toBe('New York');
  });

  it('should return "Unknown location" for falsy input', () => {
    expect(pipe.transform(null)).toBe('Unknown location');
    expect(pipe.transform(undefined)).toBe('Unknown location');
    expect(pipe.transform('')).toBe('Unknown location');
  });
});
