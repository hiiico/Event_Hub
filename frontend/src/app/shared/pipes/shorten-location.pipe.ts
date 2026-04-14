import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenLocation',
  standalone: true
})
export class ShortenLocationPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return 'Unknown location';
    const parts = value.split(',');
    if (parts.length >= 5) {
      const candidate = parts[4].trim();
      if (candidate && candidate.length < 50) {
        return candidate;
      }
    }
    return parts[0].trim();
  }
}
