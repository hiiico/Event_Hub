import { Component, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export interface LocationData {
  address: string;
  latitude: number | null;
  longitude: number | null;
}

@Component({
  selector: 'app-location-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocationPickerComponent),
      multi: true
    }
  ]
})
export class LocationPickerComponent implements ControlValueAccessor {
  address = '';
  latitude: number | null = null;
  longitude: number | null = null;
  loading = false;
  geocoding = false;
  error = '';

  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private http: HttpClient) {}

  async useCurrentLocation() {
    if (!navigator.geolocation) {
      this.error = 'Geolocation is not supported by your browser.';
      return;
    }
    this.loading = true;
    this.error = '';
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000
        });
      });
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      const address = await this.reverseGeocode(this.latitude, this.longitude);
      this.address = address || `${this.latitude.toFixed(4)}, ${this.longitude.toFixed(4)}`;
      this.emitValue();
    } catch (err) {
      this.error = 'Could not get your location. Please check permissions.';
      console.error('Geolocation error:', err);
    } finally {
      this.loading = false;
    }
  }

  async onAddressChange() {
    if (!this.address.trim()) {
      this.latitude = null;
      this.longitude = null;
      this.emitValue();
      return;
    }
    this.geocoding = true;
    this.error = '';
    try {
      const coords = await this.geocodeAddress(this.address);
      if (coords) {
        this.latitude = coords.lat;
        this.longitude = coords.lon;
      } else {
        this.latitude = null;
        this.longitude = null;
        this.error = 'Address not found. Please try a different location.';
      }
      this.emitValue();
    } catch (err) {
      console.error('Geocoding error:', err);
      this.error = 'Geocoding failed. Please try again.';
    } finally {
      this.geocoding = false;
    }
  }

  private async geocodeAddress(address: string): Promise<{ lat: number; lon: number } | null> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    try {
      const data = await this.http.get<any[]>(url, {
        headers: { 'User-Agent': 'EventHubApp/1.0' }
      }).toPromise();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      }
      return null;
    } catch {
      return null;
    }
  }

  private async reverseGeocode(lat: number, lon: number): Promise<string | null> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
    try {
      const data = await this.http.get<any>(url, {
        headers: { 'User-Agent': 'EventHubApp/1.0' }
      }).toPromise();
      return data?.display_name || null;
    } catch {
      return null;
    }
  }

  private emitValue() {
    const value: LocationData = {
      address: this.address,
      latitude: this.latitude,
      longitude: this.longitude
    };
    this.onChange(value);
  }

  writeValue(value: LocationData | null): void {
    if (value) {
      this.address = value.address || '';
      this.latitude = value.latitude ?? null;
      this.longitude = value.longitude ?? null;
    } else {
      this.address = '';
      this.latitude = null;
      this.longitude = null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
