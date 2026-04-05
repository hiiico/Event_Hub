import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenLocation',
  standalone: true
})
export class ShortenLocationPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return 'Unknown location';

    // Try to extract city from common address formats
    // Often the city is the third part (id 2) but in my case it is id 4 part (e.g., "I'm Stadtpark, Hugenberg, Engen, ...")
    const parts = value.split(',');
    if (parts.length >= 5) {
      const candidate = parts[4].trim();
      if (candidate && candidate.length < 50) {
        return candidate;
      }
    }
    // Fallback to the first part
    return parts[0].trim();
  }
}
